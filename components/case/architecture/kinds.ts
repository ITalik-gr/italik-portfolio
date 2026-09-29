import { ARCH_KINDS, type ArchKind } from "@/lib/schemas-architecture";

export const KIND_LABELS: Record<ArchKind, string> = {
  input: "Input",
  code: "Code",
  llm: "LLM",
  check: "Check",
  output: "Output",
  external: "External",
};

// a check is a solid white block in the flow and a white outline on the map
export type KindContext = "flow" | "map";

const PLAIN = "border border-line-strong bg-surface";

export function kindBox(kind: ArchKind, context: KindContext) {
  if (kind === "llm") return "border border-dashed border-accent bg-accent-bg";
  if (kind === "external") return "border border-dashed border-muted";
  if (kind === "check")
    return context === "flow" ? "border border-text bg-text" : "border border-text bg-surface";
  return PLAIN;
}

export function kindLabelColor(kind: ArchKind, context: KindContext) {
  if (kind === "llm") return "text-accent";
  if (kind === "check") return context === "flow" ? "text-faint" : "text-text";
  return "text-muted";
}

// the kinds a case uses, each once, in a fixed order for the legend
export function uniqueKinds(kinds: ArchKind[]) {
  return ARCH_KINDS.filter((kind) => kinds.includes(kind));
}
