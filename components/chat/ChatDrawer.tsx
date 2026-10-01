"use client";

import { useEffect, useRef } from "react";
import { useHomePath } from "@/components/layout/HomeLink";
import { closeChatDrawer, useChat } from "@/lib/chat/store";
import { ASK } from "@/lib/site";
import { cn } from "@/lib/utils";
import { ChatPanel } from "./ChatPanel";

// chipsByHome: each home page's own questions, so the drawer asks what the section on that page asks
type Props = { chipsByHome: Record<string, readonly string[]> };

// the chat on every page: a sheet on the right on desktop, full screen on mobile
export function ChatDrawer({ chipsByHome }: Props) {
  const { drawerOpen } = useChat();
  const chips = chipsByHome[useHomePath()];
  const returnFocus = useRef<HTMLElement | null>(null);
  const dialog = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!drawerOpen) return;
    returnFocus.current = document.activeElement as HTMLElement | null;
    // overflow: hidden also pauses Lenis (autoToggle)
    document.documentElement.style.overflow = "hidden";
    // focused here, not via autoFocus: autoFocus would run first and returnFocus would record the input
    const frame = requestAnimationFrame(() =>
      dialog.current?.querySelector<HTMLElement>("textarea, input")?.focus(),
    );
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeChatDrawer();
      if (event.key === "Tab") trapTab(event, dialog.current);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      cancelAnimationFrame(frame);
      document.documentElement.style.overflow = "";
      window.removeEventListener("keydown", onKey);
      returnFocus.current?.focus();
    };
  }, [drawerOpen]);

  return (
    <div
      className={cn(
        // visible at once on open (so focus can land), hidden only after the slide-out on close
        "fixed inset-0 z-50",
        drawerOpen ? "visible" : "invisible transition-[visibility] duration-400",
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
        ref={dialog}
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
            className="flex items-center gap-[8px] text-[14px] leading-[20px]"
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
        {drawerOpen && (
          <ChatPanel variant="drawer" suggestions={chips} className="min-h-0 flex-1" />
        )}
      </div>
    </div>
  );
}

// aria-modal alone doesn't stop Tab from reaching the page behind, so keep it cycling inside
function trapTab(event: KeyboardEvent, root: HTMLElement | null) {
  if (!root) return;
  const items = [
    ...root.querySelectorAll<HTMLElement>(
      "a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex='-1'])",
    ),
  ].filter((item) => item.offsetParent !== null);
  if (items.length === 0) return;
  const first = items[0];
  const last = items[items.length - 1];
  const active = document.activeElement;
  if (event.shiftKey && (active === first || !root.contains(active))) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && (active === last || !root.contains(active))) {
    event.preventDefault();
    first.focus();
  }
}
