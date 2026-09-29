import { cn } from "@/lib/utils";
import { CoverImage } from "./CoverImage";

type Props = { label: string; src?: string; sizes?: string; className?: string; innerClassName?: string };

// the project's desktop screenshot, always 16:10 so one image fits every list and card
export function ProjectCover({ label, src, sizes = "100vw", className, innerClassName }: Props) {
  return (
    <div className={cn("relative aspect-[16/10] overflow-hidden bg-surface", className)}>
      {src ? (
        <div className={cn("absolute inset-0", innerClassName)}>
          <CoverImage src={src} alt={`${label}: screenshot`} sizes={sizes} />
        </div>
      ) : (
      <div
        className={cn(
          "flex size-full items-center justify-center p-[8px] text-center font-mono text-[11px] text-muted | md:text-[12px]",
          innerClassName,
        )}
      >
        {label} · screenshot
      </div>
      )}
    </div>
  );
}
