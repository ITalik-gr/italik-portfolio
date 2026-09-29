import { getKnowledge } from "@/lib/chat/knowledge";
import { getExperience, getProjects } from "@/lib/content";
import { STATUS_LABELS } from "@/lib/format";
import { getProjectLinks, isExternal } from "@/lib/project-links";
import type { Project } from "@/lib/schemas";
import { siteUrl } from "@/lib/seo";
import { ABOUT, HERO, SITE } from "@/lib/site";
import { getSkillGroups } from "@/lib/site-lists";

// llms.txt (llmstxt.org): a plain Markdown index of the site for AI assistants and crawlers

const absolute = (href: string) => (isExternal(href) ? href : `${siteUrl}${href}`);

const status = (project: Project) =>
  [STATUS_LABELS[project.status], project.statusNote].filter(Boolean).join(", ");

function projectLine(project: Project) {
  const { primary, live, code } = getProjectLinks(project);
  const title = primary ? `[${project.title}](${absolute(primary.href)})` : project.title;
  const extra = [
    live && primary?.href !== live && `live: ${live}`,
    code && `code: ${code}`,
  ].filter(Boolean);
  return `- ${title}: ${project.summary} (${project.typeLabel} · ${status(project)}${extra.length ? ` · ${extra.join(" · ")}` : ""})`;
}

export function buildLlmsTxt() {
  const projects = getProjects().filter((project) => !project.draft);
  const personal = projects.filter((project) => project.kind === "personal");
  const client = projects.filter((project) => project.kind === "client");

  return [
    `# ${SITE.name} (${SITE.handle})`,
    "",
    `> ${SITE.meta.description}`,
    "",
    `${SITE.roleLine}. Based in ${SITE.location.city}, ${SITE.location.country}; works remotely and is open to ${SITE.openTo.join(", ")} roles.`,
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
    `- GitHub: ${SITE.socials.github}`,
    `- [CV (PDF)](${absolute(SITE.cv)})`,
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
    `> ${SITE.meta.description} Source: ${siteUrl}. Short index: ${siteUrl}/llms.txt`,
    "",
    getKnowledge().text,
    "",
  ].join("\n");
}
