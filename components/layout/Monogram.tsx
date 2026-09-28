import Link from "next/link";
import { SITE } from "@/lib/site";

export function Monogram() {
  return (
    <Link
      href="/"
      aria-label={`${SITE.name}, home`}
      className="group/mono flex items-center gap-[12px] text-text transition-colors duration-150 hover:text-accent focus-visible:text-accent"
    >
      <span className="flex size-[40px] items-center justify-center border border-current text-[17px] leading-none font-bold tracking-[-0.02em] font-stretch-[88%]">
        {SITE.monogram}
      </span>
      <span
        aria-hidden
        className="max-w-0 overflow-hidden text-[17px] leading-[19px] font-medium whitespace-nowrap opacity-0 transition-[max-width,opacity] duration-450 ease-out-expo group-hover/mono:max-w-[200px] group-hover/mono:opacity-100 group-focus-visible/mono:max-w-[200px] group-focus-visible/mono:opacity-100"
      >
        {SITE.name}
      </span>
    </Link>
  );
}
