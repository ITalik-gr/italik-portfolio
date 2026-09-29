import Image from "next/image";
import { cn } from "@/lib/utils";

type Props = { className?: string };

const RING_TEXT = "SAY HELLO · SAY HELLO · SAY HELLO · ";

// size comes from className (size-[120px] etc.); the ring and the face scale with it
export function MemojiSticker({ className }: Props) {
  return (
    <div aria-hidden className={cn("relative size-[112px] shrink-0", className)}>
      <svg viewBox="0 0 100 100" className="absolute inset-0 size-full animate-spin-slow">
        <defs>
          <path id="memoji-ring" d="M50,50 m-43,0 a43,43 0 1,1 86,0 a43,43 0 1,1 -86,0" />
        </defs>
        <text className="fill-text font-mono text-[7.3px]">
          <textPath href="#memoji-ring" textLength="269" lengthAdjust="spacing">
            {RING_TEXT}
          </textPath>
        </text>
      </svg>
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
