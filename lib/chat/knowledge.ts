import fs from "node:fs";
import path from "node:path";
import { getExperience, getProjects } from "@/lib/content";
import { getProjectLinks } from "@/lib/project-links";
import type { Project } from "@/lib/schemas";
import { ABOUT, HERO, SITE } from "@/lib/site";
import { getSkillGroups } from "@/lib/site-lists";
import type { ChatSource } from "./types";

type Doc = { id: string; text: string; source: ChatSource };

const SECTION_ANCHOR = { featured: "/#work", lab: "/#lab", now: "/#now", clients: "/#clients" };

// unfinished or unconfirmed facts never reach the model
const isDraft = (line: string) => /\[(TODO|verify)|^\s*TODO:?/i.test(line);
const clean = (text: string) =>
  text
    .split("\n")
    .filter((line) => !isDraft(line))
    .join("\n")
    .trim();

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
    architecture: project.architecture?.steps.map((s) => `${s.lane}: ${s.text}`),
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
    source: { label: `${job.slug}.md`, href: "/#experience" },
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
      source: { label: "skills.md", href: "/#skills" },
    },
    {
      id: "site/contact.md",
      text: [
        `email: ${SITE.email}`,
        `telegram: ${SITE.socials.telegram}`,
        `github: ${SITE.socials.github}`,
        `cv: ${SITE.cv}`,
        `location: ${SITE.location.city}, ${SITE.location.country} (${SITE.location.utc})`,
        `open to: ${SITE.openTo.join(", ")}`,
      ].join("\n"),
      source: { label: "contact.md", href: "/#contact" },
    },
  ];
  return [...site, ...knowledge, ...experience, ...projects];
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
