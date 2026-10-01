import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type { z } from "zod";
import {
  experienceSchema,
  postSchema,
  projectSchema,
  type Experience,
  type HOME_SECTIONS,
  type Post,
  type PostCardData,
  type Project,
} from "@/lib/schemas";
import { readingMinutes } from "@/lib/markdown";

type HomeSection = (typeof HOME_SECTIONS)[number];

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

// which home section shows a project is decided only by its `show` list
const inSection = (section: HomeSection) => (project: Project) => project.show.includes(section);

export function getFeaturedProjects() {
  return getProjects().filter(inSection("featured"));
}

export function getLabProjects() {
  return getProjects().filter(inSection("lab"));
}

// active work first, then rewrites, then what's queued
const NOW_RANK: Partial<Record<Project["status"], number>> = {
  building: 0,
  "v2-in-progress": 1,
  "next-up": 2,
};

export function getNowBuilding() {
  return getProjects()
    .filter(inSection("now"))
    .sort((a, b) => (NOW_RANK[a.status] ?? 3) - (NOW_RANK[b.status] ?? 3));
}

export function getClientProjects() {
  return getProjects().filter(inSection("clients"));
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

function getAllPosts(): Post[] {
  if (!fs.existsSync(path.join(CONTENT_DIR, "posts"))) return [];
  const posts = readCollection("posts", postSchema).sort((a, b) => b.date.localeCompare(a.date));
  // a typo in `project` would silently drop the links at the end of the article
  for (const post of posts) {
    if (post.project && !getProject(post.project)) {
      throw new Error(`content/posts/${post.slug}.md: unknown project "${post.project}"`);
    }
  }
  return posts;
}

// published only, newest first: the blog page, the home block, nav, RSS, sitemap, llms.txt.
// no published post means no blog at all
export function getPosts() {
  return getAllPosts().filter((post) => !post.draft);
}

// pages that get built; drafts open only in `pnpm dev`, so they can be read before publishing
export function getPostPages() {
  return process.env.NODE_ENV === "development" ? getAllPosts() : getPosts();
}

export function getPost(slug: string) {
  return getPostPages().find((post) => post.slug === slug);
}

export function toPostCard({ body, ...post }: Post): PostCardData {
  return { ...post, minutes: readingMinutes(body) };
}

// up to three other published posts, the ones sharing most tags first
export function getRelatedPosts(post: Post, limit = 3) {
  const shared = (other: Post) => other.tags.filter((tag) => post.tags.includes(tag)).length;
  return getPosts()
    .filter((other) => other.slug !== post.slug)
    .sort((a, b) => shared(b) - shared(a) || b.date.localeCompare(a.date))
    .slice(0, limit);
}

// the published neighbours by date: older is "previous", newer is "next"
export function getPostNeighbours(post: Post) {
  const posts = getPosts();
  const index = posts.findIndex((other) => other.slug === post.slug);
  if (index === -1) return { prev: undefined, next: undefined };
  return { prev: posts[index + 1], next: index > 0 ? posts[index - 1] : undefined };
}
