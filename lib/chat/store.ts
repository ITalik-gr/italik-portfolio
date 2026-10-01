"use client";

import { useSyncExternalStore } from "react";
import { track } from "@/lib/analytics";
import { SITE } from "@/lib/site";
import type { ChatErrorCode, ChatEvent, ChatRequest } from "./protocol";
import type { ChatMessage } from "./types";

type State = { messages: ChatMessage[]; busy: boolean; drawerOpen: boolean };

// one conversation per page view, shared by the Ask AI section and the drawer; a reload starts over
let state: State = { messages: [], busy: false, drawerOpen: false };
const listeners = new Set<() => void>();
const set = (next: Partial<State>) => {
  state = { ...state, ...next };
  listeners.forEach((listener) => listener());
};
const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};
const SERVER_STATE: State = { messages: [], busy: false, drawerOpen: false };

export function useChat() {
  return useSyncExternalStore(
    subscribe,
    () => state,
    () => SERVER_STATE,
  );
}

// via: what opened it (fab, button, hero_field), so each entry point can be compared
export const openChatDrawer = (via = "button") => {
  track("chat_open", { via, messages: state.messages.length });
  set({ drawerOpen: true });
};
export const closeChatDrawer = () => {
  if (state.drawerOpen) track("chat_close", { messages: state.messages.length });
  set({ drawerOpen: false });
};

const ERROR_TEXT: Record<ChatErrorCode, string> = {
  invalid: "That question didn't come through. Try a shorter one?",
  rate_limited: `You're asking faster than I can answer. Give it a few minutes, or email Vitaliy: ${SITE.email}`,
  budget: `The chat is resting for today. Email Vitaliy instead: ${SITE.email}`,
  unavailable: `The chat is offline right now. Email Vitaliy instead: ${SITE.email}`,
  failed: `Something broke on my side. Email Vitaliy instead: ${SITE.email}`,
};

let counter = 0;
const newId = () => `m${Date.now()}-${counter++}`;

function updateLast(patch: (message: ChatMessage) => ChatMessage) {
  const messages = [...state.messages];
  messages[messages.length - 1] = patch(messages[messages.length - 1]);
  set({ messages });
}

export async function sendQuestion(question: string) {
  const text = question.trim();
  if (!text || state.busy) return;

  // only finished exchanges go back as context; failed answers are left out
  const history = state.messages
    .filter((m) => m.role === "user" || m.status === "done")
    .map(({ role, content }) => ({ role, content }));
  set({
    busy: true,
    messages: [
      ...state.messages,
      { id: newId(), role: "user", content: text },
      { id: newId(), role: "assistant", content: "", status: "streaming" },
    ],
  });

  const started = Date.now();
  const turn = history.filter((m) => m.role === "user").length + 1;
  const failWith = (code: ChatErrorCode) => {
    track("chat_error", { code, turn, ms: Date.now() - started });
    updateLast((m) => ({ ...m, status: "error", content: ERROR_TEXT[code] }));
  };

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        messages: [...history, { role: "user", content: text }],
      } satisfies ChatRequest),
    });
    if (!response.body) return failWith("failed");

    const reader = response.body.pipeThrough(new TextDecoderStream()).getReader();
    let pending = "";
    for (;;) {
      const { value, done } = await reader.read();
      if (done) break;
      pending += value;
      const lines = pending.split("\n");
      pending = lines.pop() ?? "";
      for (const raw of lines) {
        if (!raw.trim()) continue;
        const event = JSON.parse(raw) as ChatEvent;
        if (event.type === "text") updateLast((m) => ({ ...m, content: m.content + event.text }));
        if (event.type === "error") return failWith(event.code);
        if (event.type === "done") {
          const answer = state.messages.at(-1)?.content ?? "";
          track("chat_answer", {
            turn,
            ms: Date.now() - started,
            chars: answer.trim().length,
            sources: event.sources.length,
            source: event.sources.map((s) => s.label).join(", ").slice(0, 120),
            link: event.link?.href ?? "",
          });
          updateLast((m) => ({
            ...m,
            content: m.content.trimEnd(),
            status: "done",
            sources: event.sources,
            link: event.link,
          }));
        }
      }
    }
    if (state.messages.at(-1)?.status === "streaming") failWith("failed");
  } catch {
    failWith("failed");
  } finally {
    set({ busy: false });
  }
}
