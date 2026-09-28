// what the chat UI renders; the API streams into these through lib/chat/store.ts
export type ChatSource = { label: string; href?: string };

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  status?: "streaming" | "done" | "error";
  sources?: ChatSource[];
  link?: { label: string; href: string };
  // the sample exchange shown before the first real question
  example?: boolean;
};
