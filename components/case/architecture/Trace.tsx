import { Reveal } from "@/components/motion/Reveal";
import type { MapArchitecture } from "@/lib/schemas-architecture";
import { cn } from "@/lib/utils";
import { KIND_LABELS } from "./kinds";

type Trace = MapArchitecture["trace"];

const COLUMNS: Record<number, string> = {
  3: "lg:grid-cols-3",
  4: "lg:grid-cols-4",
  5: "lg:grid-cols-5",
  6: "lg:grid-cols-6",
};

const RULE = { code: "border-line-strong", llm: "border-accent", check: "border-text" } as const;

export function Trace({ trace }: { trace: Trace }) {
  return (
    <div>
      <Reveal className="flex flex-col gap-[8px] | md:flex-row md:items-baseline md:justify-between md:gap-[32px]">
        <h3 className="text-fl-24/32 leading-[1.1] font-bold tracking-[-0.02em]">
          One question, end to end
        </h3>
        <p className="font-mono text-[13px] leading-[18px] text-text-3 | md:text-[14px] md:leading-[20px]">
          “{trace.question}”
        </p>
      </Reveal>
      <Reveal
        as="ol"
        y={12}
        stagger={0.06}
        duration={0.5}
        className={cn(
          "mt-[20px] flex flex-col | md:mt-[28px] | lg:grid lg:gap-[16px]",
          COLUMNS[trace.steps.length] ?? "lg:grid-cols-6",
        )}
      >
        {trace.steps.map((step, index) => (
          <li
            key={index}
            className={cn(
              "grid grid-cols-[56px_1fr] gap-x-[12px] border-t py-[14px] | lg:flex lg:flex-col lg:gap-[12px] lg:py-0 lg:pt-[16px]",
              RULE[step.kind],
            )}
          >
            <p className="flex flex-col gap-[4px] font-mono text-[12px] leading-[16px] uppercase | lg:flex-row lg:gap-[10px]">
              <span className="text-muted">{String(index + 1).padStart(2, "0")}</span>
              <span className={step.kind === "llm" ? "text-accent" : "text-text"}>
                {KIND_LABELS[step.kind]}
              </span>
            </p>
            <p className="text-fl-15/16 leading-[1.5] text-text-2">{step.text}</p>
          </li>
        ))}
      </Reveal>
    </div>
  );
}
