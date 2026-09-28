import { cn } from "@/lib/utils";

type Props = { className?: string };

const RING_TEXT = "SAY HELLO · SAY HELLO · SAY HELLO · ";

// size comes from className (size-[120px] etc.); the ring and the face scale with it
// TODO: swap the accent circle for the real Memoji image
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
      <div className="absolute inset-[21.5%] rounded-full bg-accent" />
    </div>
  );
}
