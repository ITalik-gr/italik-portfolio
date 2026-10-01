import fs from "node:fs";
import path from "node:path";
import { getExperience, getPosts, getProjects } from "@/lib/content";
import { toPlainText } from "@/lib/markdown";
import { getProjectLinks } from "@/lib/project-links";
import type { Project } from "@/lib/schemas";
import type { Architecture } from "@/lib/schemas-architecture";
import {
  HOW_I_WORK,
  SERVICES,
  SERVICE_FAQ,
  SERVICE_FORMATS,
  SERVICE_STEPS,
  SERVICE_TERMS,
} from "@/lib/services";
import { ABOUT, HERO, HOMES, SITE } from "@/lib/site";
import { getSkillGroups } from "@/lib/site-lists";
import type { ChatSource } from "./types";

type Doc = { id: string; text: string; source: ChatSource };

// Experience, Skills and Now building live only on the employer pages; /ai has every section
const SECTION_ANCHOR = { featured: "/#work", lab: "/#lab", now: "/ai#now", clients: "/#clients" };

// unfinished or unconfirmed facts never reach the model
const isDraft = (line: string) => /\[(TODO|verify)|^\s*TODO:?/i.test(line);
const clean = (text: string) =>
  text
    .split("\n")
    .filter((line) => !isDraft(line))
    .join("\n")
    .trim();

function architectureLines(arch: Architecture) {
  const head =
    arch.variant === "map"
      ? `${arch.title} ${arch.summary}`
      : [arch.summary, arch.highlight].filter(Boolean).join(" ");
  if (arch.variant === "flow") {
    return [
      head,
      ...arch.steps.map(
        (step) => `${step.kind}: ${step.title}${step.note ? ` (${step.note})` : ""}`,
      ),
      ...(arch.background ? [`background ${arch.background.label}: ${arch.background.text}`] : []),
      ...(arch.notes ?? []),
    ];
  }
  const title = (id: string) => arch.nodes.find((node) => node.id === id)?.title ?? id;
  return [
    head,
    ...arch.nodes.map((node) => `${node.kind}: ${node.title}${node.sub ? ` (${node.sub})` : ""}`),
    ...arch.edges.map(
      (edge) => `${title(edge.from)} → ${title(edge.to)}${edge.label ? `: ${edge.label}` : ""}`,
    ),
    `Example "${arch.trace.question}": ${arch.trace.steps.map((step) => step.text).join("; ")}`,
    ...arch.guarantees.map((item) => `${item.title} ${item.caption}`),
  ];
}

function projectDoc(project: Project): Doc {
  const { case: casePage, live, code, primary } = getProjectLinks(project);
  const facts: Record<string, unknown> = {
    title: project.title,
    type: project.typeLabel,
    status: [project.status, project.statusNote].filter(Boolean).join(" · "),
    via: project.via,
    summary: project.summary,
    description: project.description,
    keyIdea: project.keyIdea,
    role: project.role,
    team: project.team,
    timeline: project.timeline,
    stack: project.stack,
    shipsAs: project.shipsAs,
    features: project.features?.map(({ title, text }) => `${title}: ${text}`),
    architecture: project.architecture && architectureLines(project.architecture),
    decisions: project.decisions?.map(
      (d) => `Chose ${d.chose} over ${d.over} because ${d.because}`,
    ),
    aiSpecifics: project.aiSpecifics?.map((a) => `${a.key}: ${a.value}`),
    highlights: project.highlights?.map(({ title, text }) => `${title}: ${text}`),
    outcome: project.outcome?.map((o) => `${o.value} ${o.label}`),
    caseStudyPage: casePage,
    liveUrl: live,
    codeUrl: code,
    nowBuilding: project.nowBuilding,
    note:
      project.status === "nda"
        ? "Under NDA: only this public description may be shared."
        : undefined,
  };
  // list items are checked one by one, before they are joined into a single line
  const lines = Object.entries(facts)
    .map(
      ([key, value]) =>
        [
          key,
          Array.isArray(value) ? value.filter((item) => !/\bTODO\b/.test(String(item))) : value,
        ] as const,
    )
    .filter(([, value]) => value !== undefined && !(Array.isArray(value) && value.length === 0))
    .map(
      ([key, value]) =>
        `${key}: ${Array.isArray(value) ? value.join("; ") : typeof value === "object" ? JSON.stringify(value) : value}`,
    );

  const href =
    primary?.kind === "case"
      ? primary.href
      : SECTION_ANCHOR[project.show[0] as keyof typeof SECTION_ANCHOR];
  return {
    id: `projects/${project.slug}.md`,
    text: clean([...lines, "", project.body].join("\n")),
    source: { label: `${project.slug}.md`, href },
  };
}

// the /services page as the chat sees it, built from the same copy so the two never disagree
function servicesDoc(): Doc {
  return {
    id: "site/services.md",
    text: [
      "What he offers founders:",
      ...SERVICES.map((service) => `- ${service.title}: ${service.text} Proof: ${service.result}`),
      "",
      "How he works:",
      ...HOW_I_WORK.map((item) => `- ${item.title}. ${item.text} Proof: ${item.proof}`),
      "",
      "Process:",
      ...SERVICE_STEPS.map((step, index) => `${index + 1}. ${step.title}: ${step.text}`),
      "",
      `Formats: ${SERVICE_FORMATS.join(", ")}.`,
      `Terms: ${SERVICE_TERMS.join("; ")}.`,
      "",
      "FAQ:",
      ...SERVICE_FAQ.map((item) => `- Q: ${item.q} A: ${item.a}`),
    ].join("\n"),
    source: { label: "services", href: "/services" },
  };
}

function buildDocs(): Doc[] {
  const projects = getProjects().map(projectDoc);
  const experience = getExperience().map((job) => ({
    id: `experience/${job.slug}.md`,
    text: clean(
      [
        `company: ${job.company}${job.client ? ` (client: ${job.client})` : ""}`,
        `role: ${job.role}`,
        `dates: ${job.start} – ${job.end} · ${job.type} · ${job.location}`,
        `stack: ${job.stack.join(", ")}`,
        "",
        job.body,
      ].join("\n"),
    ),
    source: { label: `${job.slug}.md`, href: "/ai#experience" },
  }));
  const knowledgeDir = path.join(process.cwd(), "content/knowledge");
  const knowledge = fs
    .readdirSync(knowledgeDir)
    .filter((file) => file.endsWith(".md"))
    .sort()
    .map((file) => ({
      id: `knowledge/${file}`,
      text: clean(fs.readFileSync(path.join(knowledgeDir, file), "utf8")),
      source: { label: file, href: "/#about" },
    }));
  const site: Doc[] = [
    {
      id: "site/about.md",
      text: [`headline: ${HERO.title}`, `subline: ${HERO.sub}`, "", ...ABOUT].join("\n"),
      source: { label: "about.md", href: "/#about" },
    },
    {
      id: "site/skills.md",
      text: getSkillGroups()
        .map((group) => `${group.label}: ${group.items.join(", ")}`)
        .join("\n"),
      source: { label: "skills.md", href: "/ai#skills" },
    },
    {
      id: "site/contact.md",
      text: [
        `email: ${SITE.email}`,
        `telegram: ${SITE.socials.telegram}`,
        `github: ${SITE.socials.github}`,
        `cv: ${SITE.cv} (front-end version: ${HOMES["/frontend"].cv}, full-stack version: ${HOMES["/fullstack"].cv})`,
        `location: ${SITE.location.city}, ${SITE.location.country} (Europe/Kyiv: UTC+2 in winter, UTC+3 in summer)`,
        `open to: ${SITE.openTo.join(", ")}`,
      ].join("\n"),
      source: { label: "contact.md", href: "/#contact" },
    },
  ];
  // published articles only; a draft never reaches the model
  const posts: Doc[] = getPosts().map((post) => ({
    id: `posts/${post.slug}.md`,
    text: clean([`title: ${post.title}`, `date: ${post.date}`, `summary: ${post.summary}`, "", toPlainText(post.body)].join("\n")),
    source: { label: `${post.slug}.md`, href: `/blog/${post.slug}` },
  }));
  return [...site, servicesDoc(), ...knowledge, ...experience, ...projects, ...posts];
}

// server only: reads content/ from disk
let cache: { text: string; sources: Map<string, ChatSource> } | undefined;

// built once per server instance, in a fixed order so the cached prompt prefix never changes between requests
export function getKnowledge() {
  if (cache) return cache;
  const docs = buildDocs();
  cache = {
    text: docs.map((doc) => `<file path="${doc.id}">\n${doc.text}\n</file>`).join("\n\n"),
    sources: new Map(docs.map((doc) => [doc.id, doc.source])),
  };
  return cache;
}
