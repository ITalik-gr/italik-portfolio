import { ImageFrame } from "@/components/ui/ImageFrame";
import { cn } from "@/lib/utils";
import type { LabItem } from "./LabList";

type Props = { items: LabItem[]; active: string | null };

// desktop only: previews slide in from the right inside their own column, never over the list.
// the sticky box spans the viewport under the header, so the preview sits in its vertical centre;
// all layers share one grid cell, so the stack is exactly one 16:10 frame + caption tall
export function LabPreview({ items, active }: Props) {
  return (
    <div aria-hidden className="hidden | lg:block">
      <div className="sticky top-[72px] flex h-[calc(100svh-72px)] items-center">
        <div className="grid w-full overflow-hidden">
          <div
            className={cn(
              "flex items-center justify-center bg-surface/50 font-mono text-[12px] tracking-[0.06em] text-faint uppercase transition-opacity duration-400 [grid-area:1/1]",
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
              <ImageFrame url={item.frameUrl} ratio="16/10" label={`${item.title} · preview`} />
              <div className="flex justify-between font-mono text-[12px] leading-[16px] tracking-[0.06em] text-text-3 uppercase">
                <span>{item.title}</span>
                {item.href && <span>Open →</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
