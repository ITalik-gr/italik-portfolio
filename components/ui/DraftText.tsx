import { Emphasis } from "./Emphasis";

const TODO = /^TODO:?\s*/;

// unfinished content stays visible in grey brackets instead of reading like a real claim
export function DraftText({ text }: { text: string }) {
  if (!TODO.test(text)) return <Emphasis text={text} />;
  return <span className="text-muted">[TODO · {text.replace(TODO, "")}]</span>;
}
