import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Arrow } from "./Button";

type Props = {
  href: string;
  children: ReactNode;
  arrow?: "→" | "↗" | "↓";
  className?: string;
};

export function TextLink({ href, children, arrow = "→", className }: Props) {
  const isExternal = /^(https?:|mailto:)/.test(href);

  return (
    <Link
      href={href}
      {...(isExternal && { target: "_blank", rel: "noopener noreferrer" })}
      className={cn(
        "group inline-flex items-center gap-[8px] text-[15px] leading-[19px] font-medium text-text transition-colors duration-150 hover:text-accent",
        className,
      )}
    >
      <span>{children}</span>
      <Arrow arrow={arrow} />
    </Link>
  );
}
