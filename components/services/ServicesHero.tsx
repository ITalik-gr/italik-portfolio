import { AskChatButton } from "@/components/chat/AskChatButton";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { Button } from "@/components/ui/Button";
import { SERVICES_PAGE } from "@/lib/services";
import { SITE } from "@/lib/site";

export const projectMailto = `mailto:${SITE.email}?subject=${encodeURIComponent(SERVICES_PAGE.mailSubject)}`;

export function ServicesHero() {
  return (
    <section
      aria-labelledby="hero-title"
      data-hides-fab
      className="flex min-h-[calc(100svh-64px)] flex-col justify-end px-gutter pt-[40px] pb-[28px] | md:min-h-[calc(100svh-72px)] md:pb-[64px]"
    >
      <p className="text-[14px] leading-[20px] text-accent | md:text-[15px] md:leading-[21px]">
        Services
      </p>
      <SplitHeading
        id="hero-title"
        text={SERVICES_PAGE.title}
        className="mt-fl-16/24 max-w-[11em] text-fl-48/128 leading-[0.9] font-semibold tracking-[-0.045em]"
      />
      <div className="mt-fl-24/56 flex flex-col gap-[28px] | lg:flex-row lg:items-end lg:justify-between lg:gap-[40px]">
        <p className="max-w-[600px] text-fl-17/24 leading-[1.35] tracking-[-0.01em] text-text-3">
          {SERVICES_PAGE.sub}
        </p>
        <div className="grid grid-cols-[1fr_auto] gap-[8px] | md:flex md:gap-[10px] | lg:shrink-0">
          <Button href={projectMailto} size="lg" arrow="→" className="col-span-2 justify-center">
            {SERVICES_PAGE.cta}
          </Button>
          <AskChatButton className="col-span-2 justify-center border-text">
            Ask my AI about me
          </AskChatButton>
        </div>
      </div>
    </section>
  );
}
