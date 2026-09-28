import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import { createSourcesFilter, resolveSources } from "@/lib/chat/answer";
import { CHAT } from "@/lib/chat/config";
import { getKnowledge } from "@/lib/chat/knowledge";
import { allowRequest, budgetLeft, recordSpend } from "@/lib/chat/limits";
import { CHAT_RULES } from "@/lib/chat/prompt";
import type { ChatErrorCode, ChatEvent } from "@/lib/chat/protocol";

export const maxDuration = 30;

const bodySchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().trim().min(1).max(4000),
      }),
    )
    .min(1)
    .max(40),
});

const encoder = new TextEncoder();
const line = (event: ChatEvent) => encoder.encode(`${JSON.stringify(event)}\n`);
const fail = (code: ChatErrorCode, status: number) =>
  new Response(`${JSON.stringify({ type: "error", code })}\n`, {
    status,
    headers: { "content-type": "application/x-ndjson" },
  });

const clientIp = (request: Request) =>
  request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
  request.headers.get("x-real-ip") ||
  "local";

// evals run many questions in a row; they skip the per-IP limit with a shared secret, never the daily budget
const isEvalRun = (request: Request) =>
  Boolean(process.env.CHAT_EVAL_SECRET) &&
  request.headers.get("x-chat-eval") === process.env.CHAT_EVAL_SECRET;

export async function POST(request: Request) {
  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return fail("invalid", 400);

  // keep the recent context, and make sure it starts with a question and ends with one
  const history = parsed.data.messages.slice(-CHAT.historyMessages);
  while (history[0]?.role === "assistant") history.shift();
  const question = history.at(-1);
  if (!question || question.role !== "user" || question.content.length > CHAT.maxQuestionChars) {
    return fail("invalid", 400);
  }

  if (!process.env.ANTHROPIC_API_KEY) return fail("unavailable", 503);
  if (!isEvalRun(request) && !(await allowRequest(clientIp(request))))
    return fail("rate_limited", 429);
  if (!(await budgetLeft())) return fail("budget", 503);

  const knowledge = getKnowledge();
  const client = new Anthropic({ timeout: CHAT.requestTimeoutMs, maxRetries: 1 });

  const body = new ReadableStream<Uint8Array>({
    async start(controller) {
      const filter = createSourcesFilter();
      try {
        const stream = client.messages.stream(
          {
            model: CHAT.model,
            max_tokens: CHAT.maxOutputTokens,
            system: [
              { type: "text", text: CHAT_RULES },
              // the knowledge base is the big stable part: cached, so repeat questions cost ~10% of it
              {
                type: "text",
                text: `<knowledge_base>\n${knowledge.text}\n</knowledge_base>`,
                cache_control: { type: "ephemeral" },
              },
            ],
            messages: history,
          },
          { signal: request.signal },
        );

        for await (const event of stream) {
          if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
            const text = filter.push(event.delta.text);
            if (text) controller.enqueue(line({ type: "text", text }));
          }
        }

        const message = await stream.finalMessage();
        await recordSpend(message.usage);
        // numbers only, never the question: enough to watch cost and cache hits in the logs
        const {
          input_tokens,
          output_tokens,
          cache_read_input_tokens,
          cache_creation_input_tokens,
        } = message.usage;
        console.info(
          `[chat] ${CHAT.model} in=${input_tokens} out=${output_tokens} cache_read=${cache_read_input_tokens ?? 0} cache_write=${cache_creation_input_tokens ?? 0} stop=${message.stop_reason}`,
        );
        controller.enqueue(
          line({ type: "done", ...resolveSources(filter.trailer(), knowledge.sources) }),
        );
      } catch (error) {
        if (!request.signal.aborted) {
          console.error(
            "[chat]",
            error instanceof Anthropic.APIError ? `${error.status} ${error.message}` : error,
          );
          controller.enqueue(line({ type: "error", code: "failed" }));
        }
      } finally {
        controller.close();
      }
    },
  });

  return new Response(body, {
    headers: { "content-type": "application/x-ndjson; charset=utf-8", "cache-control": "no-store" },
  });
}
