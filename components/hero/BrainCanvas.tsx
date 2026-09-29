"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { createBrain, createRandom } from "./brain";
import { LABEL_LIFE, renderBrain, type Scene } from "./renderBrain";
import { createRunner, type RunEvents } from "./runs";

// "working brain": a grey graph where accent impulses act out agent work: loops, subagents, retrieval, checks
const MOBILE = "(max-width: 767px)";
const subscribe = (change: () => void) => {
  const query = window.matchMedia(MOBILE);
  query.addEventListener("change", change);
  return () => query.removeEventListener("change", change);
};

export function BrainCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);
  // crossing the breakpoint rebuilds the graph (size, node count, speed), not just a reload
  const mobile = useSyncExternalStore(
    subscribe,
    () => window.matchMedia(MOBILE).matches,
    () => false,
  );

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // a step takes about the same time however many edges its route has
    const stepTime = mobile ? 2000 : 1300;
    const random = createRandom(11);
    const css = getComputedStyle(document.documentElement);
    const brain = createBrain(mobile ? 150 : 230);
    const scene: Scene = {
      brain,
      edgeHeat: new Float32Array(brain.edges.length),
      pulses: [],
      labels: [],
      width: 0,
      height: 0,
      view: { cx: 0, cy: 0, radius: 0 },
      yaw: 0.6,
      pitch: -0.18,
      mouse: { x: -1, y: -1 },
      colors: {
        accent: css.getPropertyValue("--color-accent").trim(),
        node: css.getPropertyValue("--color-text-3").trim(),
      },
      font: `11px ${getComputedStyle(canvas).fontFamily}`,
      still,
    };

    const runner = createRunner(brain, random, stepTime);
    const events: RunEvents = {
      edge: (edge) => (scene.edgeHeat[edge] = 1),
      touch: (node, strength) => {
        const hit = brain.nodes[node];
        hit.flash = Math.max(hit.flash, strength);
        // the end of a stage lights its whole cluster a little
        if (strength >= 1) {
          brain.clusters[hit.cluster].members.forEach(
            (m) => (brain.nodes[m].flash = Math.max(brain.nodes[m].flash, 0.35)),
          );
        }
      },
      label: (node, text) => scene.labels.push({ node, text, age: 0 }),
    };
    let pointer = { nx: 0, ny: 0 };
    let frame = 0;
    let last = 0;
    let running = false;

    const advance = (dt: number, now: number) => {
      // slow turn plus a lean towards the mouse, eased so it never snaps
      const yaw = 0.6 + now * 0.00006 + pointer.nx * 0.5;
      const pitch = -0.18 + pointer.ny * 0.35;
      scene.yaw += (yaw - scene.yaw) * Math.min(1, dt / 400);
      scene.pitch += (pitch - scene.pitch) * Math.min(1, dt / 400);

      scene.edgeHeat.forEach((h, i) => (scene.edgeHeat[i] = Math.max(0, h - dt / 900)));
      brain.nodes.forEach((n) => (n.flash = Math.max(0, n.flash - dt / 700)));
      scene.labels = scene.labels
        .map((l) => ({ ...l, age: l.age + dt }))
        .filter((l) => l.age < LABEL_LIFE);

      runner.update(dt, events);
      scene.pulses = runner.pulses();
    };

    const loop = (now: number) => {
      const dt = Math.min(64, now - (last || now));
      last = now;
      advance(dt, now);
      renderBrain(ctx, scene);
      frame = requestAnimationFrame(loop);
    };
    const start = () => {
      if (running || still) return;
      running = true;
      last = 0;
      frame = requestAnimationFrame(loop);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(frame);
    };

    // on mobile the blob fills the empty band between the headline and the subline
    const mobileView = () => {
      const section = canvas.closest("section");
      const base = canvas.getBoundingClientRect().top;
      const top = section?.querySelector("h1")?.getBoundingClientRect().bottom ?? base;
      const floor =
        section?.querySelector("[data-brain-floor]")?.getBoundingClientRect().top ??
        base + scene.height;
      const gap = Math.max(0, floor - top);
      return {
        cx: scene.width * 0.52,
        cy: (top + floor) / 2 - base,
        radius: Math.max(scene.width * 0.46, gap * 0.68),
      };
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      scene.width = canvas.clientWidth;
      scene.height = canvas.clientHeight;
      canvas.width = Math.round(scene.width * dpr);
      canvas.height = Math.round(scene.height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // desktop: big, right of centre and partly under the headline; mobile: larger than the screen, behind the text
      scene.view = mobile
        ? mobileView()
        : {
            cx: scene.width * 0.7,
            cy: scene.height * 0.45,
            radius: Math.min(scene.width * 0.34, scene.height * 0.55),
          };
      if (!running) renderBrain(ctx, scene);
    };

    // reduced motion: one finished run, simulated up front and drawn once, left still
    if (still) {
      const trace: RunEvents = {
        edge: (edge) => (scene.edgeHeat[edge] = 0.35),
        touch: (node, strength) => strength >= 1 && (brain.nodes[node].flash = 1),
        label: events.label,
      };
      for (let i = 0; i < 2000 && (i === 0 || !runner.idle()); i++) runner.update(50, trace, false);
    }

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      const r = canvas.getBoundingClientRect();
      scene.mouse = { x: event.clientX - r.left, y: event.clientY - r.top };
      pointer = {
        nx: event.clientX / window.innerWidth - 0.5,
        ny: event.clientY / window.innerHeight - 0.5,
      };
    };

    // no drawing while the hero is off screen or the tab is hidden
    let visible = true;
    const sync = () => (visible && !document.hidden ? start() : stop());
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      sync();
    });
    const resizer = new ResizeObserver(resize);

    resize();
    resizer.observe(canvas);
    observer.observe(canvas);
    document.addEventListener("visibilitychange", sync);
    window.addEventListener("pointermove", onMove, { passive: true });

    return () => {
      stop();
      resizer.disconnect();
      observer.disconnect();
      document.removeEventListener("visibilitychange", sync);
      window.removeEventListener("pointermove", onMove);
    };
  }, [mobile]);

  return <canvas ref={ref} aria-hidden className="block size-full font-mono" />;
}
