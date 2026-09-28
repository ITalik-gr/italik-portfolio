"use client";

import { useEffect, useRef, useState } from "react";
import { DEMO_MESSAGES } from "@/lib/chat/demo";
import { sendQuestion, useChat } from "@/lib/chat/store";
import { ASK } from "@/lib/site";
import { cn } from "@/lib/utils";
import { ChatInput } from "./ChatInput";
import { ChatMessageView } from "./ChatMessageView";
import { SuggestionChips } from "./SuggestionChips";

type Props = {
  // "section" sits in the Ask AI block; "drawer" fills the sheet opened by the FAB
  variant?: "section" | "drawer";
  autoFocus?: boolean;
  className?: string;
};

export function ChatPanel({ variant = "section", autoFocus, className }: Props) {
  const { messages, busy } = useChat();
  const [input, setInput] = useState("");
  const logRef = useRef<HTMLDivElement>(null);
  const shown = messages.length > 0 ? messages : DEMO_MESSAGES;
  const lastQuestion = messages.findLast((message) => message.role === "user")?.content;
  const lastLength = shown.at(-1)?.content.length ?? 0;

  // follow the answer as it streams, but only if the reader is already at the bottom
  useEffect(() => {
    const log = logRef.current;
    if (!log) return;
    const nearBottom = log.scrollHeight - log.scrollTop - log.clientHeight < 120;
    if (nearBottom || busy) log.scrollTop = log.scrollHeight;
  }, [shown.length, lastLength, busy]);

  const send = (question = input) => {
    void sendQuestion(question);
    setInput("");
  };

  return (
    <div
      className={cn(
        "flex flex-col border border-line bg-bg",
        variant === "drawer" && "h-full min-h-0 border-0",
        className,
      )}
    >
      {variant === "section" && (
        <div className="flex items-center justify-between gap-[12px] px-[18px] py-[14px] font-mono text-[11px] leading-[14px] tracking-[0.06em] text-muted uppercase">
          <span className="flex items-center gap-[8px]">
            <span aria-hidden className="size-[6px] rounded-full bg-accent" />
            {ASK.channel}
          </span>
          <span className="hidden | sm:inline">{ASK.languageNote}</span>
        </div>
      )}

      <div
        ref={logRef}
        role="log"
        aria-live="polite"
        aria-label="Conversation"
        data-lenis-prevent
        className={cn(
          "flex flex-1 flex-col gap-[24px] overflow-y-auto overscroll-contain px-[18px] pt-[16px] pb-[24px]",
          variant === "section" && "max-h-[560px]",
          variant === "drawer" && "min-h-0",
        )}
      >
        {shown.map((message) => (
          <ChatMessageView key={message.id} message={message} />
        ))}
      </div>

      <SuggestionChips
        suggestions={ASK.chips}
        active={lastQuestion}
        onPick={(question) => (busy ? setInput(question) : send(question))}
      />
      <ChatInput
        value={input}
        onChange={setInput}
        onSubmit={() => send()}
        disabled={busy}
        autoFocus={autoFocus}
      />
    </div>
  );
}
