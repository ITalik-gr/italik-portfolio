import { cn } from "@/lib/utils";

type Props = { label: string; className?: string };

// phone-screen crop (top of the 9:19.5 mobile screenshot) for small list thumbnails
// TODO: render coverMobile with next/image once screenshots exist
export function ProjectThumb({ label, className }: Props) {
  return (
    <div
      aria-hidden
      className={cn(
        "flex aspect-[3/4] items-center justify-center overflow-hidden border border-line bg-surface p-[8px] text-center font-mono text-[10px] leading-[13px] text-faint",
        className,
      )}
    >
      {label}
    </div>
  );
}
