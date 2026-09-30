"use client";

import { useEffect, useRef, useState } from "react";
import { HERO_TRAIL } from "@/lib/site";

const STEP_PX = 110;
const IDLE_MS = 1000;
const W = 200;
const H = 125;
// a quiet backdrop: never fully opaque, so the title always wins
const PEAK = 0.5;
// each shot keeps gliding this far along the cursor's path while it lives
const GLIDE_PX = 36;
// in 0.4s, hold 0.5s, out 1.1s
const DURATION = 2000;
const IN = 0.4 / 2;
const HOLD = 0.9 / 2;
const EASE_OUT = "cubic-bezier(0.22, 1, 0.36, 1)";
const EASE_IN_OUT = "cubic-bezier(0.65, 0, 0.35, 1)";
const GLIDE = "cubic-bezier(0.16, 1, 0.3, 1)";

const DESKTOP =
  "(hover: hover) and (pointer: fine) and (min-width: 768px) and (prefers-reduced-motion: no-preference)";

// screenshots follow the cursor under the title; nothing loads until the page has, and nothing runs while idle.
// one pre-rendered slot per project, so a spawn only starts an animation: no DOM, no src or text changes
export function TrailLayer() {
  const [ready, setReady] = useState(false);
  const layer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.matchMedia(DESKTOP).matches) return;
    let cancelled = false;
    let idle = 0;

    const load = () => {
      const run = () =>
        Promise.all(
          HERO_TRAIL.map(({ src }) => {
            const img = new Image();
            img.src = src;
            return img.decode();
          }),
        ).then(
          () => !cancelled && setReady(true),
          () => {},
        );
      idle = window.requestIdleCallback
        ? window.requestIdleCallback(run, { timeout: 2000 })
        : window.setTimeout(run, 300);
    };
    if (document.readyState === "complete") load();
    else window.addEventListener("load", load, { once: true });

    return () => {
      cancelled = true;
      window.removeEventListener("load", load);
      if (window.cancelIdleCallback) window.cancelIdleCallback(idle);
      window.clearTimeout(idle);
    };
  }, []);

  useEffect(() => {
    const root = layer.current;
    const hero = root?.parentElement;
    if (!ready || !root || !hero) return;

    const slots = [...root.children] as HTMLElement[];
    let shot = 0;
    let origin = { x: 0, y: 0 };
    let pointer: { x: number; y: number } | null = null;
    let last: { x: number; y: number } | null = null;
    let lastMove = 0;
    let frame = 0;
    let visible = true;
    let armed = false;
    let disposed = false;

    // the files are cached by now; decoding the pool's own images keeps the first shot from flashing empty
    Promise.all(slots.map((el) => el.querySelector("img")!.decode())).then(
      () => (armed = !disposed),
      () => {},
    );

    // page coordinates of the layer; they only change on resize, so pointermove never reads layout
    const measure = () => {
      const rect = root.getBoundingClientRect();
      origin = { x: rect.left + window.scrollX, y: rect.top + window.scrollY };
    };

    // dx, dy: unit direction of the cursor, so the shot drifts on the way the cursor went
    const spawn = (x: number, y: number, dx: number, dy: number) => {
      // reusing the oldest slot caps the trail at five, and its own project keeps src and caption untouched
      const el = slots[shot++ % slots.length];
      el.getAnimations().forEach((a) => a.cancel());
      const from = `${x - W / 2}px ${y - H / 2}px`;
      const to = `${x - W / 2 + dx * GLIDE_PX}px ${y - H / 2 + dy * GLIDE_PX}px`;
      // the glide is one decelerating curve over the whole life; fade and scale run on top of it
      el.animate([{ translate: from }, { translate: to }], { duration: DURATION, easing: GLIDE });
      el.animate(
        [
          { opacity: 0, scale: 0.94, easing: EASE_OUT },
          { opacity: PEAK, scale: 1, offset: IN },
          { opacity: PEAK, scale: 1, offset: HOLD, easing: EASE_IN_OUT },
          { opacity: 0, scale: 0.94 },
        ],
        { duration: DURATION },
      );
    };

    const tick = (now: number) => {
      frame = 0;
      if (!visible || !pointer) return;
      if (!last) last = pointer;
      const distance = Math.hypot(pointer.x - last.x, pointer.y - last.y);
      if (distance >= STEP_PX) {
        const dx = (pointer.x - last.x) / distance;
        const dy = (pointer.y - last.y) / distance;
        spawn(pointer.x - origin.x, pointer.y - origin.y, dx, dy);
        last = pointer;
      }
      if (now - lastMove < IDLE_MS) frame = requestAnimationFrame(tick);
    };

    const onMove = (event: PointerEvent) => {
      if (!armed || event.pointerType !== "mouse") return;
      pointer = { x: event.pageX, y: event.pageY };
      lastMove = performance.now();
      if (!frame && visible) frame = requestAnimationFrame(tick);
    };
    // the next entry starts a fresh trail instead of jumping from where the cursor left
    const onLeave = () => {
      pointer = null;
      last = null;
    };

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (!visible) {
        cancelAnimationFrame(frame);
        frame = 0;
      }
    });
    const resize = new ResizeObserver(measure);

    measure();
    observer.observe(hero);
    resize.observe(hero);
    hero.addEventListener("pointermove", onMove, { passive: true });
    hero.addEventListener("pointerleave", onLeave);

    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      observer.disconnect();
      resize.disconnect();
      hero.removeEventListener("pointermove", onMove);
      hero.removeEventListener("pointerleave", onLeave);
      slots.forEach((el) => el.getAnimations().forEach((a) => a.cancel()));
    };
  }, [ready]);

  if (!ready) return null;

  return (
    <div ref={layer} aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden contain-strict">
      {HERO_TRAIL.map((project) => (
        <figure
          key={project.src}
          className="absolute top-0 left-0 w-[200px] opacity-0 contain-strict will-change-[translate,scale,opacity] h-[125px]"
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- already decoded; next/image would request a resized copy */}
          <img
            src={project.src}
            alt=""
            width={W}
            height={H}
            className="block h-[125px] w-[200px] border border-line"
          />
          <figcaption className="absolute bottom-[6px] left-[6px] bg-bg px-[6px] py-[2px] font-mono text-[11px] leading-[14px] text-text-2">
            {project.title}
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
