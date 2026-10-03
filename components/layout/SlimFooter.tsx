import Link from "next/link";
import { SITE } from "@/lib/site";
import { KyivOffset, KyivTime } from "./KyivTime";

export function SlimFooter() {
  return (
    <footer className="flex flex-wrap items-center justify-between gap-x-[24px] gap-y-[8px] border-t border-line px-gutter py-[24px] font-mono text-[12px] leading-[16px] text-text-3 | md:text-[13px] md:leading-[17px]">
      <a href={`mailto:${SITE.email}`} className="transition-colors duration-150 hover:text-accent">
        {SITE.email}
      </a>
      <a
        href={SITE.socials.x}
        target="_blank"
        rel="noopener noreferrer"
        className="transition-colors duration-150 hover:text-accent"
      >
        X ↗
      </a>
      <Link href="/services" className="transition-colors duration-150 hover:text-accent">
        Services →
      </Link>
      <Link href="/privacy" className="transition-colors duration-150 hover:text-accent">
        Privacy
      </Link>
      <p>
        Kyiv · <KyivTime /> · <KyivOffset />
      </p>
    </footer>
  );
}
