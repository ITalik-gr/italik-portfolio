import type { ReactNode } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { cn } from "@/lib/utils";

type Props = {
  id: string;
  label: string;
  aside?: ReactNode;
  // wide: the content takes the full width under a label row, with meta on the right
  wide?: boolean;
  meta?: string;
  children: ReactNode;
  className?: string;
};

export function CaseSection({ id, label, aside, wide, meta, children, className }: Props) {
  if (wide) {
    return (
      <section
        aria-labelledby={id}
        className={cn(
          "mt-fl-96/160 border-t border-line px-gutter pt-[20px] | md:pt-[24px]",
          className,
        )}
      >
        <div className="flex items-baseline justify-between gap-[24px]">
          <CaseLabel id={id} label={label} />
          {meta && (
            <p className="hidden text-[15px] leading-[21px] text-muted | md:block">
              {meta}
            </p>
          )}
        </div>
        <div className="mt-fl-32/48">{children}</div>
      </section>
    );
  }
  return (
    <section
      aria-labelledby={id}
      className={cn(
        "mt-fl-96/160 grid gap-y-[24px] border-t border-line px-gutter pt-[20px] | md:pt-[24px] | lg:grid-cols-4 lg:gap-x-[24px]",
        className,
      )}
    >
      <Reveal>
        <CaseLabel id={id} label={label} />
        {aside}
      </Reveal>
      <Reveal className="min-w-0 | lg:col-span-3">{children}</Reveal>
    </section>
  );
}

export function CaseLabel({ id, label }: { id: string; label: string }) {
  return (
    <h2 id={id} className="text-[14px] leading-[20px] text-text | md:text-[15px] md:leading-[21px]">
      {label}
    </h2>
  );
}
