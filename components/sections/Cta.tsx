import { projectMailto } from "@/components/services/ServicesHero";
import { Button } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import { CTA } from "@/lib/services";
import { SITE } from "@/lib/site";

// client pages only, right above the contact footer: one ask, Telegram first
export function Cta() {
  return (
    <Section id="start" labelledBy="start-title">
      <h2
        id="start-title"
        className="mt-fl-24/40 font-display text-fl-56/144 leading-[0.85] font-semibold tracking-[-0.045em]"
      >
        {CTA.lines.map((line) => (
          <span key={line} className="md:block">
            {line}{" "}
          </span>
        ))}
      </h2>
      <div className="mt-fl-24/40 flex flex-col gap-[24px] | lg:flex-row lg:items-end lg:justify-between lg:gap-[40px]">
        <p className="max-w-[800px] text-fl-17/24 leading-[1.35] tracking-[-0.01em] text-text-3">
          {CTA.text}
        </p>
        <div className="grid gap-[8px] | md:flex md:gap-[10px] | lg:shrink-0">
          <Button href={SITE.socials.telegram} size="lg" arrow="↗" className="justify-center">
            Message on Telegram
          </Button>
          <Button href={projectMailto} variant="ghost" size="lg" arrow="→" className="justify-center">
            Email me
          </Button>
        </div>
      </div>
    </Section>
  );
}
