type Props = { items: readonly string[] };

// one half must be wider than any screen (4K included), or the loop shows a gap
const COPIES_PER_HALF = 6;
// the reference moves one copy of the stack in ~45s
const SECONDS_PER_COPY = 45;

export function Marquee({ items }: Props) {
  const half = items
    .map((item) => `${item} · `)
    .join("")
    .repeat(COPIES_PER_HALF);

  return (
    <div className="group overflow-hidden py-[10px] font-mono text-[11px] leading-[14px] tracking-[0.08em] text-muted uppercase">
      <p className="sr-only">{items.join(", ")}</p>
      <div
        aria-hidden
        style={{ animationDuration: `${COPIES_PER_HALF * SECONDS_PER_COPY}s` }}
        className="flex w-max animate-marquee group-hover:[animation-play-state:paused]"
      >
        {/* both halves are identical and have no trailing padding, so -50% is seamless */}
        <span className="whitespace-pre">{half}</span>
        <span className="whitespace-pre">{half}</span>
      </div>
    </div>
  );
}
