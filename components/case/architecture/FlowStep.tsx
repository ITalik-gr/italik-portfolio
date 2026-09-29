import type { FlowArchitecture } from "@/lib/schemas-architecture";
import { cn } from "@/lib/utils";
import { KIND_LABELS, kindBox, kindLabelColor } from "./kinds";

type Step = FlowArchitecture["steps"][number];
type Props = {
  step: Step;
  index: number;
  arrow?: "accent" | "muted";
  // the last block of the first row on xl: the wrap line replaces its arrow there
  wraps?: boolean;
};

// stacked below xl (label and title left, note right from md), rows of equal blocks from xl
export function FlowStep({ step, index, arrow, wraps }: Props) {
  const check = step.kind === "check";

  return (
    <li className="relative flex | xl:min-w-0 xl:flex-1 xl:basis-0">
      <div
        className={cn(
          "flex w-full flex-col gap-[10px] p-[16px] | md:grid md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:items-start md:gap-x-[32px] md:p-[20px] | xl:flex xl:flex-col xl:gap-[12px]",
          kindBox(step.kind, "flow"),
        )}
      >
        <div className="flex flex-col gap-[10px] | md:gap-[12px]">
          <p
            className={cn(
              "font-mono text-[11px] leading-[14px] tracking-[0.12em] uppercase",
              kindLabelColor(step.kind, "flow"),
            )}
          >
            {String(index + 1).padStart(2, "0")} · {KIND_LABELS[step.kind]}
          </p>
          <p
            className={cn(
              "text-fl-18/20 leading-[1.3] font-semibold tracking-[-0.01em]",
              check ? "text-bg" : "text-text",
            )}
          >
            {step.title}
          </p>
        </div>
        {step.note && (
          <p
            className={cn(
              "text-[14px] leading-[20px] | md:pt-[26px] | xl:pt-0",
              check ? "text-line-strong" : "text-text-3",
            )}
          >
            {step.note}
          </p>
        )}
      </div>
      {arrow && (
        <span
          aria-hidden
          className={cn(
            "absolute top-full left-[20px] flex h-[32px] items-center font-mono text-[18px] leading-none | md:h-[40px] | xl:top-1/2 xl:left-full xl:h-auto xl:w-[40px] xl:-translate-y-1/2 xl:justify-center",
            arrow === "accent" ? "text-accent" : "text-muted",
            wraps && "xl:hidden",
          )}
        >
          <span className="xl:hidden">↓</span>
          <span className="hidden | xl:inline">→</span>
        </span>
      )}
    </li>
  );
}
