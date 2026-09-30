import { STATUS_LABELS } from "@/lib/format";
import type { ProjectStatus } from "@/lib/schemas";
import { cn } from "@/lib/utils";

type Props = {
  status: ProjectStatus;
  note?: string;
  className?: string;
};

// only a live project gets the accent; every other status is plain grey text
export function Status({ status, note, className }: Props) {
  const label = note ? `${STATUS_LABELS[status]} · ${note}` : STATUS_LABELS[status];

  if (status === "nda") {
    return (
      <span className={cn("inline-flex border border-line-strong px-[6px] text-text-3", className)}>
        {label}
      </span>
    );
  }

  return (
    <span className={cn(status === "live" ? "text-accent" : "text-text-3", className)}>
      {label}
    </span>
  );
}
