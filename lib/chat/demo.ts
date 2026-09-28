import type { ChatMessage } from "./types";

// a sample exchange (copy from the design reference) shown until the visitor asks something; labelled as an example
export const DEMO_MESSAGES: ChatMessage[] = [
  { id: "demo-q", role: "user", content: "How does Money Track avoid made-up numbers?" },
  {
    id: "demo-a",
    role: "assistant",
    status: "done",
    example: true,
    content:
      "It keeps the model away from arithmetic. Every number comes from one canonical SQL layer over D1, and each user's data is isolated in its own Durable Object. The LLM advisor only receives those query results as grounded context and explains them; it never computes totals or writes to the data itself.",
    sources: [{ label: "money-track.md", href: "/work/money-track" }],
    link: { label: "Read the Money Track case study", href: "/work/money-track" },
  },
];
