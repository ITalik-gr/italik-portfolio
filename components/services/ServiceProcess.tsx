import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SERVICE_FORMATS, SERVICE_STEPS, SERVICE_TERMS } from "@/lib/services";

export function ServiceProcess() {
  return (
    <Section id="process" labelledBy="process-title">
      <SectionHeader id="process-title" title="How we work" />
      <ol className="mt-fl-40/72 grid gap-[28px] | md:grid-cols-2 | lg:grid-cols-4 lg:gap-[24px]">
        {SERVICE_STEPS.map((step, index) => (
          <li key={step.title} className="flex flex-col gap-[12px] border-t border-line pt-[16px]">
            <span className="font-mono text-[13px] leading-[18px] text-muted">{index + 1}</span>
            <h3 className="text-fl-22/28 leading-[1.1] font-semibold tracking-[-0.02em]">
              {step.title}
            </h3>
            <p className="text-fl-16/17 leading-[1.5] text-text-3">{step.text}</p>
          </li>
        ))}
      </ol>

      <div className="mt-fl-56/96 grid gap-[40px] | lg:grid-cols-[5fr_7fr]">
        <div>
          <h3 className="text-[14px] leading-[20px] text-muted | md:text-[15px]">Formats</h3>
          <ul className="mt-[16px] flex flex-col gap-[8px] text-fl-22/32 leading-[1.15] font-semibold tracking-[-0.02em]">
            {SERVICE_FORMATS.map((format) => (
              <li key={format}>{format}</li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-[14px] leading-[20px] text-muted | md:text-[15px]">Terms</h3>
          <ul className="mt-[16px] flex flex-col">
            {SERVICE_TERMS.map((term) => (
              <li
                key={term}
                className="border-b border-line py-[12px] text-fl-16/18 leading-[1.45] text-text-2 first:pt-0"
              >
                {term}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}
