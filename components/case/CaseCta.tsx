import { ForAudience } from "@/components/layout/ForAudience";
import { Reveal } from "@/components/motion/Reveal";
import { projectMailto } from "@/components/services/ServicesHero";
import { Button } from "@/components/ui/Button";
import { CASE_CTA } from "@/lib/services";
import { SITE } from "@/lib/site";

// a soft bridge to the client CTA; visitors who came from an employer page see the case as before
export function CaseCta() {
  return (
    <ForAudience audience="client">
      <aside
        id="case-cta"
        aria-labelledby="case-cta-title"
        className="mt-fl-96/160 border-t border-line px-gutter pt-[20px] | md:pt-[24px]"
      >
        <Reveal className="flex flex-col gap-[24px] | md:flex-row md:items-end md:justify-between">
          <div>
            <h2
              id="case-cta-title"
              className="text-fl-32/56 leading-[0.95] font-semibold tracking-[-0.035em]"
            >
              {CASE_CTA.title}
            </h2>
            <p className="mt-[12px] max-w-[520px] text-fl-16/18 leading-[1.5] text-text-3">
              {CASE_CTA.text}
            </p>
          </div>
          <div className="flex flex-wrap gap-[8px] | md:shrink-0 md:gap-[10px]">
            <Button href={SITE.socials.telegram} arrow="↗">
              Telegram
            </Button>
            <Button href={projectMailto} variant="ghost" arrow="→">
              Email
            </Button>
          </div>
        </Reveal>
      </aside>
    </ForAudience>
  );
}
