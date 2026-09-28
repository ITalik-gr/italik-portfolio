import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type { z } from "zod";
import { experienceSchema, projectSchema, type Experience, type Project } from "@/lib/schemas";

const CONTENT_DIR = path.join(process.cwd(), "content");

function readCollection<T extends { slug: string }>(
  dir: string,
  schema: z.ZodType<T, unknown>,
): (T & { body: string })[] {
  const fullDir = path.join(CONTENT_DIR, dir);

  return fs
    .readdirSync(fullDir)
    .filter((file) => file.endsWith(".md"))
    .map((file) => {
      const { data, content } = matter(fs.readFileSync(path.join(fullDir, file), "utf8"));
      const parsed = schema.safeParse(data);

      // invalid frontmatter has to break the build, not render half a card
      if (!parsed.success) {
        throw new Error(`content/${dir}/${file}: ${parsed.error.message}`);
      }

      const { slug } = parsed.data;
      if (`${slug}.md` !== file) {
        throw new Error(`content/${dir}/${file}: slug "${slug}" must match the file name`);
      }

      return { ...parsed.data, body: content.trim() };
    });
}

const byOrder = (a: { order: number }, b: { order: number }) => a.order - b.order;

export function getProjects(): Project[] {
  return readCollection("projects", projectSchema).sort(byOrder);
}

export function getProject(slug: string) {
  return getProjects().find((project) => project.slug === slug);
}

export function getFeaturedProjects() {
  return getProjects().filter((project) => project.featured);
}

export function getLabProjects() {
  return getProjects().filter((project) => project.kind === "personal" && project.lab);
}

// active work first, then rewrites, then what's queued
const NOW_RANK: Partial<Record<Project["status"], number>> = {
  building: 0,
  "v2-in-progress": 1,
  "next-up": 2,
};

export function getNowBuilding() {
  return getProjects()
    .filter((project) => project.nowBuilding)
    .sort((a, b) => (NOW_RANK[a.status] ?? 3) - (NOW_RANK[b.status] ?? 3));
}

export function getClientProjects() {
  return getProjects().filter((project) => project.kind === "client");
}

export function getCaseStudies() {
  return getProjects().filter((project) => project.caseStudy);
}

// case bodies are "## Heading" blocks of plain paragraphs
export function getBodySections(body: string) {
  const sections: Record<string, string[]> = {};
  for (const block of body.split(/^## /m).slice(1)) {
    const [heading, ...rest] = block.split("\n");
    sections[heading.trim()] = rest
      .join("\n")
      .split(/\n\s*\n/)
      .map((paragraph) => paragraph.trim())
      .filter(Boolean);
  }
  return sections;
}

export function getExperience(): Experience[] {
  return readCollection("experience", experienceSchema).sort(byOrder);
}
