import type { Brain } from "./brain";

export type Pulse = { path: number[]; segment: number; progress: number; step: number };
export type Label = { node: number; text: string; age: number };
type Projected = { x: number; y: number; near: number };

export type Scene = {
  brain: Brain;
  edgeHeat: Float32Array;
  pulse: Pulse | null;
  labels: Label[];
  width: number;
  height: number;
  // where the blob sits and how big it is, in CSS pixels
  view: { cx: number; cy: number; radius: number };
  // current rotation (radians), eased towards the target in the loop
  yaw: number;
  pitch: number;
  mouse: { x: number; y: number };
  colors: { accent: string; node: string };
  font: string;
  still: boolean;
};

export const LABEL_LIFE = 1600;
const CAMERA = 3.2;

// rotate around y then x, then a soft perspective: near nodes are bigger and brighter
function project(scene: Scene): Projected[] {
  const { cx, cy, radius } = scene.view;
  const [sy, cyaw] = [Math.sin(scene.yaw), Math.cos(scene.yaw)];
  const [sp, cp] = [Math.sin(scene.pitch), Math.cos(scene.pitch)];
  return scene.brain.nodes.map((n) => {
    const x1 = n.x * cyaw + n.z * sy;
    const z1 = -n.x * sy + n.z * cyaw;
    const y2 = n.y * cp - z1 * sp;
    const z2 = n.y * sp + z1 * cp;
    const s = CAMERA / (CAMERA + z2);
    return {
      x: cx + x1 * radius * s,
      y: cy + y2 * radius * s,
      near: Math.min(1, Math.max(0, (1 - z2) / 2)),
    };
  });
}

export function renderBrain(ctx: CanvasRenderingContext2D, scene: Scene) {
  const { brain, edgeHeat, pulse, labels, width, height, mouse, colors } = scene;
  const at = project(scene);

  ctx.clearRect(0, 0, width, height);
  ctx.lineWidth = 1;
  ctx.strokeStyle = colors.node;
  brain.edges.forEach(([a, b]) => {
    const near = (at[a].near + at[b].near) / 2;
    ctx.globalAlpha = 0.03 + near * near * 0.3;
    ctx.beginPath();
    ctx.moveTo(at[a].x, at[a].y);
    ctx.lineTo(at[b].x, at[b].y);
    ctx.stroke();
  });

  ctx.strokeStyle = colors.accent;
  ctx.lineWidth = 1.3;
  brain.edges.forEach(([a, b], i) => {
    if (edgeHeat[i] <= 0) return;
    ctx.globalAlpha = edgeHeat[i] * (0.35 + (0.55 * (at[a].near + at[b].near)) / 2);
    ctx.beginPath();
    ctx.moveTo(at[a].x, at[a].y);
    ctx.lineTo(at[b].x, at[b].y);
    ctx.stroke();
  });

  brain.nodes.forEach((n, i) => {
    const p = at[i];
    const hover = mouse.x < 0 ? 0 : Math.max(0, 1 - Math.hypot(p.x - mouse.x, p.y - mouse.y) / 140);
    ctx.globalAlpha = 0.12 + p.near * p.near * 0.8 + hover * 0.2;
    ctx.fillStyle = colors.node;
    ctx.beginPath();
    ctx.arc(p.x, p.y, 0.6 + p.near * p.near * 2.4 + hover, 0, Math.PI * 2);
    ctx.fill();
    if (n.flash > 0) {
      ctx.globalAlpha = n.flash * (0.4 + 0.6 * p.near);
      ctx.fillStyle = colors.accent;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 1.5 + p.near * 1.5 + n.flash * 2.5, 0, Math.PI * 2);
      ctx.fill();
    }
  });

  if (pulse) {
    const a = at[pulse.path[pulse.segment]];
    const b = at[pulse.path[pulse.segment + 1]];
    const x = a.x + (b.x - a.x) * pulse.progress;
    const y = a.y + (b.y - a.y) * pulse.progress;
    ctx.globalAlpha = 1;
    ctx.strokeStyle = colors.accent;
    ctx.fillStyle = colors.accent;
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(x, y, 2.4 + (a.near + b.near) * 0.8, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.font = scene.font;
  ctx.fillStyle = colors.accent;
  labels.forEach((label) => {
    const p = at[label.node];
    const t = label.age / LABEL_LIFE;
    ctx.globalAlpha = scene.still ? 1 : Math.min(1, t * 6, (1 - t) * 3);
    // keep the label inside the canvas: flip it left of the node near the right edge
    const w = ctx.measureText(label.text).width;
    const x = p.x + 10 + w > width - 8 ? p.x - 10 - w : p.x + 10;
    ctx.fillText(label.text, x, p.y - 10);
  });
  ctx.globalAlpha = 1;
}
