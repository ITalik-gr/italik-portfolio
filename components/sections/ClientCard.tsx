import Link from "next/link";
import type { ReactNode } from "react";
import { getProjectLinks } from "@/lib/project-links";
import type { Project } from "@/lib/schemas";
import { cn } from "@/lib/utils";

type Props = { project: Project };

const STATUS_TEXT: Record<Project["status"], string> = {
  live: "Live",
  building: "Building",
  "v2-in-progress": "v2 in progress",
  "next-up": "Next up",
  nda: "",
  offline: "Offline",
  archived: "Archived",
};

// NDA cards only carry their note ("In progress"), everything else is "Status · note"
function statusText(project: Project) {
  const note = project.statusNote;
  if (project.status === "nda") return note ? note.charAt(0).toUpperCase() + note.slice(1) : "";
  return note ? `${STATUS_TEXT[project.status]} · ${note}` : STATUS_TEXT[project.status];
}

export function ClientCard({ project }: Props) {
  const { caseHref, live } = getProjectLinks(project);
  const href = caseHref ?? live;
  const nda = project.status === "nda";
  const marker = caseHref ? "Case study →" : live ? "Live ↗" : nda ? "NDA" : undefined;

  const rows = [
    { key: "My role", value: project.role },
    { key: "Stack", value: project.stack.join(" · ") },
    { key: "Status", value: statusText(project) },
  ].filter((row) => row.value);

  const card: ReactNode = (
    <>
      {/* TODO: project.cover (16:10) via next/image; NDA covers stay blurred mock-ups */}
      <div className="relative aspect-[16/10] overflow-hidden bg-surface">
        <div
          className={cn(
            "flex size-full items-center justify-center font-mono text-[12px] text-faint transition-transform duration-600 ease-out-expo group-hover:scale-[1.015]",
            nda && "blur-[10px] grayscale-[0.4]",
          )}
        >
          {project.title} · screenshot
        </div>
        {nda && (
          <span className="absolute top-[12px] left-[12px] border border-line-strong bg-bg px-[8px] py-[4px] font-mono text-[11px] leading-[14px] tracking-[0.06em] uppercase">
            NDA · details limited
          </span>
        )}
      </div>

      <div className="flex items-baseline justify-between gap-[12px]">
        <h3 className="text-fl-32/44 leading-[0.9] font-bold tracking-[-0.045em] font-stretch-[88%] transition-colors duration-150 group-hover:text-accent">
          {project.title}
        </h3>
        {marker && (
          <span className="shrink-0 font-mono text-[12px] leading-[16px] text-text-3">
            {marker}
          </span>
        )}
      </div>

      <dl className="grid grid-cols-[80px_1fr] gap-y-[8px] border-t border-line pt-[14px] font-mono text-[12px] leading-[18px]">
        {rows.map((row) => (
          <div key={row.key} className="contents">
            <dt className="text-muted uppercase">{row.key}</dt>
            <dd className="text-text">{row.value}</dd>
          </div>
        ))}
      </dl>
    </>
  );

  const cardClass = "group flex flex-col gap-[18px]";

  return (
    <li>
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
    </li>
  );
}
