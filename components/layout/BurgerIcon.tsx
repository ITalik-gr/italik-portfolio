import { cn } from "@/lib/utils";

const LINE =
  "absolute left-0 h-[1.5px] w-full bg-current transition-[translate,rotate,opacity] duration-300 ease-out-expo motion-reduce:transition-none";

// three lines fold into a cross
export function BurgerIcon({ open }: { open: boolean }) {
  return (
    <span aria-hidden className="relative block h-[12px] w-[18px]">
      <span className={cn(LINE, "top-0", open && "translate-y-[5.25px] rotate-45")} />
      <span className={cn(LINE, "top-[5.25px]", open && "opacity-0")} />
      <span className={cn(LINE, "bottom-0", open && "-translate-y-[5.25px] -rotate-45")} />
    </span>
  );
}
