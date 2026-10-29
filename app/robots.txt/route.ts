import { siteUrl } from "@/lib/seo";

export const dynamic = "force-static";

// a crawler that matches a named group ignores `*`, so the AI group repeats the same rules
const AI_BOTS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-SearchBot",
  "Claude-User",
  "anthropic-ai",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Applebot-Extended",
  "Amazonbot",
  "Bytespider",
  "CCBot",
  "meta-externalagent",
  "DuckAssistBot",
  "MistralAI-User",
  "cohere-ai",
];

// Content-Signal (contentsignals.org) isn't supported by app/robots.ts, hence a route handler
const rules = [
  "Allow: /",
  "Disallow: /api/",
  "Content-Signal: search=yes, ai-input=yes, ai-train=yes",
];

export function GET() {
  const body = [
    "User-agent: *",
    ...rules,
    "",
    ...AI_BOTS.map((bot) => `User-agent: ${bot}`),
    ...rules,
    "",
    `Host: ${siteUrl}`,
    `Sitemap: ${siteUrl}/sitemap.xml`,
    "",
  ].join("\n");
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
