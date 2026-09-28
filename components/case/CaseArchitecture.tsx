import type { Project } from "@/lib/schemas";
import { GitGraph } from "./GitGraph";

type Architecture = NonNullable<Project["architecture"]>;

export function CaseArchitectureIntro({ architecture }: { architecture: Architecture }) {
  return (
    <>
      <p className="mt-[24px] max-w-[460px] text-fl-17/18 leading-[1.55] text-text-3 | lg:mt-[28px]">
        {architecture.intro}
      </p>
      <ul className="mt-[24px] flex flex-col gap-[10px] font-mono text-[12px] leading-[16px] tracking-[0.06em] text-text-3 uppercase | lg:mt-[27px]">
        <li className="flex items-center gap-[12px]">
          <span aria-hidden className="size-[10px] rounded-full border-2 border-text" />
          Deterministic code
        </li>
        <li className="flex items-center gap-[12px]">
          <span aria-hidden className="size-[10px] rounded-full bg-accent" />
          LLM
        </li>
      </ul>
    </>
  );
}

export function CaseArchitecture({ architecture }: { architecture: Architecture }) {
  return <GitGraph steps={architecture.steps} />;
}
