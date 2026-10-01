import { AskField } from "@/components/hero/AskField";
import { HeroActions } from "@/components/hero/HeroActions";
import { SplitHeading } from "@/components/motion/SplitHeading";
import type { Profile } from "@/lib/profiles";

// the em widths make the title break like the design: three lines on mobile, two from md
type Props = { hero: Profile["hero"]; questions: Profile["heroQuestions"] };

export function Hero({ hero, questions }: Props) {
  return (
    <section
      aria-labelledby="hero-title"
      data-hides-fab
      className="flex min-h-[calc(100svh-64px)] flex-col justify-end px-gutter pt-[40px] pb-[28px] | md:min-h-[calc(100svh-72px)] md:justify-center md:pb-[72px]"
    >
      <SplitHeading
        id="hero-title"
        text={hero.title}
        className="max-w-[5.6em] text-fl-54/120 leading-[0.9] font-semibold tracking-[-0.045em] | md:max-w-[7.6em]"
      />
      <p className="mt-fl-16/24 max-w-[560px] text-fl-17/24 leading-[1.35] tracking-[-0.01em] text-text-3">
        {hero.sub}
      </p>
      {/* on wide screens the field stops at its 1440 width instead of running across the whole page */}
      <AskField questions={questions} className="mt-fl-40/72 | 2xl:max-w-[1360px]" />
      <HeroActions className="mt-fl-24/36 | md:self-start" />
    </section>
  );
}
