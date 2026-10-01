import { Progress } from "@/components/ui/Progress";
import { ProjectTags } from "@/components/ui/ProjectTags";
import { TextLink } from "@/components/ui/TextLink";
import { getProjectLinks } from "@/lib/project-links";
import type { Project } from "@/lib/schemas";

type Props = { project: Project };

export function NowBuildingCard({ project }: Props) {
  const now = project.nowBuilding;
  if (!now) return null;

  const { code } = getProjectLinks(project);
  // phases only when real ones are set; work in progress already says so in its status tag
  const phase = now.phase
    ? `Phase ${now.phase.current} of ${now.phase.total}`
    : project.status === "next-up"
      ? "Not started"
      : null;

  return (
    // on lg the cards share row tracks (subgrid), so titles, bars and footers line up across columns
    <li className="flex flex-col gap-[12px] bg-surface p-[20px] | md:gap-[22px] md:px-fl-20/28 md:py-fl-24/32 | lg:row-span-5 lg:grid lg:grid-rows-subgrid">
      <div className="flex items-start justify-between gap-[12px]">
        <ProjectTags status={project.status} tags={project.tags} />
        {phase && (
          <span className="shrink-0 text-[13px] leading-[18px] text-muted | md:text-[14px] md:leading-[20px]">
            {phase}
          </span>
        )}
      </div>

      <h3 className="text-fl-28/44 leading-[0.92] font-semibold tracking-[-0.035em]">
        {now.title ?? project.title}
      </h3>
      <p className="hidden text-fl-16/18 leading-[1.45] text-text-3 | md:block">
        {now.summary ?? project.description ?? project.summary}
      </p>

      {now.phase ? (
        <Progress current={now.phase.current} total={now.phase.total} className="lg:self-end" />
      ) : (
        <span aria-hidden className="hidden | lg:block" />
      )}

      <div className="flex flex-col gap-[14px] text-[13px] leading-[1.5] | md:mt-auto md:text-[14px] | lg:mt-0">
        <p className="text-text-3">
          <span className="text-muted">{now.lastUpdate} · </span>
          {now.updateNote}
        </p>
        {code && (
          <TextLink href={code} arrow="↗" className="w-fit">
            Repo
          </TextLink>
        )}
        {!code && project.status === "next-up" && <span className="text-muted">No repo yet</span>}
      </div>
    </li>
  );
}
