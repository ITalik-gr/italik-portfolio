"use client";

import { useState } from "react";
import type { ChatMessage } from "@/lib/chat/types";
import { ASK } from "@/lib/site";
import { cn } from "@/lib/utils";
import { ChatInput } from "./ChatInput";
import { ChatMessageView } from "./ChatMessageView";
import { SuggestionChips } from "./SuggestionChips";

type Props = {
  initialMessages?: ChatMessage[];
  // "section" sits in the Ask AI block; "drawer" fills the sheet opened by the FAB (phase 7)
  variant?: "section" | "drawer";
  className?: string;
};

export function ChatPanel({ initialMessages = [], variant = "section", className }: Props) {
  const [messages] = useState(initialMessages);
  const [input, setInput] = useState("");
  const lastQuestion = messages.findLast((message) => message.role === "user")?.content;

  // TODO: phase 7 — POST to /api/chat, append the question, stream the answer into a "streaming" message
  const send = () => {};

  return (
    <div
      className={cn(
        "flex flex-col border border-line bg-bg",
        variant === "drawer" && "h-full border-0",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-[12px] px-[18px] py-[14px] font-mono text-[11px] leading-[14px] tracking-[0.06em] text-muted uppercase">
        <span className="flex items-center gap-[8px]">
          <span aria-hidden className="size-[6px] rounded-full bg-accent" />
          {ASK.channel}
        </span>
        <span className="hidden | sm:inline">{ASK.languageNote}</span>
      </div>

      <div
        role="log"
        aria-live="polite"
        aria-label="Conversation"
        className="flex flex-1 flex-col gap-[24px] overflow-y-auto px-[18px] pt-[16px] pb-[24px]"
      >
        {messages.map((message) => (
          <ChatMessageView key={message.id} message={message} />
        ))}
      </div>

      <SuggestionChips suggestions={ASK.chips} active={lastQuestion} onPick={setInput} />
      <ChatInput value={input} onChange={setInput} onSubmit={send} />
    </div>
  );
}
