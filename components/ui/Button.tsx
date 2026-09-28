import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Props = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "ghost" | "disabled";
  size?: "sm" | "md" | "lg";
  arrow?: "→" | "↗" | "↓";
  dot?: boolean;
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
    sm: "px-[16px] py-[11px] text-[12px] font-medium tracking-[0.06em]",
    md: "px-[18px] py-[13px] text-[13px] tracking-[0.04em]",
    lg: "px-[22px] py-[16px] text-[13px] tracking-[0.04em]",
  },
  disabled: {
    sm: "px-[15px] py-[10px] text-[12px] font-medium tracking-[0.06em]",
    md: "px-[17px] py-[12px] text-[13px] tracking-[0.04em]",
    lg: "px-[21px] py-[15px] text-[13px] tracking-[0.04em]",
  },
  ghost: {
    sm: "px-[15px] py-[10px] text-[12px] font-medium tracking-[0.06em]",
    md: "px-[17px] py-[12px] text-[13px] tracking-[0.04em]",
    lg: "px-[21px] py-[15px] text-[13px] tracking-[0.04em]",
  },
};

export function Button({
  href,
  children,
  variant = "primary",
  size = "md",
  arrow,
  dot,
  external,
  className,
}: Props) {
  const isExternal = external ?? /^(https?:|mailto:)/.test(href);
  const classes = cn(
    "group inline-flex items-center gap-[10px] font-mono leading-[17px] uppercase transition-colors duration-150 ease-out-expo",
    VARIANTS[variant],
    SIZES[variant][size],
    className,
  );
  const content = (
    <>
      {dot && <span aria-hidden className="size-[7px] rounded-full bg-accent" />}
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
