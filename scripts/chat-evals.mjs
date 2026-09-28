// Runs tests/chat-evals.json against a running site: `pnpm chat:evals` (defaults to http://localhost:3000).
// Every run calls the real model and costs money. CHAT_EVAL_SECRET (same value as the server's) skips the per-IP limit.
import fs from "node:fs";

const base = process.env.CHAT_EVAL_URL ?? "http://localhost:3000";
const only = process.argv[2];
const { cases } = JSON.parse(
  fs.readFileSync(new URL("../tests/chat-evals.json", import.meta.url), "utf8"),
);

async function ask(question) {
  const response = await fetch(`${base}/api/chat`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      ...(process.env.CHAT_EVAL_SECRET && { "x-chat-eval": process.env.CHAT_EVAL_SECRET }),
    },
    body: JSON.stringify({ messages: [{ role: "user", content: question }] }),
  });
  let text = "";
  let sources = [];
  for (const line of (await response.text()).split("\n")) {
    if (!line.trim()) continue;
    const event = JSON.parse(line);
    if (event.type === "text") text += event.text;
    if (event.type === "done") sources = event.sources.map((s) => s.label);
    if (event.type === "error")
      throw new Error(`API error: ${event.code} (HTTP ${response.status})`);
  }
  return { text, sources };
}

function check(test, text) {
  const lower = text.toLowerCase();
  const has = (needle) => lower.includes(needle.toLowerCase());
  const problems = [];
  for (const needle of test.includeAll ?? [])
    if (!has(needle)) problems.push(`missing "${needle}"`);
  if (test.includeAny && !test.includeAny.some(has))
    problems.push(`none of ${JSON.stringify(test.includeAny)}`);
  for (const needle of test.exclude ?? []) if (has(needle)) problems.push(`contains "${needle}"`);
  for (const pattern of test.excludeRegex ?? [])
    if (new RegExp(pattern, "i").test(text)) problems.push(`matches /${pattern}/`);
  if (test.cyrillic && !/[а-яіїєґ]/i.test(text))
    problems.push("not answered in the question's language");
  if (text.includes("[[")) problems.push("sources trailer leaked into the answer");
  return problems;
}

const selected = cases.filter((c) => !only || c.id === only);
let failed = 0;
for (const test of selected) {
  try {
    const { text, sources } = await ask(test.question);
    const problems = check(test, text);
    if (problems.length) failed++;
    console.log(
      `${problems.length ? "✘" : "✓"} ${test.id}${problems.length ? `: ${problems.join("; ")}` : ""}`,
    );
    if (problems.length || process.env.VERBOSE)
      console.log(`    ${text.replace(/\n/g, " ")}\n    sources: ${sources.join(", ") || "none"}`);
  } catch (error) {
    failed++;
    console.log(`✘ ${test.id}: ${error.message}`);
  }
}
console.log(`\n${selected.length - failed}/${selected.length} passed`);
process.exit(failed ? 1 : 0);
