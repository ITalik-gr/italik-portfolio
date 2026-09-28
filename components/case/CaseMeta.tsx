import type { ReactNode } from "react";
import { Status } from "@/components/ui/Status";
import type { Project } from "@/lib/schemas";
import { cn } from "@/lib/utils";

type Props = { project: Project; className?: string };

export function CaseMeta({ project, className }: Props) {
  const isClient = project.kind === "client";
  // no Type row: the kicker above the title already says it
  const rows: { key: string; value?: ReactNode }[] = isClient
    ? [
        { key: "My role", value: project.role },
        { key: "Team", value: project.team },
        { key: "Timeline", value: project.timeline },
        { key: "Stack", value: separated(project.stack) },
      ]
    : [
        { key: "Role", value: project.role },
        { key: "Timeline", value: project.timeline },
        { key: "Stack", value: separated(project.stack) },
        {
          key: "Status",
          value: (
            <Status
              status={project.status}
              note={project.statusNote}
              size="meta"
              className="text-[13px] leading-[20px] text-text-2 | lg:leading-[21px]"
            />
          ),
        },
      ];

  return (
    <dl className={className}>
      <div
        className={cn(
          "grid gap-y-[12px] border-y border-line py-[14px] font-mono | lg:gap-x-[24px] lg:py-[20px]",
          isClient ? "lg:auto-cols-fr lg:grid-flow-col" : "lg:grid-cols-[1fr_1fr_2fr_1fr]",
        )}
      >
        {rows
          .filter((row) => row.value)
          .map((row) => (
            <div
              key={row.key}
              className="grid grid-cols-[84px_1fr] | lg:flex lg:flex-col lg:gap-[5px]"
            >
              <dt className="text-[13px] leading-[20px] text-muted uppercase | lg:text-[11px] lg:leading-[17.6px] lg:tracking-[0.06em]">
                {row.key}
              </dt>
              <dd className="text-[13px] leading-[20px] text-text-2 | lg:leading-[21px] lg:pr-[24px]">
                {row.value}
              </dd>
            </div>
          ))}
      </div>
    </dl>
  );
}

// a no-break space glues the dot to the item before it, so a wrapped line never starts with "·"
// (items themselves may still wrap: "Strapi CMS → Astro content collections" is longer than a mobile line)
const separated = (items: string[]) => items.join("\u00a0· ");
