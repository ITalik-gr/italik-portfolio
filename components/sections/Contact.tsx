import Link from "next/link";
import { Fragment } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { ContactLinks } from "@/components/layout/ContactLinks";
import { KyivOffset, KyivTime } from "@/components/layout/KyivTime";
import { MemojiSticker } from "@/components/ui/MemojiSticker";
import { TextLink } from "@/components/ui/TextLink";
import { FOOTER, HIRING, SITE, type Audience } from "@/lib/site";

// employers get the status line and a way to /services; clients already have Services in the nav and the CTA
export function Contact({ audience }: { audience: Audience }) {
  const forClients = audience === "client";
  return (
    <footer
      id="contact"
      aria-labelledby="contact-title"
      className="mt-fl-96/180 border-t border-line px-gutter pt-[18px] pb-[32px] | md:pt-[24px]"
    >
      <Reveal>
        {!forClients && (
          <div className="flex flex-col gap-[28px] | md:flex-row md:items-center md:justify-between md:gap-[24px]">
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
            <TextLink href="/services" className="w-fit">
              Have a project? See services
            </TextLink>
          </div>
        )}

        <div className={forClients ? "relative" : "relative mt-[28px] | md:mt-[40px]"}>
          <MemojiSticker
            href={`mailto:${SITE.email}`}
            label={`Email ${SITE.email}`}
            className="size-[120px] | md:absolute md:top-0 md:right-0 md:size-fl-100/150 | lg:right-[20px]"
          />
          <h2
            id="contact-title"
            className="mt-[8px] text-fl-88/288 leading-[0.82] whitespace-nowrap font-semibold tracking-[-0.05em] | md:mt-0"
          >
            <a
              href={`mailto:${SITE.email}`}
              className="transition-colors duration-150 hover:text-accent"
            >
              Say hello
            </a>
          </h2>
        </div>

        <div className="mt-[72px] flex flex-col gap-[12px] | md:mt-[96px] md:flex-row md:items-center md:justify-between md:gap-[24px]">
          <ContactLinks variant="rows" className="md:hidden" />
          <ContactLinks variant="inline" className="hidden | md:flex" />
          <p className="font-mono text-[12px] leading-[16px] text-text-3 | md:text-[14px] md:leading-[18px]">
            Kyiv · <KyivTime /> · <KyivOffset />
          </p>
        </div>

        <div className="mt-[56px] flex flex-col gap-[8px] font-mono text-[11px] leading-[14px] tracking-[0.04em] text-muted | md:flex-row md:justify-between">
          <span>{FOOTER.credit}</span>
          {forClients && (
            <Link href={HIRING.href} className="transition-colors duration-150 hover:text-accent">
              {HIRING.label} →
            </Link>
          )}
          <span>
            {FOOTER.copyright} ·{" "}
            <Link href="/privacy" className="transition-colors duration-150 hover:text-accent">
              Privacy
            </Link>
          </span>
        </div>
      </Reveal>
    </footer>
  );
}
