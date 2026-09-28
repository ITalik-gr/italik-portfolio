"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

gsap.registerPlugin(useGSAP, ScrollTrigger);

type Props = { children: ReactNode; className?: string; delay?: number };

// direct children rise in one after another: right away if the block is on screen at load, otherwise when scrolled to.
// CSS hides them before hydration (html.js, see globals.css), so nothing flashes in and then disappears
export function Reveal({ children, className, delay = 0 }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const items = [...el.children];
        gsap.set(items, { opacity: 0, y: 24 });
        el.dataset.revealed = "true";
        const tween = { opacity: 1, y: 0, duration: 0.6, ease: "expo.out", stagger: 0.08 };

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
    <div ref={ref} data-reveal className={cn(className)}>
      {children}
    </div>
  );
}
