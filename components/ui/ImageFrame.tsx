import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Props = {
  url?: string;
  ratio?: "16/10" | "16/9" | "4/3";
  label?: string;
  children?: ReactNode;
  className?: string;
};

const RATIOS = {
  "16/10": "aspect-[16/10]",
  "16/9": "aspect-[16/9]",
  "4/3": "aspect-[4/3]",
};

// browser chrome around a screenshot; without children it renders the grey placeholder
export function ImageFrame({ url, ratio = "16/10", label, children, className }: Props) {
  return (
    <figure className={cn("border border-line bg-surface", className)}>
      <div className="flex h-[34px] items-center gap-[6px] border-b border-line px-[14px]">
        {[0, 1, 2].map((dot) => (
          <span key={dot} aria-hidden className="size-[9px] rounded-full bg-line" />
        ))}
        {url && (
          <span className="ml-[14px] truncate font-mono text-[11px] leading-[14px] text-muted">
            {url}
          </span>
        )}
      </div>
      <div className={cn("relative overflow-hidden", RATIOS[ratio])}>
        {children ?? (
          <div className="flex size-full items-center justify-center font-mono text-[12px] text-faint">
            {label ?? "Screenshot"}
          </div>
        )}
      </div>
    </figure>
  );
}
