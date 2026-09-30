import Image from "next/image";
import { cn } from "@/lib/utils";

type Props = { className?: string };

const RING_TEXT = "Say hello · Say hello · Say hello · ";

// size comes from className (size-[120px] etc.); the ring and the face scale with it
export function MemojiSticker({ className }: Props) {
  return (
    <div aria-hidden className={cn("relative size-[112px] shrink-0", className)}>
      {/* the spin lives on a div: a transform on the svg itself runs on the main thread, with layout every frame */}
      <div className="absolute inset-0 animate-spin-slow motion-reduce:animate-none">
        <svg viewBox="0 0 100 100" className="size-full">
          <defs>
            <path id="memoji-ring" d="M50,50 m-43,0 a43,43 0 1,1 86,0 a43,43 0 1,1 -86,0" />
          </defs>
          <text className="fill-text text-[7.6px] font-medium">
            <textPath href="#memoji-ring" textLength="269" lengthAdjust="spacing">
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
    </div>
  );
}
