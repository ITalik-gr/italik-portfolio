import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Props = {
  children: ReactNode;
  variant?: "text" | "mono" | "source";
  active?: boolean;
  className?: string;
};

const VARIANTS = {
  text: "px-[12px] py-[8px] font-display text-[14px] leading-[17px]",
  mono: "px-[10px] py-[7px] font-mono text-[12px] leading-[16px]",
  source: "px-[8px] py-[4px] font-mono text-[11px] leading-[14px] text-text-3",
};

export function Chip({ children, variant = "text", active, className }: Props) {
  return (
    <span
      className={cn(
        "inline-flex border border-line-strong text-text",
        VARIANTS[variant],
        active && "border-accent text-accent",
        className,
      )}
    >
      {children}
    </span>
  );
}
