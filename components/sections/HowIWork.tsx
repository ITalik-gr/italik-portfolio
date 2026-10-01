import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { HOW_I_WORK } from "@/lib/services";

// every claim ends on one line of proof from a case
export function HowIWork() {
  return (
    <Section id="how" labelledBy="how-title">
      <SectionHeader id="how-title" title="How I work" />
      <ol className="mt-fl-40/72 grid gap-x-[24px] | md:grid-cols-2">
        {HOW_I_WORK.map((item, index) => (
          <li
            key={item.title}
            className="flex flex-col gap-[12px] border-t border-line py-fl-24/40 | md:pr-[24px]"
          >
            <span className="font-mono text-[13px] leading-[18px] text-muted">{index + 1}</span>
            <h3 className="text-fl-24/40 leading-[1.05] font-semibold tracking-[-0.03em]">
              {item.title}
            </h3>
            <p className="max-w-[520px] text-fl-16/18 leading-[1.5] text-text-2">{item.text}</p>
            <p className="mt-auto max-w-[520px] pt-[8px] font-mono text-[12px] leading-[1.6] text-accent | md:text-[13px]">
              {item.proof}
            </p>
          </li>
        ))}
      </ol>
    </Section>
  );
}
