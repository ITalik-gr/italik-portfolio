import { Progress } from "@/components/ui/Progress";
import { Status } from "@/components/ui/Status";
import { TextLink } from "@/components/ui/TextLink";
import { getProjectLinks } from "@/lib/project-links";
import type { Project } from "@/lib/schemas";

type Props = { project: Project };

export function NowBuildingCard({ project }: Props) {
  const now = project.nowBuilding;
  if (!now) return null;

  const { code } = getProjectLinks(project);
  const phase = now.phase ? `Phase ${now.phase.current} of ${now.phase.total}` : "Not started";

  return (
    // on lg the cards share row tracks (subgrid), so titles, bars and footers line up across columns
    <li className="flex flex-col gap-[12px] bg-surface p-[20px] | md:gap-[22px] md:px-fl-20/28 md:py-fl-24/32 | lg:row-span-5 lg:grid lg:grid-rows-subgrid">
      <div className="flex items-center justify-between gap-[12px] font-mono text-[11px] leading-[14px] tracking-[0.06em] text-muted uppercase | md:text-[12px] md:leading-[16px]">
        <Status
          status={project.status}
          className="text-[11px] leading-[14px] | md:text-[12px] md:leading-[16px]"
        />
        <span>{phase}</span>
      </div>

      <h3 className="text-fl-28/44 leading-[0.92] font-bold tracking-[-0.04em] font-stretch-[88%]">
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

      <div className="flex flex-col gap-[14px] font-mono text-[11px] leading-[1.6] | md:mt-auto md:text-[12px] | lg:mt-0">
        <p className="text-text-3">
          <span className="text-muted">{now.lastUpdate} · </span>
          {now.updateNote}
        </p>
        {code && (
          <TextLink href={code} arrow="↗" className="w-fit">
            Repo
          </TextLink>
        )}
        {!code && project.status === "next-up" && (
          <span className="tracking-[0.04em] text-faint uppercase">No repo yet</span>
        )}
      </div>
    </li>
  );
}
