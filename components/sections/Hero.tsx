import { AskField } from "@/components/hero/AskField";
import { HeroActions } from "@/components/hero/HeroActions";
import { TrailDrift } from "@/components/hero/TrailDrift";
import { TrailLayer } from "@/components/hero/TrailLayer";
import { SplitHeading } from "@/components/motion/SplitHeading";
import type { Profile } from "@/lib/profiles";
import { HERO_QUESTIONS, HERO_VARIANT, type HeroVariant } from "@/lib/site";
import { cn } from "@/lib/utils";

type Props = { hero: Profile["hero"] };

// the em widths make the title break like the design: "I build AI / agents that / ship" on mobile, two lines from md
const TITLE =
  "relative z-[1] max-w-[5.6em] leading-[0.9] font-semibold tracking-[-0.045em] | md:max-w-[7.6em]";
const SUB =
  "relative z-[1] max-w-[560px] text-fl-17/24 leading-[1.35] tracking-[-0.01em] text-text-3";
const SECTION =
  "relative flex min-h-[calc(100svh-64px)] flex-col px-gutter pt-[40px] pb-[28px] | md:min-h-[calc(100svh-72px)]";

export function Hero({ hero, variant = HERO_VARIANT }: Props & { variant?: HeroVariant }) {
  return variant === "ask" ? <AskHero hero={hero} /> : <TrailHero hero={hero} />;
}

function TrailHero({ hero }: Props) {
  return (
    <section
      aria-labelledby="hero-title"
      data-hides-fab
      className={cn(SECTION, "justify-end overflow-hidden | md:pb-[56px]")}
    >
      <TrailDrift />
      <TrailLayer />
      <SplitHeading id="hero-title" text={hero.title} className={cn(TITLE, "text-fl-66/190")} />
      <div className="relative z-[1] mt-fl-24/56 flex flex-col gap-[28px] | lg:flex-row lg:items-end lg:justify-between lg:gap-[40px]">
        <p className={SUB}>{hero.sub}</p>
        <HeroActions className="relative z-[1] | lg:shrink-0" />
      </div>
    </section>
  );
}

function AskHero({ hero }: Props) {
  return (
    <section
      aria-labelledby="hero-title"
      data-hides-fab
      className={cn(SECTION, "justify-end | md:justify-center md:pb-[72px]")}
    >
      <SplitHeading id="hero-title" text={hero.title} className={cn(TITLE, "text-fl-54/120")} />
      <p className={cn(SUB, "mt-fl-16/24")}>{hero.sub}</p>
      <AskField questions={HERO_QUESTIONS} className="mt-fl-40/72" />
      <HeroActions className="mt-fl-24/36 | md:self-start" />
    </section>
  );
}
