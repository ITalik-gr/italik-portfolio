import { cn } from "@/lib/utils";

type Props = { label: string; className?: string; innerClassName?: string };

// the project's desktop screenshot, always 16:10 so one image fits every list and card
// TODO: render project.cover with next/image once screenshots exist
export function ProjectCover({ label, className, innerClassName }: Props) {
  return (
    <div className={cn("relative aspect-[16/10] overflow-hidden bg-surface", className)}>
      <div
        className={cn(
          "flex size-full items-center justify-center p-[8px] text-center font-mono text-[11px] text-muted | md:text-[12px]",
          innerClassName,
        )}
      >
        {label} · screenshot
      </div>
    </div>
  );
}
