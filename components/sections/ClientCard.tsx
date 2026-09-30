import Link from "next/link";
import type { ReactNode } from "react";
import { MorphSource, ProjectMorph } from "@/components/motion/ProjectMorph";
import { ProjectCover } from "@/components/ui/ProjectCover";
import { getProjectLinks } from "@/lib/project-links";
import type { Project } from "@/lib/schemas";
import { cn } from "@/lib/utils";

// shared: false when the same project is also featured above, so the featured copy keeps the morph
type Props = { project: Project; shared?: boolean };

const STATUS_TEXT: Record<Project["status"], string> = {
  live: "Live",
  building: "Building",
  "v2-in-progress": "v2 in progress",
  "next-up": "Next up",
  nda: "",
  offline: "Offline",
  archived: "Archived",
};

// the marker names where the card leads, so it can never say "Case study" and open the live site
const MARKERS = { case: "Case study →", internal: "Open →", live: "Live ↗" } as const;

// NDA cards only carry their note ("In progress"), everything else is "Status · note"
function statusText(project: Project) {
  const note = project.statusNote;
  if (project.status === "nda") return note ? note.charAt(0).toUpperCase() + note.slice(1) : "";
  return note ? `${STATUS_TEXT[project.status]} · ${note}` : STATUS_TEXT[project.status];
}

export function ClientCard({ project, shared = true }: Props) {
  const { primary } = getProjectLinks(project);
  const href = primary?.href;
  const nda = project.status === "nda";
  const marker = primary ? MARKERS[primary.kind] : nda ? "NDA" : undefined;

  const rows = [
    { key: "My role", value: project.role },
    { key: "Stack", value: project.stack.join(" · ") },
    { key: "Status", value: statusText(project) },
  ].filter((row) => row.value);

  const card: ReactNode = (
    <>
      <ProjectMorph slug={project.slug} part="cover" source="clients" primary={shared}>
        <div data-cursor={href ? "View" : undefined} className="relative">
          <ProjectCover
            label={project.title}
            src={project.cover}
            sizes="(min-width: 768px) 50vw, 100vw"
            innerClassName={cn(
              "transition-transform duration-600 ease-out-expo group-hover:scale-[1.015]",
              nda && "blur-[10px] grayscale-[0.4]",
            )}
          />
          {nda && (
            <span className="absolute top-[12px] left-[12px] border border-line-strong bg-bg px-[8px] py-[4px] text-[13px] leading-[18px]">
              NDA · details limited
            </span>
          )}
        </div>
      </ProjectMorph>

      <div className="flex items-baseline justify-between gap-[12px]">
        <ProjectMorph slug={project.slug} part="title" source="clients" primary={shared}>
          <h3 className="text-fl-32/44 leading-[0.9] font-semibold tracking-[-0.04em] transition-colors duration-150 group-hover:text-accent">
            {project.title}
          </h3>
        </ProjectMorph>
        {marker && (
          <span className="shrink-0 font-mono text-[12px] leading-[16px] text-text-3">
            {marker}
          </span>
        )}
      </div>

      <dl className="grid grid-cols-[80px_1fr] gap-y-[8px] border-t border-line pt-[14px] font-mono text-[12px] leading-[18px]">
        {rows.map((row) => (
          <div key={row.key} className="contents">
            <dt className="text-muted">{row.key}</dt>
            <dd className="text-text">{row.value}</dd>
          </div>
        ))}
      </dl>
    </>
  );

  const cardClass = "group flex flex-col gap-[18px]";

  return (
    <li>
      <MorphSource slug={project.slug} source="clients">
        {href ? (
          <Link
            href={href}
            {...(href.startsWith("http") && { target: "_blank", rel: "noopener noreferrer" })}
            className={cardClass}
          >
            {card}
          </Link>
        ) : (
          <div className={cardClass}>{card}</div>
        )}
      </MorphSource>
    </li>
  );
}
