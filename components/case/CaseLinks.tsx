import { Button } from "@/components/ui/Button";
import { getProjectLinks } from "@/lib/project-links";
import type { Project } from "@/lib/schemas";
import { cn } from "@/lib/utils";

type Props = { project: Project; className?: string };

export function CaseLinks({ project, className }: Props) {
  const { live, code } = getProjectLinks(project);
  const button = "h-[48px] justify-center py-0 | md:h-auto md:py-[16px]";
  // client repos are private, so an empty "Code" slot there would only add noise
  const showCode = Boolean(code) || project.kind === "personal";

  return (
    <div
      className={cn(
        "grid gap-[8px] | md:flex md:gap-[9px]",
        live && showCode && "grid-cols-2",
        className,
      )}
    >
      {live && (
        <Button href={live} size="lg" arrow="↗" className={button}>
          {project.links.demo ? "Live demo" : "Live"}
        </Button>
      )}
      {showCode && (
        <Button
          href={code ?? "#"}
          variant={code ? "ghost" : "disabled"}
          size="lg"
          arrow={code ? "↗" : undefined}
          className={button}
        >
          Code
        </Button>
      )}
    </div>
  );
}
