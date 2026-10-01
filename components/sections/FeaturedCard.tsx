import Link from "next/link";
import { MorphSource, ProjectMorph } from "@/components/motion/ProjectMorph";
import { Parallax } from "@/components/motion/Parallax";
import { Button } from "@/components/ui/Button";
import { CoverImage } from "@/components/ui/CoverImage";
import { ImageFrame } from "@/components/ui/ImageFrame";
import { MetaTable } from "@/components/ui/MetaTable";
import { Status } from "@/components/ui/Status";
import { getProjectLinks } from "@/lib/project-links";
import type { Project } from "@/lib/schemas";
import { cn } from "@/lib/utils";

type Props = { project: Project; mirrored: boolean };

export function FeaturedCard({ project, mirrored }: Props) {
  const { case: caseHref, live, liveLabel, code } = getProjectLinks(project);
  const titleId = `featured-${project.slug}`;

  const meta = [
    { key: "Type", value: project.typeLabel },
    {
      key: "Status",
      value: <Status status={project.status} note={project.statusNote} />,
    },
    project.shipsAs
      ? { key: "Ships as", value: project.shipsAs.join(" · ") }
      : { key: "Stack", value: project.stack.join(" · ") },
  ];

  const frame = (
    <ImageFrame url={project.frameUrl} ratio="16/10">
      {/* a real screenshot stays whole: the taller parallax layer would zoom it and clip the UI */}
      {project.cover ? (
        <CoverImage
          src={project.cover}
          alt={`${project.title}: screenshot`}
          sizes="(min-width: 1024px) 58vw, 100vw"
        />
      ) : (
        <Parallax>
          <div className="flex size-full items-center justify-center bg-surface text-[14px] text-muted">
            {project.title} · screenshot
          </div>
        </Parallax>
      )}
    </ImageFrame>
  );

  return (
    <article
      aria-labelledby={titleId}
      className={cn(
        "grid items-center gap-[24px] pt-fl-56/64 | lg:gap-fl-24/40",
        mirrored ? "lg:grid-cols-[7fr_5fr] lg:pt-[140px]" : "lg:grid-cols-[5fr_7fr]",
      )}
    >
      <MorphSource slug={project.slug} source="featured">
        <ProjectMorph slug={project.slug} part="cover" source="featured">
          <div
            data-cursor={caseHref ? "View" : undefined}
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
        </ProjectMorph>

        <div className="flex flex-col gap-[32px] | lg:gap-[40px]">
          <div className="flex flex-col gap-[20px] | lg:gap-[24px]">
            <ProjectMorph slug={project.slug} part="title" source="featured">
              <h3
                id={titleId}
                className={cn(
                  "leading-[0.86] font-semibold tracking-[-0.045em]",
                  // long names ("AI Telegram Assistant") step down so their lines fit the column
                  project.title.length > 14 ? "text-fl-44/68" : "text-fl-56/92",
                )}
              >
                {caseHref ? (
                  <Link
                    href={caseHref}
                    className="transition-colors duration-150 hover:text-accent"
                  >
                    <TitleWords title={project.title} />
                  </Link>
                ) : (
                  <TitleWords title={project.title} />
                )}
              </h3>
            </ProjectMorph>
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
                {liveLabel}
              </Button>
            )}
            {/* client code is never public, so a disabled button would only read as something missing */}
            {(code || project.kind === "personal") && (
              <Button href={code ?? "#"} variant={code ? "ghost" : "disabled"} arrow="↗">
                Code
              </Button>
            )}
          </div>
        </div>
      </MorphSource>
    </article>
  );
}

// the design stacks each word of the name on its own line
// one word per line, but a short word ("AI") rides with the next one instead of standing alone
function TitleWords({ title }: { title: string }) {
  const lines = title.split(" ").reduce<string[]>((acc, word) => {
    const last = acc.at(-1);
    if (last && last.length <= 3 && !last.includes(" ")) acc[acc.length - 1] = `${last} ${word}`;
    else acc.push(word);
    return acc;
  }, []);
  return lines.map((line) => (
    <span key={line} className="block">
      {line}{" "}
    </span>
  ));
}
