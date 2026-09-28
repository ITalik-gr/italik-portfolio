import type { ProjectStatus } from "@/lib/schemas";
import { cn } from "@/lib/utils";

type Props = {
  status: ProjectStatus;
  note?: string;
  size?: "label" | "meta";
  // neutral: grey text, only the dot carries the status colour (Lab rows)
  tone?: "default" | "neutral";
  className?: string;
};

const LABELS: Record<ProjectStatus, string> = {
  live: "Live",
  building: "Building",
  "v2-in-progress": "v2 in progress",
  "next-up": "Next up",
  nda: "NDA",
  offline: "Offline",
  archived: "Archived",
};

const TONES: Record<ProjectStatus, { text: string; dot: string }> = {
  live: { text: "text-accent", dot: "bg-accent" },
  building: { text: "text-accent", dot: "bg-accent" },
  "v2-in-progress": { text: "text-text-2", dot: "bg-text-2" },
  "next-up": { text: "text-muted", dot: "bg-muted" },
  nda: { text: "text-text-3", dot: "" },
  offline: { text: "text-muted", dot: "bg-muted" },
  archived: { text: "text-muted", dot: "bg-muted" },
};

// "label" is the uppercase card kicker, "meta" is the value inside a MetaTable
export function Status({
  status,
  note,
  size = "label",
  tone: toneMode = "default",
  className,
}: Props) {
  const tone =
    toneMode === "neutral"
      ? {
          text: "text-text-2",
          dot: TONES[status].text === "text-accent" ? "bg-accent" : "bg-muted",
        }
      : TONES[status];
  const label = note ? `${LABELS[status]} · ${note}` : LABELS[status];

  if (status === "nda") {
    return (
      <span
        className={cn(
          "inline-flex border border-line-strong px-[6px] py-[2px] font-mono text-[12px] leading-[16px] tracking-[0.06em] text-text-3 uppercase",
          className,
        )}
      >
        {label}
      </span>
    );
  }

  return (
    <span
      className={cn(
        "inline-flex items-center font-mono",
        size === "label"
          ? cn("gap-[8px] text-[12px] leading-[16px] tracking-[0.06em] uppercase", tone.text)
          : "gap-[10px] text-[14px] leading-[24px] text-text",
        className,
      )}
    >
      <span aria-hidden className={cn("size-[7px] shrink-0 rounded-full", tone.dot)} />
      {label}
    </span>
  );
}
