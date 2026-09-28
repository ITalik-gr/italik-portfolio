// shapes the phase 7 API will stream into; the UI only ever renders these
export type ChatSource = { label: string; href?: string };

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  status?: "streaming" | "done" | "error";
  sources?: ChatSource[];
  link?: { label: string; href: string };
};
