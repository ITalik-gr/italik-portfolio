import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SERVICE_FAQ } from "@/lib/services";

// native <details>: works without JS and keeps every answer in the HTML for search engines
export function ServiceFaq() {
  return (
    <Section id="faq" labelledBy="faq-title">
      <SectionHeader id="faq-title" title="FAQ" />
      <div className="mt-fl-40/72 border-t border-line">
        {SERVICE_FAQ.map((item) => (
          <details key={item.q} className="faq-item group border-b border-line">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-[24px] py-fl-20/28 text-fl-20/28 leading-[1.2] font-semibold tracking-[-0.02em] transition-colors hover:text-accent [&::-webkit-details-marker]:hidden">
              {item.q}
              <span
                aria-hidden
                className="shrink-0 text-[24px] leading-none font-normal text-muted transition-transform duration-300 ease-out-expo group-open:rotate-45"
              >
                +
              </span>
            </summary>
            <p className="max-w-[760px] pb-fl-20/28 text-fl-16/18 leading-[1.5] text-text-3">
              {item.a}
            </p>
          </details>
        ))}
      </div>
    </Section>
  );
}
