// the /api/chat wire format: one JSON object per line (NDJSON), shared by the route and the client
import type { ChatSource } from "./types";

export type ChatErrorCode = "invalid" | "rate_limited" | "budget" | "unavailable" | "failed";

export type ChatEvent =
  | { type: "text"; text: string }
  | { type: "done"; sources: ChatSource[]; link?: { label: string; href: string } }
  | { type: "error"; code: ChatErrorCode };

export type ChatRequest = { messages: { role: "user" | "assistant"; content: string }[] };
