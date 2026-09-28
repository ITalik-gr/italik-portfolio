"use client";

import { useEffect, useRef } from "react";

// a small accent tag that follows the mouse over anything marked data-cursor="…"
export function CursorLabel() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const label = ref.current;
    if (!label || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    let x = -100;
    let y = -100;

    const update = () => {
      const target = document.elementFromPoint(x, y)?.closest<HTMLElement>("[data-cursor]");
      label.style.transform = `translate(${x + 14}px, ${y + 14}px)`;
      label.dataset.visible = String(Boolean(target));
      if (target) label.textContent = target.dataset.cursor ?? "";
    };
    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      x = event.clientX;
      y = event.clientY;
      update();
    };
    // content scrolls under a still mouse, so re-check what is under it
    const onScroll = () => update();
    const onLeave = () => {
      label.dataset.visible = "false";
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      data-visible="false"
      className="pointer-events-none fixed top-0 left-0 z-50 bg-accent px-[10px] py-[6px] font-mono text-[11px] leading-[14px] tracking-[0.08em] text-accent-ink uppercase opacity-0 transition-opacity duration-150 data-[visible=true]:opacity-100"
    />
  );
}
