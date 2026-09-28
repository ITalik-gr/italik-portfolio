"use client";

import { useEffect, useRef, type RefObject } from "react";

type Props = {
  id: string;
  lines: readonly string[];
  className?: string;
};

const STAGGER_MS = 28;
const REST_WEIGHT = 680;
const MIN_WEIGHT = 520;
const MAX_WEIGHT = 860;
const RADIUS = 280;

// the reveal is pure CSS so the title shows from server HTML; JS only adds the cursor weight
export function SplitHeading({ id, lines, className }: Props) {
  const ref = useRef<HTMLHeadingElement>(null);
  useCursorWeight(ref);

  let index = 0;

  return (
    <h1 ref={ref} id={id} aria-label={lines.join(" ")} className={className}>
      {lines.map((line) => (
        <span key={line} aria-hidden className="block">
          {line.split(" ").map((word, wordIndex) => (
            <span key={wordIndex}>
              {wordIndex > 0 && " "}
              <span className="inline-block whitespace-nowrap">
                {[...word].map((char, charIndex) => (
                  <span
                    key={charIndex}
                    data-letter
                    style={{ animationDelay: `${index++ * STAGGER_MS}ms` }}
                    className="inline-block motion-safe:animate-letter-in"
                  >
                    {char}
                  </span>
                ))}
              </span>
            </span>
          ))}
        </span>
      ))}
    </h1>
  );
}

// letters near a mouse cursor get heavier; only on desktop pointers, never with reduced motion
function useCursorWeight(ref: RefObject<HTMLHeadingElement | null>) {
  useEffect(() => {
    const heading = ref.current;
    const media = window.matchMedia(
      "(hover: hover) and (pointer: fine) and (min-width: 768px) and (prefers-reduced-motion: no-preference)",
    );
    if (!heading || !media.matches) return;

    const letters = [...heading.querySelectorAll<HTMLElement>("[data-letter]")];
    const weights = letters.map(() => REST_WEIGHT);
    let pointer: { x: number; y: number } | null = null;
    let frame = 0;
    let visible = true;

    const step = () => {
      let moving = false;
      letters.forEach((letter, i) => {
        let target = REST_WEIGHT;
        if (pointer) {
          const r = letter.getBoundingClientRect();
          const distance = Math.hypot(
            r.left + r.width / 2 - pointer.x,
            r.top + r.height / 2 - pointer.y,
          );
          target = MIN_WEIGHT + (MAX_WEIGHT - MIN_WEIGHT) * Math.max(0, 1 - distance / RADIUS);
        }
        weights[i] += (target - weights[i]) * 0.15;
        if (Math.abs(target - weights[i]) > 0.5) moving = true;
        letter.style.fontWeight = String(Math.round(weights[i]));
      });
      frame = moving ? requestAnimationFrame(step) : 0;
    };
    const start = () => {
      if (!frame && visible) frame = requestAnimationFrame(step);
    };

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      pointer = { x: event.clientX, y: event.clientY };
      start();
    };
    const onLeave = () => {
      pointer = null;
      start();
    };

    // no work while the hero is off screen
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (!visible) {
        cancelAnimationFrame(frame);
        frame = 0;
      }
    });
    observer.observe(heading);
    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      letters.forEach((letter) => letter.style.removeProperty("font-weight"));
    };
  }, [ref]);
}
