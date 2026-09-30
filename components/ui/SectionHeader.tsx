import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Props = {
  id: string;
  meta?: ReactNode;
  title?: ReactNode;
  className?: string;
};

// the big title speaks for itself; meta sits at its bottom right (from md).
// id goes on the h2 so the section can point aria-labelledby at it
export function SectionHeader({ id, meta, title, className }: Props) {
  const note = meta && (
    <p className="hidden shrink-0 text-[15px] leading-[20px] text-muted | md:block">
      {meta}
    </p>
  );

  if (!title) return note ? <header className={cn("flex justify-end", className)}>{note}</header> : null;

  return (
    <header
      className={cn("mt-fl-24/40 flex items-end justify-between gap-[24px]", className)}
    >
      <h2
        id={id}
        className="font-display text-fl-56/144 leading-[0.85] font-semibold tracking-[-0.045em]"
      >
        {title}
      </h2>
      {note}
    </header>
  );
}
