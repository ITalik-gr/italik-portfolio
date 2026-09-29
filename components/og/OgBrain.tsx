import { createBrain, createRandom, planPath } from "@/components/hero/brain";

type Props = { width: number; height: number; accent: string; node: string };

const CAMERA = 3.2;

// a still frame of the hero graph for share images: grey network, one agent run lit in accent
export function OgBrain({ width, height, accent, node }: Props) {
  const brain = createBrain(170, 7);
  const random = createRandom(11);
  const cx = width / 2;
  const cy = height / 2;
  const radius = Math.min(width, height) * 0.48;
  const [yaw, pitch] = [0.6, -0.18];

  const at = brain.nodes.map((n) => {
    const x1 = n.x * Math.cos(yaw) + n.z * Math.sin(yaw);
    const z1 = -n.x * Math.sin(yaw) + n.z * Math.cos(yaw);
    const y2 = n.y * Math.cos(pitch) - z1 * Math.sin(pitch);
    const z2 = n.y * Math.sin(pitch) + z1 * Math.cos(pitch);
    const s = CAMERA / (CAMERA + z2);
    return {
      x: cx + x1 * radius * s,
      y: cy + y2 * radius * s,
      near: Math.min(1, Math.max(0, (1 - z2) / 2)),
    };
  });

  // one run across three far clusters, the same walk the hero animates
  const steps = ["plan", "tool: search", "respond"];
  let from = brain.clusters[0].members[0];
  const lit: [number, number][] = [];
  const stops: { node: number; label: string }[] = [];
  const order = [5, 9, 2];
  steps.forEach((label, i) => {
    const path = planPath(brain, from, order[i], random);
    path.slice(1).forEach((n, j) => lit.push([path[j], n]));
    from = path[path.length - 1];
    stops.push({ node: from, label });
  });

  const lines = brain.edges
    .map(([a, b]) => {
      const near = (at[a].near + at[b].near) / 2;
      const alpha = (0.05 + near * near * 0.35).toFixed(3);
      return `<line x1="${at[a].x.toFixed(1)}" y1="${at[a].y.toFixed(1)}" x2="${at[b].x.toFixed(1)}" y2="${at[b].y.toFixed(1)}" stroke="${node}" stroke-opacity="${alpha}" stroke-width="1.2"/>`;
    })
    .join("");
  const dots = at
    .map(
      (p) =>
        `<circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="${(0.9 + p.near * p.near * 2.8).toFixed(2)}" fill="${node}" fill-opacity="${(0.15 + p.near * p.near * 0.8).toFixed(3)}"/>`,
    )
    .join("");
  const path = lit
    .map(
      ([a, b]) =>
        `<line x1="${at[a].x.toFixed(1)}" y1="${at[a].y.toFixed(1)}" x2="${at[b].x.toFixed(1)}" y2="${at[b].y.toFixed(1)}" stroke="${accent}" stroke-width="2.2"/>`,
    )
    .join("");
  const ends = stops
    .map(
      ({ node: n }) =>
        `<circle cx="${at[n].x.toFixed(1)}" cy="${at[n].y.toFixed(1)}" r="6" fill="${accent}"/>`,
    )
    .join("");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">${lines}${dots}${path}${ends}</svg>`;

  return (
    <div style={{ position: "relative", display: "flex", width, height }}>
      {/* eslint-disable-next-line @next/next/no-img-element -- satori renders plain img, not next/image */}
      <img
        src={`data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`}
        width={width}
        height={height}
        alt=""
      />
      {stops.map(({ node: n, label }) => (
        <div
          key={label}
          style={{
            position: "absolute",
            left: at[n].x + 14,
            top: at[n].y - 34,
            fontFamily: "JetBrains Mono",
            fontSize: 20,
            color: accent,
          }}
        >
          {label}
        </div>
      ))}
    </div>
  );
}
