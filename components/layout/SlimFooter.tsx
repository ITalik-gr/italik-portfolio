import { SITE } from "@/lib/site";
import { KyivTime } from "./KyivTime";

export function SlimFooter() {
  return (
    <footer className="flex flex-wrap items-center justify-between gap-x-[24px] gap-y-[8px] border-t border-line px-gutter py-[24px] font-mono text-[12px] leading-[16px] text-text-3 | md:text-[13px] md:leading-[17px]">
      <a href={`mailto:${SITE.email}`} className="transition-colors duration-150 hover:text-accent">
        {SITE.email}
      </a>
      <p>
        Kyiv · <KyivTime /> · {SITE.location.utc}
      </p>
    </footer>
  );
}
