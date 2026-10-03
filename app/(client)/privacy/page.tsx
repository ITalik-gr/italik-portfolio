import type { Metadata } from "next";
import { SlimFooter } from "@/components/layout/SlimFooter";
import { PRIVACY } from "@/lib/privacy";

const { title, description } = PRIVACY.meta;

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/privacy" },
  openGraph: { url: "/privacy", siteName: "italik.dev", type: "website", title, description },
};

const updated = new Date(PRIVACY.updated).toLocaleDateString("en-GB", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

export default function PrivacyPage() {
  return (
    <>
      <main id="main" className="px-gutter pt-fl-56/96 pb-fl-96/180">
        <p className="text-[14px] leading-[20px] text-accent | md:text-[15px] md:leading-[21px]">
          Updated <time dateTime={PRIVACY.updated}>{updated}</time>
        </p>
        <h1 className="mt-fl-16/24 text-fl-54/120 leading-[0.9] font-semibold tracking-[-0.045em]">
          Privacy
        </h1>
        <p className="mt-fl-24/40 max-w-[600px] text-fl-17/24 leading-[1.35] tracking-[-0.01em] text-text-3">
          {PRIVACY.sub}
        </p>

        <div className="mt-fl-56/96 border-t border-line">
          {PRIVACY.sections.map((section) => (
            <section
              key={section.title}
              className="grid gap-[12px] border-b border-line py-fl-20/28 | md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] md:gap-[40px]"
            >
              <h2 className="text-fl-20/28 leading-[1.2] font-semibold tracking-[-0.02em]">
                {section.title}
              </h2>
              <div className="flex max-w-[760px] flex-col gap-[12px] text-fl-16/18 leading-[1.5] text-text-3">
                {section.body.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
                {"link" in section && (
                  <a
                    href={section.link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-fit text-text transition-colors duration-150 hover:text-accent"
                  >
                    {section.link.label} ↗
                  </a>
                )}
              </div>
            </section>
          ))}
        </div>
      </main>
      <SlimFooter />
    </>
  );
}
