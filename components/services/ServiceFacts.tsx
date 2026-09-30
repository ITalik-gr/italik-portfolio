import { CountUp } from "@/components/motion/CountUp";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SERVICE_FACTS } from "@/lib/services";

export function ServiceFacts() {
  return (
    <Section id="why" labelledBy="why-title">
      <SectionHeader id="why-title" title="Why me" />
      {/* labels reserve two lines, so the numbers share one line and the blocks end together */}
      <dl className="mt-fl-40/72 grid grid-cols-2 gap-x-[20px] gap-y-[32px] | lg:grid-cols-4 lg:gap-x-[24px]">
        {SERVICE_FACTS.map((fact) => (
          <div key={fact.label} className="flex flex-col-reverse gap-[10px] border-t border-line pt-[16px]">
            <dt className="min-h-[40px] max-w-[220px] text-[14px] leading-[20px] text-text-3 | md:min-h-[44px] md:text-[16px] md:leading-[22px]">
              {fact.label}
            </dt>
            <dd className="text-fl-48/96 leading-[0.9] font-semibold tracking-[-0.045em]">
              <CountUp value={fact.value} />
            </dd>
          </div>
        ))}
      </dl>
    </Section>
  );
}
