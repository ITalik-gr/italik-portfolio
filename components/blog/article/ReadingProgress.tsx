"use client";

import { useEffect, useRef } from "react";

// a 2px accent line at the very top that fills as the article is read
export function ReadingProgress() {
  const bar = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const { scrollHeight, clientHeight } = document.documentElement;
      const max = scrollHeight - clientHeight;
      bar.current?.style.setProperty("transform", `scaleX(${max > 0 ? window.scrollY / max : 0})`);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div
      ref={bar}
      aria-hidden
      className="pointer-events-none fixed inset-x-0 top-0 z-50 h-[2px] origin-left scale-x-0 bg-accent"
    />
  );
}
