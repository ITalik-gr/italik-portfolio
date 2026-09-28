import type { Project } from "@/lib/schemas";

type Props = { highlights: NonNullable<Project["highlights"]> };

export function CaseHighlights({ highlights }: Props) {
  return (
    <ul className="grid gap-[28px] | md:grid-cols-2 md:gap-[40px]">
      {highlights.map((item) => (
        <li key={item.title}>
          <h3 className="text-fl-22/30 leading-[1.15] font-normal tracking-[-0.02em]">
            {item.title}
          </h3>
          <p className="mt-[11px] text-fl-16/18 leading-[1.55] text-text-3">{item.text}</p>
        </li>
      ))}
    </ul>
  );
}
