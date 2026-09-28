import Link from "next/link";
import { Button } from "@/components/ui/Button";
import type { ChatMessage } from "@/lib/chat/types";
import { Emphasis } from "@/components/ui/Emphasis";
import { ASK } from "@/lib/site";
import { cn } from "@/lib/utils";

const STATUS_LABEL = {
  streaming: "Answering…",
  done: "Answered · grounded",
  error: "Something broke",
};

export function ChatMessageView({ message }: { message: ChatMessage }) {
  if (message.role === "user") {
    return (
      <div className="max-w-[78%] self-end bg-surface-2 px-[16px] py-[14px] text-fl-15/16 leading-[1.45]">
        {message.content}
      </div>
    );
  }

  const status = message.status ?? "done";
  // the model writes plain paragraphs, sometimes with **bold**: render both, never raw markdown

  return (
    <div className="flex max-w-full flex-col gap-[14px] self-start | md:max-w-[90%]">
      <p className="flex gap-[10px] font-mono text-[11px] leading-[14px] tracking-[0.06em] uppercase">
        <span className="text-accent">{ASK.assistantName}</span>
        <span className="text-muted">
          {message.example ? "Example answer" : STATUS_LABEL[status]}
        </span>
      </p>
      <div
        className={cn(
          "flex flex-col gap-[12px] text-fl-16/18 leading-[1.55]",
          status === "error" && "text-text-3",
        )}
      >
        {message.content.split(/\n{2,}/).map((paragraph, index, all) => (
          <p key={index} className="whitespace-pre-line">
            <Emphasis text={paragraph} />
            {status === "streaming" && index === all.length - 1 && <Caret />}
          </p>
        ))}
      </div>

      {message.sources && message.sources.length > 0 && (
        <div className="flex flex-wrap items-center gap-[6px] font-mono text-[11px] leading-[14px]">
          <span className="mr-[4px] text-muted uppercase">Sources</span>
          {message.sources.map((source) =>
            source.href ? (
              <Link
                key={source.label}
                href={source.href}
                className="border border-line-strong px-[8px] py-[5px] text-text-3 transition-colors hover:border-accent hover:text-accent"
              >
                {source.label}
              </Link>
            ) : (
              <span
                key={source.label}
                className="border border-line-strong px-[8px] py-[5px] text-text-3"
              >
                {source.label}
              </span>
            ),
          )}
        </div>
      )}
      {message.link && (
        <Button href={message.link.href} size="sm" arrow="→" className="self-start">
          {message.link.label}
        </Button>
      )}
    </div>
  );
}

// static caret while tokens arrive; only the FAB is allowed to blink
function Caret() {
  return (
    <span aria-hidden className="ml-[3px] inline-block h-[18px] w-[9px] bg-accent align-[-3px]" />
  );
}
