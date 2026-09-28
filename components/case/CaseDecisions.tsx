import type { Project } from "@/lib/schemas";

type Props = { decisions: NonNullable<Project["decisions"]> };

export function CaseDecisions({ decisions }: Props) {
  return (
    <ul className="flex flex-col gap-fl-32/48">
      {decisions.map((decision) => (
        <li key={decision.chose} className="grid gap-y-[10px] | md:grid-cols-2 md:gap-x-[32px]">
          <p className="text-fl-22/30 leading-[1.15] tracking-[-0.02em]">
            Chose <span className="text-accent">{decision.chose}</span> over {decision.over}
          </p>
          <p className="text-fl-16/18 leading-[1.55] text-text-3">because {decision.because}</p>
        </li>
      ))}
    </ul>
  );
}
