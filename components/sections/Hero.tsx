import { HeroBrain } from "@/components/hero/HeroBrain";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { Button } from "@/components/ui/Button";
import { HERO, SITE } from "@/lib/site";

export function Hero() {
  return (
    <section
      aria-labelledby="hero-title"
      data-hides-fab
      className="relative flex min-h-[calc(100svh-64px)] flex-col overflow-hidden px-gutter pt-[56px] pb-[28px] | md:min-h-0 md:pt-[72px] md:pb-[64px]"
    >
      <div aria-hidden className="absolute inset-0 opacity-80 | md:opacity-100">
        <HeroBrain />
      </div>

      <SplitHeading
        id="hero-title"
        lines={HERO.lines}
        className="relative z-[1] text-fl-86/224 leading-[0.85] font-bold tracking-[-0.055em] font-stretch-[88%] | md:font-[680]"
      />

      <div
        data-brain-floor
        className="relative z-[1] mt-auto flex flex-col gap-[24px] pt-[40px] | md:mt-[64px] md:pt-0 | lg:flex-row lg:items-end lg:justify-between lg:gap-[40px]"
      >
        <p className="max-w-[640px] text-fl-21/26 leading-[1.3] tracking-[-0.015em] text-text">
          {HERO.sub}
        </p>
        <div className="flex flex-col gap-[8px] | md:flex-row md:gap-[10px]">
          <Button
            href="#work"
            size="lg"
            arrow="↓"
            className="h-[52px] justify-center py-0 | md:h-auto md:py-[16px]"
          >
            View work
          </Button>
          <Button
            href="#ask"
            variant="ghost"
            size="lg"
            dot
            className="h-[52px] justify-center border-text py-0 | md:h-auto md:py-[15px]"
          >
            Ask my AI about me
          </Button>
          <Button
            href={SITE.cv}
            variant="ghost"
            size="lg"
            arrow="↓"
            external={false}
            className="hidden | md:inline-flex"
          >
            CV
          </Button>
        </div>
      </div>
    </section>
  );
}
