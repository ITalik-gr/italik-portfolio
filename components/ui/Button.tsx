import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Props = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "ghost" | "disabled";
  size?: "sm" | "md" | "lg";
  arrow?: "→" | "↗" | "↓";
  external?: boolean;
  className?: string;
};

const VARIANTS = {
  primary: "bg-text text-bg hover:bg-accent",
  ghost: "border border-line-strong text-text hover:border-accent hover:text-accent",
  // no link yet (e.g. repo not public): keep the slot, drop the affordance
  disabled: "border border-line text-muted",
};

// ghost keeps the same outer size as primary by eating 1px of padding for the border
const SIZES = {
  primary: {
    sm: "px-[16px] py-[11px] text-[14px] leading-[18px]",
    md: "px-[18px] py-[13px] text-[15px] leading-[19px]",
    lg: "px-[24px] py-[17px] text-[16px] leading-[20px]",
  },
  disabled: {
    sm: "px-[15px] py-[10px] text-[14px] leading-[18px]",
    md: "px-[17px] py-[12px] text-[15px] leading-[19px]",
    lg: "px-[23px] py-[16px] text-[16px] leading-[20px]",
  },
  ghost: {
    sm: "px-[15px] py-[10px] text-[14px] leading-[18px]",
    md: "px-[17px] py-[12px] text-[15px] leading-[19px]",
    lg: "px-[23px] py-[16px] text-[16px] leading-[20px]",
  },
};

// shared with buttons that aren't links (e.g. one that opens the chat)
export function buttonClasses(
  variant: keyof typeof VARIANTS = "primary",
  size: "sm" | "md" | "lg" = "md",
  className?: string,
) {
  return cn(
    "group inline-flex items-center gap-[10px] font-medium transition-colors duration-150 ease-out-expo",
    VARIANTS[variant],
    SIZES[variant][size],
    className,
  );
}

export function Button({
  href,
  children,
  variant = "primary",
  size = "md",
  arrow,
  external,
  className,
}: Props) {
  const isExternal = external ?? /^(https?:|mailto:)/.test(href);
  const classes = buttonClasses(variant, size, className);
  const content = (
    <>
      <span>{children}</span>
      {arrow && <Arrow arrow={arrow} />}
    </>
  );

  if (variant === "disabled") {
    return (
      <span aria-disabled className={classes}>
        {content}
      </span>
    );
  }

  // a file (cv.pdf) is not a route: next/link would try to prefetch it as a page; it opens in a new tab
  if (/\.\w+$/.test(href)) {
    return (
      <a href={href} target="_blank" rel="noopener" className={classes}>
        {content}
      </a>
    );
  }

  return (
    <Link
      href={href}
      {...(isExternal && { target: "_blank", rel: "noopener noreferrer" })}
      className={classes}
    >
      {content}
    </Link>
  );
}

export function Arrow({ arrow }: { arrow: "→" | "↗" | "↓" }) {
  const shift = {
    "→": "group-hover:translate-x-[3px]",
    "↗": "group-hover:translate-x-[2px] group-hover:-translate-y-[2px]",
    "↓": "group-hover:translate-y-[3px]",
  }[arrow];

  return (
    <span
      aria-hidden
      className={cn(
        "-ml-[4px] inline-block transition-transform duration-400 ease-out-expo motion-reduce:transition-none",
        shift,
      )}
    >
      {arrow}
    </span>
  );
}
