import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ImageFrame } from "@/components/ui/ImageFrame";
import { MetaTable } from "@/components/ui/MetaTable";
import { Status } from "@/components/ui/Status";
import { getProjectLinks } from "@/lib/project-links";
import type { Project } from "@/lib/schemas";
import { cn } from "@/lib/utils";

type Props = { project: Project; mirrored: boolean };

export function FeaturedCard({ project, mirrored }: Props) {
  const { caseHref, live, code } = getProjectLinks(project);
  const titleId = `featured-${project.slug}`;

  const meta = [
    { key: "Type", value: project.typeLabel },
    {
      key: "Status",
      value: <Status status={project.status} note={project.statusNote} size="meta" />,
    },
    project.shipsAs
      ? { key: "Ships as", value: project.shipsAs.join(" · ") }
      : { key: "Stack", value: project.stack.join(" · ") },
  ];

  const frame = (
    <ImageFrame url={project.frameUrl} ratio="16/10" label={`${project.title} · screenshot`} />
  );

  return (
    <article
      aria-labelledby={titleId}
      className={cn(
        "grid items-center gap-[24px] pt-fl-56/64 | lg:gap-fl-24/40",
        mirrored ? "lg:grid-cols-[7fr_5fr] lg:pt-[140px]" : "lg:grid-cols-[5fr_7fr]",
      )}
    >
      <div
        className={cn(
          "transition-transform duration-600 ease-out-expo hover:scale-[1.015]",
          !mirrored && "lg:order-2",
        )}
      >
        {caseHref ? (
          <Link href={caseHref} tabIndex={-1} aria-hidden>
            {frame}
          </Link>
        ) : (
          frame
        )}
      </div>

      <div className="flex flex-col gap-[32px] | lg:gap-[40px]">
        <div className="flex flex-col gap-[20px] | lg:gap-[24px]">
          <h3
            id={titleId}
            className="text-fl-56/92 leading-[0.86] font-bold tracking-[-0.05em] font-stretch-[88%]"
          >
            {caseHref ? (
              <Link href={caseHref} className="transition-colors duration-150 hover:text-accent">
                <TitleWords title={project.title} />
              </Link>
            ) : (
              <TitleWords title={project.title} />
            )}
          </h3>
          {project.keyIdea && (
            <p className="text-fl-21/26 leading-[1.25] tracking-[-0.015em] text-accent">
              {project.keyIdea}
            </p>
          )}
          <p className="text-fl-17/19 leading-[1.5] text-text-3">{project.summary}</p>
        </div>

        <MetaTable rows={meta} />

        <div className="flex flex-wrap gap-[10px]">
          <Button href={caseHref ?? "#"} variant={caseHref ? "primary" : "disabled"} arrow="→">
            Case study
          </Button>
          {live && (
            <Button href={live} variant="ghost" arrow="↗">
              Live
            </Button>
          )}
          <Button href={code ?? "#"} variant={code ? "ghost" : "disabled"} arrow="↗">
            Code
          </Button>
        </div>
      </div>
    </article>
  );
}

// the design stacks each word of the name on its own line
function TitleWords({ title }: { title: string }) {
  return title.split(" ").map((word) => (
    <span key={word} className="block">
      {word}{" "}
    </span>
  ));
}
