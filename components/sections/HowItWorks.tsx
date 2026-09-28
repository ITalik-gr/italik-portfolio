import { Fragment } from "react";
import { ASK } from "@/lib/site";
import { cn } from "@/lib/utils";

export function HowItWorks({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-col gap-[14px]", className)}>
      <h3 className="font-mono text-[11px] leading-[14px] tracking-[0.06em] text-muted uppercase">
        How this works
      </h3>
      <ol className="flex flex-wrap items-center gap-[8px] font-mono text-[12px] leading-[16px]">
        {ASK.pipeline.map((step, index) => (
          <Fragment key={step}>
            {index > 0 && (
              <li aria-hidden className="text-faint">
                →
              </li>
            )}
            <li
              className={cn(
                "border border-line-strong px-[10px] py-[8px]",
                step === ASK.pipelineAccent && "border-accent text-accent",
              )}
            >
              {step}
            </li>
          </Fragment>
        ))}
      </ol>
      <p className="max-w-[552px] font-mono text-[12px] leading-[1.6] text-muted">
        {ASK.howItWorks}
      </p>
    </div>
  );
}
