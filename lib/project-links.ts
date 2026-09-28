import type { Project } from "@/lib/schemas";

// one place decides which links a project may show (NDA / migrated sites show none)
export function getProjectLinks(project: Project) {
  const caseHref = project.caseStudy ? `/work/${project.slug}` : undefined;
  if (project.hideLinks) return { caseHref };

  return {
    caseHref,
    live: project.links.live ?? project.links.demo,
    code: project.links.code,
  };
}

// where a project title leads: its case, then an on-site target, then the live site
export function getProjectHref(project: Project) {
  const { caseHref, live } = getProjectLinks(project);
  return caseHref ?? project.internalLink ?? live;
}
