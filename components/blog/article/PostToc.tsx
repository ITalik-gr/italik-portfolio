"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type Item = { id: string; label: string };

// the heading whose top has passed this line (px from the viewport top) is the current section
const ACTIVE_LINE = 220;

function useActiveSection(items: Item[]) {
  const [active, setActive] = useState(0);
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      let current = 0;
      items.forEach((item, index) => {
        const top = document.getElementById(item.id)?.getBoundingClientRect().top;
        if (top !== undefined && top < ACTIVE_LINE) current = index;
      });
      setActive(current);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, [items]);
  return active;
}

const number = (index: number) => String(index + 1).padStart(2, "0");

// desktop: a sticky list in the right margin
export function PostTocRail({ items }: { items: Item[] }) {
  const active = useActiveSection(items);
  return (
    <nav aria-label="Contents" className="sticky top-[104px] flex w-[190px] flex-col gap-[14px]">
      <span className="font-mono text-[11px] tracking-[0.06em] text-faint uppercase">Contents</span>
      {items.map((item, index) => (
        <a
          key={item.id}
          href={`#${item.id}`}
          data-track="toc_click"
          data-track-section={item.id}
          data-track-via="rail"
          data-track-number={index + 1}
          aria-current={index === active ? "location" : undefined}
          className={cn(
            "grid grid-cols-[26px_1fr] items-baseline text-[14px] leading-[1.35] transition-colors duration-250",
            index === active ? "text-accent" : "text-text-3 hover:text-text",
          )}
        >
          <span className={cn("font-mono text-[11px]", index === active ? "text-accent" : "text-faint")}>
            {number(index)}
          </span>
          {item.label}
        </a>
      ))}
    </nav>
  );
}

// smaller screens: a bar under the header that names the current section and opens the list
export function PostTocBar({ items }: { items: Item[] }) {
  const active = useActiveSection(items);
  const [open, setOpen] = useState(false);

  return (
    <nav
      aria-label="Contents"
      className="sticky top-[64px] z-30 border-y border-zone-line bg-bg | md:top-[72px] | xl:hidden"
    >
      <button
        type="button"
        aria-expanded={open}
        aria-controls="post-toc-list"
        data-track="toc_toggle"
        data-track-open={String(!open)}
        onClick={() => setOpen((value) => !value)}
        className="flex h-[48px] w-full items-center gap-[12px] px-gutter text-left font-mono text-[12px] tracking-[0.06em] uppercase"
      >
        <span className="shrink-0 text-muted">Contents</span>
        <span className="min-w-0 truncate text-accent">{items[active]?.label}</span>
        <span aria-hidden className="shrink-0 text-[14px] text-text">
          {open ? "▴" : "▾"}
        </span>
      </button>
      {open && (
        <div id="post-toc-list" className="flex flex-col border-t border-zone-line px-gutter pb-[12px]">
          {items.map((item, index) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              data-track="toc_click"
              data-track-section={item.id}
              data-track-via="bar"
              data-track-number={index + 1}
              onClick={() => setOpen(false)}
              className={cn(
                "grid min-h-[44px] grid-cols-[32px_1fr] items-center text-[16px]",
                index === active ? "text-accent" : "text-text",
              )}
            >
              <span className={cn("font-mono text-[11px]", index === active ? "text-accent" : "text-faint")}>
                {number(index)}
              </span>
              {item.label}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
}
