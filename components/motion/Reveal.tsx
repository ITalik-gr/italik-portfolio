"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef, type CSSProperties, type ReactNode, type RefObject } from "react";
import { cn } from "@/lib/utils";

gsap.registerPlugin(useGSAP, ScrollTrigger);

type Props = {
  children: ReactNode;
  className?: string;
  delay?: number;
  // lists reveal their items directly, so the wrapper can be the list itself
  as?: "div" | "ol" | "ul";
  y?: number;
  stagger?: number;
  duration?: number;
  style?: CSSProperties;
};

// direct children rise in one after another: right away if the block is on screen at load, otherwise when scrolled to.
// CSS hides them before hydration (html.js, see globals.css), so nothing flashes in and then disappears
export function Reveal({
  children,
  className,
  delay = 0,
  as: Tag = "div",
  y = 24,
  stagger = 0.08,
  duration = 0.6,
  style,
}: Props) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const items = [...el.children];
        gsap.set(items, { opacity: 0, y });
        el.dataset.revealed = "true";
        const tween = { opacity: 1, y: 0, duration, ease: "expo.out", stagger };

        if (ScrollTrigger.isInViewport(el, 0.05)) gsap.to(items, { ...tween, delay: 0.1 + delay });
        else
          gsap.to(items, {
            ...tween,
            scrollTrigger: { trigger: el, start: "top 88%", once: true },
          });
      });
      mm.add("(prefers-reduced-motion: reduce)", () => {
        el.dataset.revealed = "true";
      });
    },
    { scope: ref },
  );

  return (
    // one ref serves all three tags; React only needs an element there
    <Tag ref={ref as RefObject<never>} data-reveal className={cn(className)} style={style}>
      {children}
    </Tag>
  );
}
