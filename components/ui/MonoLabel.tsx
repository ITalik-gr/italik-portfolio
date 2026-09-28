import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Props = {
  children: ReactNode;
  size?: 12 | 13;
  className?: string;
};

export function MonoLabel({ children, size = 12, className }: Props) {
  return (
    <span
      className={cn(
        "font-mono text-muted uppercase",
        size === 12
          ? "text-[12px] leading-[16px] tracking-[0.06em]"
          : "text-[13px] leading-[17px] tracking-[0.08em]",
        className,
      )}
    >
      {children}
    </span>
  );
}
