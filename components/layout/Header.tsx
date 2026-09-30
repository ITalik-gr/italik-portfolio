import Link from "next/link";
import { NAV } from "@/lib/site";
import { CvButton } from "./CvButton";
import { HomeLink } from "./HomeLink";
import { KyivTime } from "./KyivTime";
import { MobileMenu } from "./MobileMenu";
import { Monogram } from "./Monogram";

type Props = { variant?: "home" | "case" };

// case pages swap the nav for a way back; on mobile they drop the monogram and menu too
export function Header({ variant = "home" }: Props) {
  const isCase = variant === "case";

  return (
    <header className="sticky top-0 z-40 bg-bg">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-[12px] focus:left-[20px] focus:z-50 focus:bg-accent focus:px-[12px] focus:py-[8px] focus:font-mono focus:text-[12px] focus:text-accent-ink"
      >
        Skip to content
      </a>
      <div className="flex h-[64px] items-center justify-between gap-[24px] px-gutter | md:grid md:h-[72px] md:grid-cols-[1fr_auto_1fr]">
        {isCase ? (
          <div className="flex items-center gap-[20px]">
            <Monogram className="hidden | md:flex" />
            <HomeLink
              hash="#work"
              backToSection
              className="text-[14px] leading-[20px] text-text-3 transition-colors duration-150 hover:text-accent"
            >
              ← All work
            </HomeLink>
          </div>
        ) : (
          <Monogram />
        )}

        {!isCase && (
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
        )}

        <div className="flex items-center justify-end gap-[8px] | md:col-start-3 md:gap-[24px]">
          <div className="hidden items-center gap-[24px] text-[14px] leading-[20px] text-muted | lg:flex">
            <span>
              Kyiv{" "}
              <span className="font-mono text-[13px]">
                <KyivTime />
              </span>
            </span>
            <span>Open to work</span>
          </div>
          <CvButton
            size="sm"
            arrow="↓"
            external={false}
            className="h-[44px] px-[14px] py-0 | md:h-auto md:px-[16px] md:py-[11px]"
          >
            CV
          </CvButton>
          {!isCase && <MobileMenu />}
        </div>
      </div>
    </header>
  );
}
