import { SITE } from "@/lib/site";
import { cn } from "@/lib/utils";
import { HomeLink } from "./HomeLink";

export function Monogram({ className }: { className?: string }) {
  return (
    <HomeLink
      aria-label={`${SITE.monogram}, ${SITE.name}, home`}
      className={cn(
        // w-fit: as a grid item the link would otherwise stretch and catch hovers on empty space
        "group/mono flex w-fit items-center gap-[12px] text-text transition-colors duration-150 hover:text-accent focus-visible:text-accent",
        className,
      )}
    >
      <span className="flex size-[40px] items-center justify-center border border-current text-[17px] leading-none font-semibold tracking-[-0.02em]">
        {SITE.monogram}
      </span>
      <span
        aria-hidden
        className="max-w-0 overflow-hidden text-[17px] leading-[19px] font-medium whitespace-nowrap opacity-0 transition-[max-width,opacity] duration-450 ease-out-expo group-hover/mono:max-w-[200px] group-hover/mono:opacity-100 group-focus-visible/mono:max-w-[200px] group-focus-visible/mono:opacity-100"
      >
        {SITE.name}
      </span>
    </HomeLink>
  );
}
