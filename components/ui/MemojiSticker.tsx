import Image from "next/image";
import { useId } from "react";
import { cn } from "@/lib/utils";

// href: where a click goes (mail in the footer, down to the footer elsewhere); label names it for screen readers
type Props = { href: string; label: string; className?: string };

const RING_TEXT = "Say hello · Say hello · Say hello · ";

// size comes from className (size-[120px] etc.); the ring and the face scale with it
export function MemojiSticker({ href, label, className }: Props) {
  // one sticker in About and one in Contact: each needs its own path id
  const ring = `memoji-ring-${useId().replace(/[^\w-]/g, "")}`;
  return (
    <a
      href={href}
      aria-label={label}
      className={cn(
        "group relative block size-[112px] shrink-0 rounded-full transition-transform duration-400 ease-out-expo hover:scale-[1.06] focus-visible:outline-accent",
        className,
      )}
    >
      {/* the spin lives on a div: a transform on the svg itself runs on the main thread, with layout every frame */}
      <div className="absolute inset-0 animate-spin-slow motion-reduce:animate-none">
        <svg viewBox="0 0 100 100" className="size-full">
          <defs>
            <path id={ring} d="M50,50 m-43,0 a43,43 0 1,1 86,0 a43,43 0 1,1 -86,0" />
          </defs>
          <text className="fill-text text-[7.6px] font-medium transition-colors duration-150 group-hover:fill-accent">
            <textPath href={`#${ring}`} textLength="269" lengthAdjust="spacing">
              {RING_TEXT}
            </textPath>
          </text>
        </svg>
      </div>
      {/* the face sits inside the rotating ring, on the page background */}
      <Image
        src="/memoji.webp"
        alt=""
        width={512}
        height={512}
        sizes="150px"
        className="absolute inset-[14%] size-[72%] max-w-none"
      />
    </a>
  );
}
