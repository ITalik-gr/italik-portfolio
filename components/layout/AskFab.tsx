"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

// hide near the page end so the footer stays fully visible
const BOTTOM_OFFSET = 100;

// TODO: opens the chat drawer in phase 7; until then it jumps to the Ask AI section
export function AskFab() {
  const [nearBottom, setNearBottom] = useState(false);
  const [ctaVisible, setCtaVisible] = useState(false);
  const hidden = nearBottom || ctaVisible;

  useEffect(() => {
    const update = () => {
      const { scrollHeight } = document.documentElement;
      setNearBottom(window.scrollY + window.innerHeight >= scrollHeight - BOTTOM_OFFSET);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  // the hero has its own "Ask my AI" button, so the FAB waits until it scrolls away
  useEffect(() => {
    const targets = document.querySelectorAll("[data-hides-fab]");
    if (targets.length === 0) return;
    const visible = new Set<Element>();
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) =>
        entry.isIntersecting ? visible.add(entry.target) : visible.delete(entry.target),
      );
      setCtaVisible(visible.size > 0);
    });
    targets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, []);

  return (
    <Link
      href="/#ask"
      aria-hidden={hidden}
      tabIndex={hidden ? -1 : undefined}
      className={cn(
        "fixed right-fl-16/28 bottom-fl-16/28 z-30 flex items-center gap-[10px] border border-text bg-bg px-[18px] py-[14px] font-mono text-[13px] leading-[17px] tracking-[0.06em] text-text uppercase transition-[opacity,translate,color,border-color] duration-400 ease-out-expo hover:border-accent hover:text-accent",
        hidden && "pointer-events-none translate-y-[16px] opacity-0",
      )}
    >
      <span aria-hidden className="size-[7px] animate-pulse-dot rounded-full bg-accent" />
      Ask AI
    </Link>
  );
}
