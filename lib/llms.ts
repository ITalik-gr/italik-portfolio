import { getKnowledge } from "@/lib/chat/knowledge";
import { getExperience, getProjects } from "@/lib/content";
import { STATUS_LABELS } from "@/lib/format";
import { PROFILES, ROLE_PROFILES } from "@/lib/profiles";
import { getProjectLinks, isExternal } from "@/lib/project-links";
import type { Project } from "@/lib/schemas";
import { siteUrl } from "@/lib/seo";
import { ABOUT, HERO, HOMES, SITE } from "@/lib/site";
import { getSkillGroups } from "@/lib/site-lists";

// llms.txt (llmstxt.org): a plain Markdown index of the site for AI assistants and crawlers

const absolute = (href: string) => (isExternal(href) ? href : `${siteUrl}${href}`);

const status = (project: Project) =>
  [STATUS_LABELS[project.status], project.statusNote].filter(Boolean).join(", ");

function projectLine(project: Project) {
  const { primary, live, code } = getProjectLinks(project);
  const title = primary ? `[${project.title}](${absolute(primary.href)})` : project.title;
  const extra = [live && primary?.href !== live && `live: ${live}`, code && `code: ${code}`].filter(
    Boolean,
  );
  return `- ${title}: ${project.summary} (${project.typeLabel} · ${status(project)}${extra.length ? ` · ${extra.join(" · ")}` : ""})`;
}

export function buildLlmsTxt() {
  const projects = getProjects().filter((project) => !project.draft);
  const personal = projects.filter((project) => project.kind === "personal");
  const client = projects.filter((project) => project.kind === "client");

  return [
    `# ${SITE.name} (${SITE.handle})`,
    "",
    `> ${SITE.description}`,
    "",
    `${SITE.roleLine}. Based in ${SITE.location.city}, ${SITE.location.country}, works remotely.`,
    "",
    // plain answers for an assistant asked "who can build this?" or "is he available?"
    "## For founders: build your product",
    "",
    `- ${PROFILES.client.meta.description}`,
    "- Builds: AI agents and LLM features inside real products (tool use, MCP servers, grounding, evals); full-stack web apps with React, Next.js, Node.js and NestJS; fast marketing sites in Next.js or Astro.",
    `- Details: ${siteUrl}/services. Weekly demo; the client owns all code and accounts; NDA on request; contract and invoicing agreed before the start; first month of support free; rates on request.`,
    `- Reach him: ${SITE.email} or Telegram ${SITE.socials.telegram}. The chat at ${siteUrl}/#ask answers questions about his work.`,
    "",
    "## For employers: hire him",
    "",
    `- Open to ${SITE.openTo.join(", ")} roles, remote from ${SITE.location.city} (Europe/Kyiv time).`,
    ...ROLE_PROFILES.map((profile) => {
      const cv = HOMES[profile.path]?.cv;
      return `- [${profile.meta.title}](${siteUrl}${profile.path}): the portfolio for this role${cv ? `, [CV (PDF)](${absolute(cv)})` : ""}`;
    }),
    "",
    "## About, in his words",
    "",
    HERO.sub,
    "",
    ...ABOUT.flatMap((paragraph) => [paragraph, ""]),
    "## Contact",
    "",
    `- Email: ${SITE.email}`,
    `- Telegram: ${SITE.socials.telegram}`,
    `- X: ${SITE.socials.x}`,
    `- GitHub: ${SITE.socials.github}`,
    `- [Ask the AI chat about him](${siteUrl}/#ask): answers from this site's content only`,
    "",
    "## AI and personal projects",
    "",
    ...personal.map(projectLine),
    "",
    "## Client work",
    "",
    ...client.map(projectLine),
    "",
    "## Experience",
    "",
    ...getExperience().map(
      (job) =>
        `- ${job.company}${job.client ? ` (client: ${job.client})` : ""}: ${job.role}, ${job.start} – ${job.end}, ${job.type.toLowerCase()}, ${job.location.toLowerCase()}`,
    ),
    "",
    "## Skills",
    "",
    ...getSkillGroups().map((group) => `- ${group.label}: ${group.items.join(", ")}`),
    "",
    "## Optional",
    "",
    `- [Full profile](${siteUrl}/llms-full.txt): every project, case study and job in full, the same knowledge base the site's AI chat uses`,
    "",
  ].join("\n");
}

export function buildLlmsFullTxt() {
  return [
    `# ${SITE.name} (${SITE.handle}): full profile`,
    "",
    `> ${SITE.description} Source: ${siteUrl}. Short index: ${siteUrl}/llms.txt`,
    "",
    getKnowledge().text,
    "",
  ].join("\n");
}
