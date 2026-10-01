"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

// event + data: what the copy is for (code_copy with the file, share with copy_link), see Analytics
type Props = { text: string; label?: string; className?: string; event: string; data?: Record<string, string> };

// copies and says so for a moment; the copied state is the only accent on the button
export function CopyButton({ text, label = "Copy", className, event, data = {} }: Props) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 1600);
    return () => clearTimeout(timer);
  }, [copied]);

  return (
    <button
      type="button"
      data-track={event}
      {...Object.fromEntries(Object.entries(data).map(([key, value]) => [`data-track-${key}`, value]))}
      onClick={() => {
        navigator.clipboard?.writeText(text).then(() => setCopied(true), () => {});
      }}
      className={cn(
        "h-[30px] border border-line-strong bg-bg px-[10px] font-mono text-[11px] tracking-[0.06em] uppercase transition-colors duration-150 hover:border-accent",
        copied ? "text-accent" : "text-text",
        className,
      )}
    >
      <span aria-live="polite">{copied ? "Copied" : label}</span>
    </button>
  );
}
