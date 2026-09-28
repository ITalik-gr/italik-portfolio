"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { NAV } from "@/lib/site";
import { cn } from "@/lib/utils";
import { BurgerIcon } from "./BurgerIcon";
import { ContactLinks } from "./ContactLinks";
import { KyivTime } from "./KyivTime";

// each block slides up a little after the previous one while opening
const stagger = (open: boolean, index: number) => ({
  transitionDelay: open ? `${80 + index * 50}ms` : "0ms",
});

const REVEAL =
  "transition-[opacity,translate] duration-500 ease-out-expo motion-reduce:transition-none";

export function MobileMenu() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    const close = () => window.innerWidth >= 768 && setOpen(false);
    document.documentElement.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", close);
    return () => {
      document.documentElement.style.overflow = "";
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", close);
    };
  }, [open]);

  const shown = open ? "translate-y-0 opacity-100" : "translate-y-[24px] opacity-0";

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((value) => !value)}
        className="flex size-[44px] items-center justify-center border border-line-strong text-text"
      >
        <BurgerIcon open={open} />
      </button>

      <div
        id="mobile-menu"
        inert={!open}
        className={cn(
          "fixed inset-x-0 top-[64px] bottom-0 z-40 flex flex-col overflow-y-auto bg-bg px-gutter pt-[32px] pb-[28px] transition-[opacity,visibility] duration-300 ease-out-expo",
          open ? "visible opacity-100" : "invisible opacity-0",
        )}
      >
        <nav aria-label="Mobile">
          <ul className="flex flex-col gap-[8px]">
            {NAV.map((item, index) => (
              <li key={item.href} style={stagger(open, index)} className={cn(REVEAL, shown)}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="flex items-baseline gap-[16px] py-[6px] text-text transition-colors hover:text-accent"
                >
                  <span className="font-mono text-[12px] text-accent">0{index + 1}</span>
                  <span className="text-fl-56/80 leading-[0.9] font-bold tracking-[-0.05em] font-stretch-[88%]">
                    {item.label}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div
          style={stagger(open, NAV.length)}
          className={cn("mt-[40px]", REVEAL, shown)}
          onClick={(event) => (event.target as HTMLElement).closest("a") && setOpen(false)}
        >
          <Button href="/#ask" variant="ghost" size="lg" dot className="w-full justify-center">
            Ask my AI about me
          </Button>
        </div>

        <div
          style={stagger(open, NAV.length + 1)}
          className={cn("mt-auto pt-[40px]", REVEAL, shown)}
        >
          <ContactLinks variant="rows" className="border-t border-line" />
          <p className="mt-[12px] flex justify-between font-mono text-[12px] leading-[16px] text-text-3">
            <span>
              Kyiv · <KyivTime /> · UTC+3
            </span>
            <span className="tracking-[0.06em] text-muted uppercase">Open to work</span>
          </p>
        </div>
      </div>
    </div>
  );
}
