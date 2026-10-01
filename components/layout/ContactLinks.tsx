"use client";

import { Arrow } from "@/components/ui/Button";
import { useCv } from "./HomeLink";
import { SITE } from "@/lib/site";
import { cn } from "@/lib/utils";

type Props = {
  variant: "rows" | "inline";
  className?: string;
};

const LINKS = [
  { label: SITE.email, href: `mailto:${SITE.email}`, arrow: "→", inlineArrow: false },
  { label: "Telegram", href: SITE.socials.telegram, arrow: "↗", inlineArrow: true },
  { label: "X", href: SITE.socials.x, arrow: "↗", inlineArrow: true },
  { label: "GitHub", href: SITE.socials.github, arrow: "↗", inlineArrow: true },
] as const;

// none of these are routes (mailto, external, the CV file), so plain <a> and no prefetch
export function ContactLinks({ variant, className }: Props) {
  const rows = variant === "rows";
  const cv = useCv();
  const links = cv ? [...LINKS, { label: "CV", href: cv, arrow: "↓", inlineArrow: true } as const] : LINKS;

  return (
    <ul
      className={cn(
        "font-mono text-[14px] leading-[18px] text-text",
        rows ? "flex flex-col" : "flex flex-wrap gap-x-[36px] gap-y-[12px]",
        className,
      )}
    >
      {links.map((link) => (
        <li key={link.label} className={cn(rows && "border-b border-line last:border-b-0")}>
          <a
            href={link.href}
            {...(/^https?:|\.pdf$/.test(link.href) && { target: "_blank", rel: "noopener noreferrer" })}
            className={cn(
              "group flex items-center gap-[8px] transition-colors duration-150 hover:text-accent",
              rows && "justify-between py-[16px]",
            )}
          >
            <span>{link.label}</span>
            {(rows || link.inlineArrow) && <Arrow arrow={link.arrow} />}
          </a>
        </li>
      ))}
    </ul>
  );
}
