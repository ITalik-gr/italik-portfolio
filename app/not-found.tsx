import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { SlimFooter } from "@/components/layout/SlimFooter";
import { Button } from "@/components/ui/Button";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: `Page not found · ${SITE.name}`,
  robots: { index: false },
};

// lives outside the route groups, so it brings its own header and footer
export default function NotFound() {
  return (
    <>
      <Header variant="case" />
      <main
        id="main"
        className="flex min-h-[calc(100dvh-160px)] flex-col justify-center px-gutter py-fl-56/96"
      >
        <p className="font-mono text-[11px] leading-[14px] tracking-[0.06em] uppercase | md:text-[13px] md:leading-[17px] md:tracking-[0.08em]">
          <span className="text-accent">404</span>
          <span className="ml-[10px] text-text | md:ml-[14px]">Page not found</span>
        </p>
        <h1 className="mt-fl-22/36 text-fl-92/274 leading-[0.82] font-bold tracking-[-0.06em] font-stretch-[88%] | md:text-fl-68/274">
          Nothing
          <br />
          here
        </h1>
        <p className="mt-fl-24/40 max-w-[520px] text-fl-16/17 leading-[1.5] text-text-3">
          The link is broken or the page has moved. The work, the case studies and the AI chat are
          all on the home page.
        </p>
        <div className="mt-fl-32/40 flex flex-wrap gap-[12px]">
          <Button href="/" size="lg" arrow="→">
            Back to home
          </Button>
          <Button href="/#ask" variant="ghost" size="lg" dot>
            Ask my AI
          </Button>
        </div>
      </main>
      <SlimFooter />
    </>
  );
}
