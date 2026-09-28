import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Props = {
  id: string;
  number: string;
  label: string;
  // extra copy under the label in the left column (Architecture intro)
  aside?: ReactNode;
  children: ReactNode;
  className?: string;
};

export function CaseSection({ id, number, label, aside, children, className }: Props) {
  return (
    <section
      aria-labelledby={id}
      className={cn(
        "mt-fl-96/160 grid gap-y-[24px] border-t border-line px-gutter pt-[20px] | md:pt-[24px] | lg:grid-cols-4 lg:gap-x-[24px]",
        className,
      )}
    >
      <div>
        <CaseLabel id={id} number={number} label={label} />
        {aside}
      </div>
      <div className="min-w-0 | lg:col-span-3">{children}</div>
    </section>
  );
}

export function CaseLabel({ id, number, label }: { id: string; number: string; label: string }) {
  return (
    <h2
      id={id}
      className="flex gap-[12px] font-mono text-[12px] leading-[16px] tracking-[0.08em] text-text uppercase | md:gap-[14px] md:text-[13px] md:leading-[17px]"
    >
      <span className="text-accent">{number}</span>
      <span>{label}</span>
    </h2>
  );
}
