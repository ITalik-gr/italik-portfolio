import { z } from "zod";

export const ARCH_KINDS = ["input", "code", "llm", "check", "output", "external"] as const;
const kind = z.enum(ARCH_KINDS);
const point = z.tuple([z.number(), z.number()]);

const flowSchema = z.object({
  variant: z.literal("flow"),
  summary: z.string(),
  highlight: z.string().optional(),
  steps: z
    .array(
      z.object({
        kind: kind.exclude(["external"]),
        title: z.string(),
        note: z.string().optional(),
      }),
    )
    .min(3)
    .max(7),
  // work that runs outside the request, e.g. a nightly job
  background: z
    .object({ kind: z.enum(["code", "llm"]), label: z.string(), text: z.string() })
    .optional(),
  notes: z.array(z.string()).max(2).optional(),
});

// geometry is in logical px on a 1360×640 canvas, laid out by hand
const mapSchema = z.object({
  variant: z.literal("map"),
  title: z.string(),
  summary: z.string(),
  zones: z.array(
    z.object({
      id: z.string(),
      label: z.string(),
      kind: z.literal("llm").optional(),
      // a zone drawn inside another one belongs to it on mobile
      parent: z.string().optional(),
      x: z.number(),
      y: z.number(),
      w: z.number(),
      h: z.number(),
    }),
  ),
  nodes: z.array(
    z.object({
      id: z.string(),
      zone: z.string(),
      kind,
      title: z.string(),
      sub: z.string().optional(),
      x: z.number(),
      y: z.number(),
      w: z.number(),
    }),
  ),
  edges: z.array(
    z.object({
      from: z.string(),
      to: z.string(),
      label: z.string().optional(),
      // the whole polyline, start and end on the node borders; segments are horizontal or vertical
      points: z.array(point).min(2),
      labelAt: point.optional(),
      labelAnchor: z.enum(["start", "middle", "end"]).default("start"),
      dashed: z.boolean().default(false),
      emphasis: z.boolean().default(false),
    }),
  ),
  trace: z.object({
    question: z.string(),
    steps: z.array(z.object({ kind: z.enum(["code", "llm", "check"]), text: z.string() })).min(3),
  }),
  guarantees: z
    .array(z.object({ title: z.string(), accent: z.string().optional(), caption: z.string() }))
    .min(2)
    .max(4),
});

// flow is the default, so most cases don't need to name a variant
export const architectureSchema = z.preprocess(
  (value) =>
    value && typeof value === "object" && !("variant" in value)
      ? { ...value, variant: "flow" }
      : value,
  z.discriminatedUnion("variant", [flowSchema, mapSchema]),
);

export type Architecture = z.infer<typeof architectureSchema>;
export type FlowArchitecture = z.infer<typeof flowSchema>;
export type MapArchitecture = z.infer<typeof mapSchema>;
export type ArchKind = z.infer<typeof kind>;
