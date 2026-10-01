import { Button } from "@/components/ui/Button";
import { getProject } from "@/lib/content";
import { STATUS_LABELS } from "@/lib/format";
import { getProjectLinks } from "@/lib/project-links";

// the project the article is about: where to try it, its code and the case study
type Props = { slug?: string; only?: ("demo" | "code" | "case")[] };

export function PostProject({ slug, only }: Props) {
  const project = slug ? getProject(slug) : undefined;
  if (!project) return null;
  const shows = (link: "demo" | "code" | "case") => !only || only.includes(link);

  const links = getProjectLinks(project);
  // a reader is better off in the sandbox than in a stranger's account screen
  const tryIt = project.hideLinks ? undefined : (project.links.demo ?? links.live);
  const status = [project.title, STATUS_LABELS[project.status], project.statusNote].filter(Boolean).join(" · ");

  return (
    <div className="mt-[32px] flex flex-wrap items-center justify-between gap-[16px]">
      <span className="flex items-center gap-[10px] font-mono text-[12px] tracking-[0.06em] text-muted uppercase">
        <span aria-hidden className="size-[7px] rounded-full bg-accent" />
        {status}
      </span>
      <div className="flex flex-wrap gap-[8px]">
        {tryIt && shows("demo") && (
          <Button href={tryIt} size="sm" arrow="↗">
            {project.links.demo ? "Live demo" : "Live"}
          </Button>
        )}
        {links.code && shows("code") && (
          <Button href={links.code} variant="ghost" size="sm" arrow="↗">
            Code
          </Button>
        )}
        {links.case && shows("case") && (
          <Button href={links.case} variant="ghost" size="sm" arrow="→">
            Case study
          </Button>
        )}
      </div>
    </div>
  );
}
