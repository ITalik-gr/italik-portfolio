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
