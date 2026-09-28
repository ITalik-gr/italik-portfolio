// pure graph + agent-run logic for the hero canvas; nodes live in a unit ellipsoid in 3D

export type BrainNode = { x: number; y: number; z: number; cluster: number; flash: number };

export type Brain = {
  nodes: BrainNode[];
  edges: [number, number][];
  neighbours: number[][];
  clusters: { x: number; y: number; z: number; members: number[] }[];
  edgeIndex: Map<string, number>;
};

// one agent run lights one step per cluster, in this order
export const AGENT_STEPS = ["plan", "tool: search", "memory.write", "respond"] as const;

// a slightly wide, slightly flat blob reads as a brain rather than a ball
const RADII = { x: 1, y: 0.78, z: 0.82 };
const CLUSTERS = 10;

// small seeded PRNG so the graph looks the same on every visit
export function createRandom(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const gaussian = (random: () => number) =>
  Math.sqrt(-2 * Math.log(random() || 1e-9)) * Math.cos(2 * Math.PI * random());

const key = (a: number, b: number) => (a < b ? `${a}-${b}` : `${b}-${a}`);

// pull a point back inside the ellipsoid if it fell outside
function inside(p: { x: number; y: number; z: number }) {
  const r = Math.hypot(p.x / RADII.x, p.y / RADII.y, p.z / RADII.z);
  if (r <= 0.98) return p;
  const k = 0.98 / r;
  return { x: p.x * k, y: p.y * k, z: p.z * k };
}

export function createBrain(count: number, seed = 7): Brain {
  const random = createRandom(seed);

  // cluster centres spread evenly over an inner shell (fibonacci sphere)
  const clusters = Array.from({ length: CLUSTERS }, (_, i) => {
    const y = 1 - (2 * (i + 0.5)) / CLUSTERS;
    const r = Math.sqrt(1 - y * y);
    const a = i * Math.PI * (3 - Math.sqrt(5));
    const shell = 0.58;
    return {
      x: Math.cos(a) * r * shell * RADII.x,
      y: y * shell * RADII.y,
      z: Math.sin(a) * r * shell * RADII.z,
      members: [] as number[],
    };
  });

  // most nodes gather around clusters, the rest fill the volume so there are no empty holes
  const points = Array.from({ length: count }, (_, i) => {
    if (i % 4 === 3) {
      return inside({
        x: (random() * 2 - 1) * RADII.x,
        y: (random() * 2 - 1) * RADII.y,
        z: (random() * 2 - 1) * RADII.z,
      });
    }
    const c = clusters[i % CLUSTERS];
    return inside({
      x: c.x + gaussian(random) * 0.2,
      y: c.y + gaussian(random) * 0.2,
      z: c.z + gaussian(random) * 0.2,
    });
  });

  const nearestCluster = (p: { x: number; y: number; z: number }) =>
    clusters.reduce(
      (best, c, i) =>
        Math.hypot(c.x - p.x, c.y - p.y, c.z - p.z) <
        Math.hypot(clusters[best].x - p.x, clusters[best].y - p.y, clusters[best].z - p.z)
          ? i
          : best,
      0,
    );

  const nodes: BrainNode[] = points.map((p, i) => {
    const cluster = nearestCluster(p);
    clusters[cluster].members.push(i);
    return { ...p, cluster, flash: 0 };
  });

  const edgeIndex = new Map<string, number>();
  const edges: [number, number][] = [];
  const link = (a: number, b: number) => {
    const k = key(a, b);
    if (a === b || edgeIndex.has(k)) return;
    edgeIndex.set(k, edges.length);
    edges.push([a, b]);
  };
  const distance = (a: number, b: number) =>
    Math.hypot(nodes[a].x - nodes[b].x, nodes[a].y - nodes[b].y, nodes[a].z - nodes[b].z);

  // every node links to its nearest two (so none is left hanging), plus up to two more if they are close
  nodes.forEach((_, a) => {
    const nearest = nodes
      .map((__, b) => b)
      .filter((b) => b !== a)
      .sort((b, c) => distance(a, b) - distance(a, c));
    nearest.slice(0, 2).forEach((b) => link(a, b));
    nearest.slice(2, 4).forEach((b) => distance(a, b) < 0.26 && link(a, b));
  });

  // bridges between neighbouring clusters so an impulse can always travel on
  clusters.forEach((from, i) => {
    clusters
      .map((c, j) => ({ j, d: Math.hypot(c.x - from.x, c.y - from.y, c.z - from.z) }))
      .filter((c) => c.j !== i && clusters[c.j].members.length > 0)
      .sort((a, b) => a.d - b.d)
      .slice(0, 3)
      .forEach(({ j }) => {
        let best: [number, number] = [from.members[0], clusters[j].members[0]];
        for (const a of from.members)
          for (const b of clusters[j].members)
            if (distance(a, b) < distance(...best)) best = [a, b];
        if (best[0] !== undefined && best[1] !== undefined) link(...best);
      });
  });

  const neighbours = nodes.map(() => [] as number[]);
  edges.forEach(([a, b]) => {
    neighbours[a].push(b);
    neighbours[b].push(a);
  });

  return { nodes, edges, neighbours, clusters, edgeIndex };
}

export function edgeOf(brain: Brain, a: number, b: number) {
  return brain.edgeIndex.get(key(a, b));
}

// shortest route (BFS) to a random reachable node of the target cluster, so every step really crosses the graph
export function planPath(brain: Brain, start: number, target: number, random: () => number) {
  const previous = new Map<number, number>([[start, -1]]);
  const queue = [start];
  while (queue.length > 0) {
    const here = queue.shift()!;
    for (const next of brain.neighbours[here]) {
      if (previous.has(next)) continue;
      previous.set(next, here);
      queue.push(next);
    }
  }

  const inTarget = brain.clusters[target].members.filter((m) => m !== start && previous.has(m));
  const reachable = [...previous.keys()].filter((m) => m !== start);
  const pool = inTarget.length > 0 ? inTarget : reachable;
  if (pool.length === 0) return [start];

  const path = [pool[Math.floor(random() * pool.length)]];
  while (path[0] !== start) path.unshift(previous.get(path[0])!);
  return path;
}
