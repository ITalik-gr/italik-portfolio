import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Props = { label?: string; children?: ReactNode; className?: string };

// the one rounded shape on the site: a phone reads as a phone only with its corners
export function PhoneFrame({ label, children, className }: Props) {
  return (
    <figure className={cn("rounded-[28px] border border-line bg-surface p-[8px]", className)}>
      <div className="relative aspect-[9/19.5] overflow-hidden rounded-[20px] bg-surface-2">
        {children ?? (
          <div className="flex size-full items-center justify-center p-[8px] text-center font-mono text-[11px] text-muted | md:text-[12px]">
            {label ?? "Screenshot"}
          </div>
        )}
        <span
          aria-hidden
          className="absolute top-[8px] left-1/2 h-[14px] w-[65px] -translate-x-1/2 rounded-full bg-bg"
        />
      </div>
    </figure>
  );
}
