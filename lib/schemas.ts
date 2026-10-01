import { z } from "zod";
import { architectureSchema } from "./schemas-architecture";

const optionalUrl = z.url().optional();

const statusSchema = z.enum([
  "live",
  "building",
  "v2-in-progress",
  "next-up",
  "nda",
  "offline",
  "archived",
]);

const tagSchema = z.enum([
  "agent",
  "mcp",
  "tool",
  "product",
  "llm",
  "rag",
  "automation",
  "bot",
  "open-source",
  "marketing-site",
  "web-app",
]);

// home sections a project can appear in; every project also belongs on the future /work page
export const HOME_SECTIONS = ["featured", "lab", "clients", "now"] as const;

export const projectSchema = z
  .object({
    title: z.string().min(1),
    slug: z.string().regex(/^[a-z0-9-]+$/),
    kind: z.enum(["personal", "client"]),
    show: z.array(z.enum(HOME_SECTIONS)).default([]),
    order: z.number().int(),
    status: statusSchema,
    statusNote: z.string().optional(),
    tags: z.array(tagSchema).default([]),
    typeLabel: z.string(),
    summary: z.string().min(1),
    description: z.string().optional(),
    keyIdea: z.string().optional(),
    role: z.string().optional(),
    team: z.string().optional(),
    via: z.string().optional(),
    timeline: z.string().optional(),
    stack: z.array(z.string()).default([]),
    shipsAs: z.array(z.string()).optional(),
    links: z.object({ live: optionalUrl, code: optionalUrl, demo: optionalUrl }).default({}),
    hideLinks: z.boolean().default(false),
    // on-site target when a project has no page of its own, e.g. "/#ask"
    internalLink: z.string().startsWith("/").optional(),
    frameUrl: z.string().optional(),
    // two screenshots per project cover every layout: desktop 16:10 and a phone screen 9:19.5
    cover: z.string().optional(),
    coverMobile: z.string().optional(),
    // true = the project has its own page at /work/<slug>
    caseStudy: z.boolean().default(false),
    draft: z.boolean().default(false),
    nowBuilding: z
      .object({
        title: z.string().optional(),
        summary: z.string().optional(),
        phase: z
          .object({ current: z.number().int().min(0), total: z.number().int().min(1) })
          .optional(),
        lastUpdate: z.string(),
        updateNote: z.string(),
      })
      .optional(),
    // image is optional: a screenshot path in /public, shown 4:3 above the text
    features: z
      .array(z.object({ title: z.string(), text: z.string(), image: z.string().optional() }))
      .optional(),
    architecture: architectureSchema.optional(),
    decisions: z
      .array(z.object({ chose: z.string(), over: z.string(), because: z.string() }))
      .optional(),
    aiSpecifics: z.array(z.object({ key: z.string(), value: z.string() })).optional(),
    // client cases: extra screens under "What I did"; src is optional, a labelled frame stands in until it exists
    gallery: z
      .array(
        z.object({
          kind: z.enum(["desktop", "mobile"]),
          label: z.string(),
          url: z.string().optional(),
          src: z.string().optional(),
        }),
      )
      .optional(),
    highlights: z.array(z.object({ title: z.string(), text: z.string() })).optional(),
    outcome: z.array(z.object({ value: z.string(), label: z.string() })).optional(),
  })
  .refine((p) => !(p.status === "nda" && !p.hideLinks), {
    message: "NDA projects must set hideLinks: true",
  })
  .refine((p) => !p.show.includes("now") || p.nowBuilding, {
    message: "show: [now] needs a nowBuilding block",
  })
  .refine((p) => !(p.caseStudy && p.hideLinks), {
    message: "a hidden (NDA) project cannot have a case study page",
  });

export const experienceSchema = z.object({
  company: z.string().min(1),
  slug: z.string().regex(/^[a-z0-9-]+$/),
  order: z.number().int(),
  role: z.string(),
  client: z.string().optional(),
  start: z.string().regex(/^\d{2}\/\d{4}$/),
  end: z.union([z.string().regex(/^\d{2}\/\d{4}$/), z.literal("present")]),
  type: z.string(),
  location: z.string(),
  // short lines for the timeline; **bold** marks the key result
  highlights: z.array(z.string()).min(1).max(5),
  stack: z.array(z.string()),
});

// draft: true never reaches a listing, RSS, the sitemap or a production build; canonical: when the original lives elsewhere
export const postSchema = z.object({
  title: z.string().min(1),
  slug: z.string().regex(/^[a-z0-9-]+$/),
  // YAML reads an unquoted 2026-10-01 as a Date; both forms are accepted
  date: z.preprocess(
    (value) => (value instanceof Date ? value.toISOString().slice(0, 10) : value),
    z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  ),
  summary: z.string().min(1),
  tags: z.array(z.string()).default([]),
  draft: z.boolean().default(false),
  cover: z.string().optional(),
  canonical: optionalUrl,
});

export type Project = z.infer<typeof projectSchema> & { body: string };
export type Post = z.infer<typeof postSchema> & { body: string };
export type Experience = z.infer<typeof experienceSchema> & { body: string };
export type ProjectStatus = z.infer<typeof statusSchema>;
