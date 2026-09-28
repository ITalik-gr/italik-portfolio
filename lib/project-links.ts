import type { Project } from "@/lib/schemas";

export type ProjectLinks = {
  // the case study page, only when the project has one
  case?: string;
  // the running product: live site, or a demo when that is all there is
  live?: string;
  liveLabel: "Live" | "Live demo";
  code?: string;
  // where the project's title or card leads: its case, else an on-site target, else the live site
  primary?: { href: string; kind: "case" | "internal" | "live" };
};

// the one place that decides a project's links; components never read project.links directly
export function getProjectLinks(project: Project): ProjectLinks {
  const caseHref = project.caseStudy ? `/work/${project.slug}` : undefined;
  // NDA and migrated sites show no outside links at all
  const live = project.hideLinks ? undefined : (project.links.live ?? project.links.demo);
  const code = project.hideLinks ? undefined : project.links.code;

  let primary: ProjectLinks["primary"];
  if (caseHref) primary = { href: caseHref, kind: "case" };
  else if (project.internalLink) primary = { href: project.internalLink, kind: "internal" };
  else if (live) primary = { href: live, kind: "live" };

  return {
    case: caseHref,
    live,
    liveLabel: !project.links.live && project.links.demo ? "Live demo" : "Live",
    code,
    primary,
  };
}

export const isExternal = (href: string) => /^https?:/.test(href);
