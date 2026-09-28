import { Fragment } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { ContactLinks } from "@/components/layout/ContactLinks";
import { KyivTime } from "@/components/layout/KyivTime";
import { MemojiSticker } from "@/components/ui/MemojiSticker";
import { FOOTER, SECTIONS, SITE } from "@/lib/site";

export function Contact() {
  const { number, label } = SECTIONS.contact;

  return (
    <footer
      id="contact"
      aria-labelledby="contact-title"
      className="mt-fl-96/180 border-t border-line px-gutter pt-[18px] pb-[32px] | md:pt-[24px]"
    >
      <Reveal>
        <div className="flex flex-col gap-[28px] | md:flex-row md:items-center md:justify-between md:gap-[24px]">
          <p className="flex gap-[12px] font-mono text-[12px] leading-[16px] tracking-[0.08em] text-text uppercase | md:gap-[14px] md:text-[13px] md:leading-[17px]">
            <span className="text-accent">{number}</span>
            <span>{label}</span>
          </p>
          <p className="flex items-center gap-[10px] text-fl-17/22 leading-[1.35] tracking-[-0.01em] text-text | md:gap-[12px]">
            <span
              aria-hidden
              className="size-[8px] shrink-0 rounded-full bg-accent | md:size-[9px]"
            />
            <span>
              {["Open to work", ...SITE.openTo].map((item, index) => (
                <Fragment key={item}>
                  {index > 0 && " · "}
                  <span className="whitespace-nowrap">{item}</span>
                </Fragment>
              ))}
            </span>
          </p>
        </div>

        <div className="relative mt-[28px] | md:mt-[40px]">
          <MemojiSticker className="size-[120px] | md:absolute md:top-0 md:right-0 md:size-fl-100/150 | lg:right-[20px]" />
          <h2
            id="contact-title"
            className="mt-[8px] text-fl-88/288 leading-[0.82] whitespace-nowrap font-bold tracking-[-0.06em] font-stretch-[88%] | md:mt-0"
          >
            <a
              href={`mailto:${SITE.email}`}
              className="transition-colors duration-150 hover:text-accent"
            >
              Say hello
            </a>
          </h2>
        </div>

        <div className="mt-[56px] flex flex-col gap-[12px] | md:mt-[72px] md:flex-row md:items-center md:justify-between md:gap-[24px]">
          <ContactLinks variant="rows" className="md:hidden" />
          <ContactLinks variant="inline" className="hidden | md:flex" />
          <p className="font-mono text-[12px] leading-[16px] text-text-3 | md:text-[14px] md:leading-[18px]">
            Kyiv · <KyivTime /> · {SITE.location.utc}
          </p>
        </div>

        <div className="mt-[56px] flex flex-col gap-[8px] font-mono text-[11px] leading-[14px] tracking-[0.04em] text-muted | md:flex-row md:justify-between">
          <span>{FOOTER.credit}</span>
          <span>{FOOTER.copyright}</span>
        </div>
      </Reveal>
    </footer>
  );
}
