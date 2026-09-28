import type { ReactNode } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { cn } from "@/lib/utils";

type Props = {
  id: string;
  labelledBy: string;
  children: ReactNode;
  className?: string;
};

// the hairline runs edge to edge, content keeps the page gutters
export function Section({ id, labelledBy, children, className }: Props) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={cn(
        "mt-fl-96/180 scroll-mt-[72px] border-t border-line px-gutter pt-[20px] | md:pt-[24px]",
        className,
      )}
    >
      <Reveal>{children}</Reveal>
    </section>
  );
}
