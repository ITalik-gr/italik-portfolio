import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { NAV, SITE } from "@/lib/site";
import { KyivTime } from "./KyivTime";
import { MobileMenu } from "./MobileMenu";
import { Monogram } from "./Monogram";

export function Header() {
  return (
    <header className="sticky top-0 z-40 bg-bg">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-[12px] focus:left-[20px] focus:z-50 focus:bg-accent focus:px-[12px] focus:py-[8px] focus:font-mono focus:text-[12px] focus:text-accent-ink"
      >
        Skip to content
      </a>
      <div className="flex h-[64px] items-center justify-between gap-[24px] px-gutter | md:grid md:h-[72px] md:grid-cols-[1fr_auto_1fr]">
        <Monogram />

        <nav aria-label="Main" className="hidden | md:block">
          <ul className="flex gap-[32px]">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-[16px] leading-[20px] font-medium text-text transition-colors duration-150 hover:text-accent"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center justify-end gap-[8px] | md:gap-[24px]">
          <div className="hidden items-center gap-[24px] font-mono text-[12px] leading-[16px] tracking-[0.06em] text-muted uppercase | lg:flex">
            <span>
              Kyiv <KyivTime />
            </span>
            <span>Open to work</span>
          </div>
          <Button
            href={SITE.cv}
            size="sm"
            arrow="↓"
            external={false}
            className="h-[44px] px-[14px] py-0 | md:h-auto md:px-[16px] md:py-[11px]"
          >
            CV
          </Button>
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
