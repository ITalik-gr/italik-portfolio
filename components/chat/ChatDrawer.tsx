"use client";

import { useEffect, useRef } from "react";
import { closeChatDrawer, useChat } from "@/lib/chat/store";
import { ASK } from "@/lib/site";
import { cn } from "@/lib/utils";
import { ChatPanel } from "./ChatPanel";

// the chat on every page: a sheet on the right on desktop, full screen on mobile
export function ChatDrawer() {
  const { drawerOpen } = useChat();
  const returnFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!drawerOpen) return;
    returnFocus.current = document.activeElement as HTMLElement | null;
    // overflow: hidden also pauses Lenis (autoToggle)
    document.documentElement.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && closeChatDrawer();
    window.addEventListener("keydown", onKey);
    return () => {
      document.documentElement.style.overflow = "";
      window.removeEventListener("keydown", onKey);
      returnFocus.current?.focus();
    };
  }, [drawerOpen]);

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 transition-[visibility] duration-400",
        drawerOpen ? "visible" : "invisible",
      )}
    >
      <button
        type="button"
        aria-label="Close the chat"
        tabIndex={-1}
        onClick={closeChatDrawer}
        className={cn(
          "absolute inset-0 bg-bg/70 transition-opacity duration-400 ease-out-expo motion-reduce:transition-none",
          drawerOpen ? "opacity-100" : "opacity-0",
        )}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="chat-drawer-title"
        className={cn(
          "absolute inset-0 flex flex-col border-line bg-bg transition-transform duration-400 ease-out-expo motion-reduce:transition-none | md:left-auto md:w-[440px] md:border-l",
          drawerOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="flex items-center justify-between gap-[12px] border-b border-line py-[10px] pr-[10px] pl-[18px]">
          <h2
            id="chat-drawer-title"
            className="flex items-center gap-[8px] font-mono text-[12px] leading-[16px] tracking-[0.06em] uppercase"
          >
            <span aria-hidden className="size-[6px] rounded-full bg-accent" />
            {ASK.drawerTitle}
          </h2>
          <button
            type="button"
            onClick={closeChatDrawer}
            aria-label="Close the chat"
            className="flex size-[44px] items-center justify-center border border-line-strong font-mono text-[14px] transition-colors hover:border-accent hover:text-accent"
          >
            ✕
          </button>
        </div>
        {drawerOpen && <ChatPanel variant="drawer" autoFocus className="min-h-0 flex-1" />}
      </div>
    </div>
  );
}
