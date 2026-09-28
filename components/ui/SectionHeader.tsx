import type { ReactNode } from "react";

type Props = {
  id: string;
  number: string;
  label: string;
  meta?: ReactNode;
  title?: ReactNode;
  className?: string;
};

// id goes on the h2 so the section can point aria-labelledby at it
export function SectionHeader({ id, number, label, meta, title, className }: Props) {
  return (
    <header className={className}>
      <div className="flex items-center justify-between gap-[16px] font-mono text-[12px] leading-[16px] tracking-[0.08em] text-muted uppercase | md:text-[13px] md:leading-[17px]">
        <span className="flex shrink-0 gap-[14px]">
          <span className="text-accent">{number}</span>
          <span className="text-text">{label}</span>
        </span>
        {meta && <span className="hidden text-right | md:inline">{meta}</span>}
      </div>
      {title && (
        <h2
          id={id}
          className="mt-fl-24/40 font-display text-fl-56/144 leading-[0.85] font-bold tracking-[-0.055em] font-stretch-[88%]"
        >
          {title}
        </h2>
      )}
    </header>
  );
}
