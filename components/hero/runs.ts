import { type Brain, edgeOf, pathTo, planPath, spread } from "./brain";

// one stage of a run; every stage starts from where the previous one ended
type Stage =
  | { kind: "hop"; label: string }
  // one impulse per label, each to a different far cluster, all at once
  | { kind: "fan"; labels: string[] }
  // every open end runs to the same node
  | { kind: "join"; label: string }
  // a quick burst to every node two hops away
  | { kind: "wave"; label: string };

// four kinds of work so the canvas never loops one pattern: a plain agent loop, subagents that
// fan out and merge, retrieval spreading through the graph, and a grounding check that sends a draft back
const RUNS: Stage[][] = [
  [
    { kind: "hop", label: "plan" },
    { kind: "hop", label: "tool: search" },
    { kind: "hop", label: "memory.write" },
    { kind: "hop", label: "respond" },
  ],
  [
    { kind: "hop", label: "orchestrate" },
    { kind: "fan", labels: ["subagent: docs", "subagent: code", "subagent: tests"] },
    { kind: "join", label: "merge" },
    { kind: "hop", label: "respond" },
  ],
  [
    { kind: "hop", label: "embed query" },
    { kind: "wave", label: "retrieve" },
    { kind: "join", label: "rerank" },
    { kind: "hop", label: "answer" },
  ],
  [
    { kind: "hop", label: "draft" },
    { kind: "hop", label: "check: numbers" },
    { kind: "hop", label: "✕ not in data" },
    { kind: "hop", label: "redraft" },
    { kind: "hop", label: "✓ grounded" },
  ],
];

export type Pulse = { path: number[]; segment: number; progress: number; speed: number };

type Run = {
  stages: Stage[];
  stage: number;
  pulses: Pulse[];
  // where the finished stage left off; the next stage starts here
  ends: number[];
  // labels shown when the current stage's impulses arrive: one per pulse (fan) or one for the stage
  arrivals: string[];
};

export type RunEvents = {
  edge: (edge: number) => void;
  // a node the impulse reached: 0.6 while passing through, 1 at the end of a stage
  touch: (node: number, strength: number) => void;
  label: (node: number, text: string) => void;
};

export function createRunner(brain: Brain, random: () => number, stepTime: number) {
  const runs: Run[] = [];
  let next = Math.floor(random() * RUNS.length);
  let lastCluster = brain.nodes[0].cluster;

  const pick = <T>(items: T[]) => items[Math.floor(random() * items.length)];

  // clusters far from `from`, nearest-first reversed, so every step visibly crosses the blob
  const farClusters = (from: number, count: number) => {
    const here = brain.clusters[from];
    return brain.clusters
      .map((c, i) => ({ i, d: Math.hypot(c.x - here.x, c.y - here.y, c.z - here.z) }))
      .filter((c) => c.i !== from && brain.clusters[c.i].members.length > 0)
      .sort((a, b) => b.d - a.d)
      .slice(0, count)
      .map((c) => c.i);
  };

  const pulse = (path: number[], speed = 1): Pulse => ({ path, segment: 0, progress: 0, speed });
  // a wave labels its origin as it leaves, not on arrival
  let labelOnLaunch: { node: number; text: string } | null = null;

  const launch = (run: Run) => {
    const stage = run.stages[run.stage];
    const from = run.ends[0];
    const fromCluster = brain.nodes[from].cluster;

    if (stage.kind === "hop") {
      const target = pick(farClusters(fromCluster, 3));
      run.pulses = [pulse(planPath(brain, from, target, random))];
      run.arrivals = [stage.label];
    } else if (stage.kind === "fan") {
      const targets = farClusters(fromCluster, 6)
        .sort(() => random() - 0.5)
        .slice(0, stage.labels.length);
      run.pulses = targets.map((t) => pulse(planPath(brain, from, t, random)));
      run.arrivals = stage.labels.slice(0, run.pulses.length);
    } else if (stage.kind === "join") {
      const busy = new Set(run.ends.map((n) => brain.nodes[n].cluster));
      const target = pick(farClusters(fromCluster, 5).filter((c) => !busy.has(c))) ?? fromCluster;
      const goal = pick(brain.clusters[target].members);
      run.pulses = run.ends.map((end) => pulse(pathTo(brain, end, goal)));
      run.arrivals = [stage.label];
    } else {
      const routes = spread(brain, from, 2)
        .sort(() => random() - 0.5)
        .slice(0, 9);
      // a burst is quicker than a deliberate step
      run.pulses = routes.map((route) => pulse(route, 2.2));
      run.arrivals = [];
      labelOnLaunch = { node: from, text: stage.label };
    }
  };

  const start = (anchor?: number) => {
    const stages = RUNS[next];
    next = (next + 1) % RUNS.length;
    const cluster = pick(farClusters(lastCluster, 4));
    lastCluster = cluster;
    const run: Run = {
      stages,
      stage: 0,
      pulses: [],
      ends: [anchor ?? pick(brain.clusters[cluster].members)],
      arrivals: [],
    };
    launch(run);
    runs.push(run);
    return run;
  };

  // the stage is over once every impulse has arrived; returns true when the whole run is done
  const finishStage = (run: Run, events: RunEvents) => {
    const hits = run.pulses.map((p) => p.path[p.path.length - 1]);
    // nothing launched (an isolated node): the run carries on from where it stood
    const ends = hits.length > 0 ? hits : run.ends.slice(0, 1);
    const stage = run.stages[run.stage];
    ends.forEach((node, i) => {
      events.touch(node, 1);
      const text = stage.kind === "fan" ? run.arrivals[i] : i === 0 ? run.arrivals[0] : undefined;
      if (text) events.label(node, text);
    });
    // a burst hands only a few of its hits on, otherwise the next join would be a tangle
    run.ends =
      stage.kind === "wave" ? ends.sort(() => random() - 0.5).slice(0, 3) : [...new Set(ends)];
    run.stage += 1;
    if (run.stage >= run.stages.length) return true;
    launch(run);
    return false;
  };

  return {
    // one frame of work; `overlap` starts the next run as the current one begins its last stage
    update(dt: number, events: RunEvents, overlap = true) {
      if (runs.length === 0) start();

      for (let r = runs.length - 1; r >= 0; r--) {
        const run = runs[r];
        if (labelOnLaunch) {
          events.label(labelOnLaunch.node, labelOnLaunch.text);
          events.touch(labelOnLaunch.node, 1);
          labelOnLaunch = null;
        }
        for (const p of run.pulses) {
          if (p.path.length < 2) {
            p.segment = p.path.length - 1;
            continue;
          }
          if (p.segment >= p.path.length - 1) continue;
          p.progress += (dt * (p.path.length - 1) * p.speed) / stepTime;
          while (p.progress >= 1 && p.segment < p.path.length - 1) {
            const edge = edgeOf(brain, p.path[p.segment], p.path[p.segment + 1]);
            if (edge !== undefined) events.edge(edge);
            p.progress -= 1;
            p.segment += 1;
            if (p.segment < p.path.length - 1) events.touch(p.path[p.segment], 0.6);
          }
        }
        if (run.pulses.every((p) => p.segment >= p.path.length - 1)) {
          const wasLast = run.stage === run.stages.length - 1;
          if (finishStage(run, events)) runs.splice(r, 1);
          else if (overlap && run.stage === run.stages.length - 1 && runs.length < 2 && !wasLast) {
            start();
          }
        }
      }
    },
    // impulses still travelling, for drawing
    pulses() {
      return runs.flatMap((run) => run.pulses.filter((p) => p.segment < p.path.length - 1));
    },
    idle: () => runs.length === 0,
  };
}
