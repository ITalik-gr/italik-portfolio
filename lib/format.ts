import type { ProjectStatus } from "./schemas";

const TAG_LABELS: Record<string, string> = {
  llm: "LLM",
  mcp: "MCP",
  rag: "RAG",
  "open-source": "Open source",
  "marketing-site": "Marketing site",
  "web-app": "Web app",
};

export function formatTag(tag: string) {
  return TAG_LABELS[tag] ?? tag.charAt(0).toUpperCase() + tag.slice(1);
}

export const STATUS_LABELS: Record<ProjectStatus, string> = {
  live: "Live",
  building: "Building",
  "v2-in-progress": "v2 in progress",
  "next-up": "Next up",
  nda: "NDA",
  offline: "Offline",
  archived: "Archived",
};
