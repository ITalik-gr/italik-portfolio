import { Reveal } from "@/components/motion/Reveal";
import type { Post } from "@/lib/schemas";
import { cn } from "@/lib/utils";
import { BREAKOUT } from "../Markdown";

// the article's headline numbers, wider than the text column; one of two places the accent marks a number
export function KeyNumbers({ keys }: { keys: Post["keys"] }) {
  if (keys.length === 0) return null;
  return (
    <Reveal
      className={cn(
        // values differ a lot in length ("~97%" vs "98.9% → 72%"), so each takes its natural width
        "mt-fl-32/56 flex flex-col gap-[20px] border-y border-line py-fl-24/32 | md:flex-row md:flex-wrap md:justify-between md:gap-x-[40px] md:gap-y-[24px] md:px-[24px]",
        BREAKOUT,
      )}
    >
      {keys.map((key) => (
        <div key={key.caption} className="flex min-w-0 flex-col gap-[12px]">
          <span className="text-fl-34/56 leading-none font-semibold tracking-[-0.045em] whitespace-nowrap text-accent">
            {key.value}
          </span>
          <span className="font-mono text-[12px] leading-[1.5] tracking-[0.06em] text-text-3 uppercase">
            {key.caption}
          </span>
        </div>
      ))}
    </Reveal>
  );
}
