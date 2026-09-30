import { ProjectMorph } from "@/components/motion/ProjectMorph";
import { Reveal } from "@/components/motion/Reveal";
import { CoverImage } from "@/components/ui/CoverImage";
import { ImageFrame } from "@/components/ui/ImageFrame";
import type { Project } from "@/lib/schemas";
import { CaseLinks } from "./CaseLinks";
import { CaseMeta } from "./CaseMeta";

type Props = { project: Project; labPosition?: string };

const KICKER_SIDE = "hidden text-muted | md:inline";

// personal cases lead with the key idea and one-liner; client cases go straight to the meta
// the title and cover morph in from the home page, so only the rest goes through Reveal
// buttons sit next to the one-liner on desktop but after the meta on mobile, so they render twice
export function CaseHero({ project, labPosition }: Props) {
  const isClient = project.kind === "client";

  return (
    <header className="px-gutter pt-fl-24/64">
      <Reveal>
        <p className="flex items-center justify-between gap-[16px] text-[13px] leading-[18px] | md:text-[15px] md:leading-[21px]">
          <span className="flex gap-[10px] | md:gap-[14px]">
            <span className="text-accent">Case study</span>
            <span className="text-text">{project.typeLabel}</span>
          </span>
          {labPosition && <span className={KICKER_SIDE}>{labPosition}</span>}
          {project.via && <span className={KICKER_SIDE}>Via {project.via}</span>}
        </p>
      </Reveal>

      <div className="flex items-end justify-between gap-[40px]">
        <ProjectMorph slug={project.slug} part="title">
          <h1 className="mt-fl-22/36 text-fl-92/274 leading-[0.82] font-semibold tracking-[-0.05em] | md:text-fl-68/274">
            {project.title}
          </h1>
        </ProjectMorph>
        {isClient && (
          <Reveal delay={0.2} className="hidden shrink-0 | md:mb-[14px] md:block">
            <CaseLinks project={project} />
          </Reveal>
        )}
      </div>

      {project.keyIdea && (
        <Reveal delay={0.1}>
          <p className="mt-fl-24/40 max-w-[760px] text-fl-20/30 leading-[1.25] tracking-[-0.015em] text-accent">
            {project.keyIdea}
          </p>
        </Reveal>
      )}

      {!isClient && (
        <Reveal delay={0.15}>
          <div className="hidden | md:mt-[14px] md:flex md:items-end md:justify-between md:gap-[40px]">
            <p className="max-w-[760px] text-fl-17/21 leading-[1.45] text-text-3">
              {project.summary}
            </p>
            <CaseLinks project={project} className="shrink-0" />
          </div>
        </Reveal>
      )}

      <Reveal delay={0.2}>
        <CaseMeta project={project} className="mt-fl-32/56" />
        <CaseLinks project={project} className="mt-[24px] | md:hidden" />
      </Reveal>

      {/* no screenshot yet: skip the frame rather than show an empty grey box */}
      {project.cover && (
        <ProjectMorph slug={project.slug} part="cover">
          <ImageFrame url={project.frameUrl} className="mt-fl-32/56">
            <CoverImage
              src={project.cover}
              alt={`${project.title}: screenshot`}
              sizes="100vw"
              priority
            />
          </ImageFrame>
        </ProjectMorph>
      )}
    </header>
  );
}
