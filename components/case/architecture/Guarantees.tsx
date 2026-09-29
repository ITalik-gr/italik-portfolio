import { Reveal } from "@/components/motion/Reveal";
import type { MapArchitecture } from "@/lib/schemas-architecture";

type Guarantee = MapArchitecture["guarantees"][number];

export function Guarantees({ guarantees }: { guarantees: Guarantee[] }) {
  return (
    <Reveal as="ul" className="grid border-t border-line | md:grid-cols-2 | xl:grid-cols-4">
      {guarantees.map((item) => (
        <li
          key={item.title}
          className="flex flex-col gap-[12px] border-b border-line py-[20px] | md:px-[24px] md:py-[32px] md:odd:border-r | xl:odd:border-r-0 xl:not-last:border-r"
        >
          <p className="text-fl-22/28 leading-[1.15] font-bold tracking-[-0.02em]">
            <Title title={item.title} accent={item.accent} />
          </p>
          <p className="font-mono text-[12px] leading-[16px] tracking-[0.08em] text-muted uppercase">
            {item.caption}
          </p>
        </li>
      ))}
    </Reveal>
  );
}

// the accent part must appear verbatim in the title; otherwise the title renders plain
function Title({ title, accent }: { title: string; accent?: string }) {
  const at = accent ? title.indexOf(accent) : -1;
  if (!accent || at === -1) return title;
  return (
    <>
      {title.slice(0, at)}
      <span className="text-accent">{accent}</span>
      {title.slice(at + accent.length)}
    </>
  );
}
