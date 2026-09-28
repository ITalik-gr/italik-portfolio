import { MemojiSticker } from "@/components/ui/MemojiSticker";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ABOUT, SECTIONS } from "@/lib/site";
import { cn } from "@/lib/utils";

export function About() {
  const { number, label, title, meta } = SECTIONS.about;
  const last = ABOUT.length - 1;

  return (
    <Section id="about" labelledBy="about-title">
      <SectionHeader id="about-title" number={number} label={label} meta={meta} title={title} />
      <div className="mt-fl-32/56 grid items-start gap-[56px] | md:grid-cols-[220px_1fr] md:gap-fl-64/72 | lg:grid-cols-[280px_1fr]">
        {/* the photo stays small on purpose: the words matter more than the face */}
        <div className="relative w-fl-200/280 max-w-full | md:w-full">
          {/* TODO: real photo via next/image, monochrome */}
          <div className="flex aspect-[4/5] items-center justify-center bg-surface font-mono text-[12px] text-muted grayscale">
            Photo
          </div>
          {/* hangs off the bottom-right corner by ~43% / 37% of its own size, as in the design */}
          <MemojiSticker className="absolute right-0 bottom-0 size-fl-100/130 translate-x-[43%] translate-y-[37%]" />
        </div>

        <div className="flex max-w-[780px] flex-col gap-fl-20/24">
          {ABOUT.map((paragraph, index) => (
            <p
              key={paragraph.slice(0, 24)}
              className={cn(
                index === 0
                  ? "text-fl-21/26 leading-[1.38] tracking-[-0.012em] text-text"
                  : "text-fl-17/20 leading-[1.55] text-text-3",
                index === last && "text-text",
              )}
            >
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </Section>
  );
}
