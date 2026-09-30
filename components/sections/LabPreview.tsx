import { ProjectMorph } from "@/components/motion/ProjectMorph";
import { CoverImage } from "@/components/ui/CoverImage";
import { ImageFrame } from "@/components/ui/ImageFrame";
import { cn } from "@/lib/utils";
import type { LabItem } from "./LabList";

type Props = { items: LabItem[]; active: string | null };

// desktop only: previews slide in from the right inside their own column, never over the list.
// all layers share one grid cell, so the stack is exactly one 16:10 frame + caption tall
// sticks near the viewport centre: half the viewport minus half the preview
// (45% column, 16:10 frame, 66px of browser bar + caption), never above 112px
const STICKY_TOP = "max(112px, calc(50svh - ((100vw - 120px) * 0.45 * 0.625 + 66px) / 2))";

export function LabPreview({ items, active }: Props) {
  return (
    <div aria-hidden className="hidden | lg:block">
      <div style={{ top: STICKY_TOP }} className="sticky grid overflow-hidden">
        <div
          className={cn(
            "flex items-center justify-center bg-surface/50 text-[14px] text-muted transition-opacity duration-400 [grid-area:1/1]",
            active && "opacity-0",
          )}
        >
          Hover a project
        </div>
        {items.map((item) => (
          <div
            key={item.slug}
            data-lab-preview={item.slug}
            className={cn(
              "flex flex-col gap-[16px] bg-bg transition-[translate,opacity] duration-600 ease-out-expo [grid-area:1/1] motion-reduce:transition-none",
              active === item.slug ? "translate-x-0 opacity-100" : "translate-x-[104%] opacity-0",
            )}
          >
            <ProjectMorph slug={item.slug} part="cover" source="lab" primary={item.shareTitle}>
              <ImageFrame url={item.frameUrl} ratio="16/10" label={`${item.title} · preview`}>
                {item.cover ? (
                  <CoverImage src={item.cover} alt="" sizes="45vw" />
                ) : undefined}
              </ImageFrame>
            </ProjectMorph>
            <div className="flex justify-between text-[14px] leading-[20px] text-text-3">
              <span>{item.title}</span>
              {item.href && <span>Open →</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
