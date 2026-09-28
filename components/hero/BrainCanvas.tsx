"use client";

import { useEffect, useRef } from "react";
import { AGENT_STEPS, createBrain, createRandom, edgeOf, planPath } from "./brain";
import { LABEL_LIFE, renderBrain, type Pulse, type Scene } from "./renderBrain";

const PAUSE_BETWEEN_RUNS = 1200;

// "working brain": a grey graph where accent impulses walk one agent loop (plan → tool → memory → respond)
export function BrainCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const mobile = window.matchMedia("(max-width: 767px)").matches;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // a step takes about the same time however many edges its route has
    const stepTime = mobile ? 2000 : 1300;
    const random = createRandom(11);
    const css = getComputedStyle(document.documentElement);
    const brain = createBrain(mobile ? 150 : 230);
    const scene: Scene = {
      brain,
      edgeHeat: new Float32Array(brain.edges.length),
      pulse: null,
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

    let cluster = brain.nodes[0].cluster;
    let pointer = { nx: 0, ny: 0 };
    let waitUntil = 0;
    let frame = 0;
    let last = 0;
    let running = false;

    // each step heads for one of the far clusters, so the four labels spread across the graph
    const nextPulse = (step: number, from: number): Pulse => {
      const here = brain.clusters[cluster];
      const far = brain.clusters
        .map((c, i) => ({ i, d: Math.hypot(c.x - here.x, c.y - here.y, c.z - here.z) }))
        .filter((c) => c.i !== cluster)
        .sort((a, b) => b.d - a.d)
        .slice(0, 3);
      cluster = far[Math.floor(random() * far.length)].i;
      return { path: planPath(brain, from, cluster, random), segment: 0, progress: 0, step };
    };

    const finishStep = (pulse: Pulse, node: number, now: number) => {
      brain.clusters[brain.nodes[node].cluster].members.forEach(
        (m) => (brain.nodes[m].flash = Math.max(brain.nodes[m].flash, 0.35)),
      );
      brain.nodes[node].flash = 1;
      scene.labels.push({ node, text: AGENT_STEPS[pulse.step], age: 0 });
      const step = pulse.step + 1;
      if (step < AGENT_STEPS.length) return nextPulse(step, node);
      waitUntil = now + PAUSE_BETWEEN_RUNS;
      return null;
    };

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

      if (!scene.pulse) {
        if (now < waitUntil) return;
        scene.pulse = nextPulse(0, brain.clusters[cluster].members[0]);
      }
      // an isolated node has nowhere to go: count the step as done where it stands
      if (scene.pulse.path.length < 2) {
        scene.pulse = finishStep(scene.pulse, scene.pulse.path[0], now);
        return;
      }
      scene.pulse.progress += (dt * (scene.pulse.path.length - 1)) / stepTime;
      while (scene.pulse && scene.pulse.progress >= 1) {
        const pulse = scene.pulse;
        const edge = edgeOf(brain, pulse.path[pulse.segment], pulse.path[pulse.segment + 1]);
        if (edge !== undefined) scene.edgeHeat[edge] = 1;
        pulse.progress -= 1;
        pulse.segment += 1;
        const node = pulse.path[pulse.segment];
        brain.nodes[node].flash = 0.6;
        if (pulse.segment >= pulse.path.length - 1) scene.pulse = finishStep(pulse, node, now);
      }
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

    // reduced motion: one finished run, drawn once and left still
    if (still) {
      let from = brain.clusters[cluster].members[0];
      AGENT_STEPS.forEach((text, step) => {
        const pulse = nextPulse(step, from);
        pulse.path.slice(1).forEach((n, i) => {
          const edge = edgeOf(brain, pulse.path[i], n);
          if (edge !== undefined) scene.edgeHeat[edge] = 0.35;
        });
        from = pulse.path[pulse.path.length - 1];
        brain.nodes[from].flash = 1;
        scene.labels.push({ node: from, text, age: 0 });
      });
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
  }, []);

  return <canvas ref={ref} aria-hidden className="block size-full font-mono" />;
}
