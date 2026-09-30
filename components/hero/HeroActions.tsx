import { Button } from "@/components/ui/Button";
import { SITE } from "@/lib/site";
import { cn } from "@/lib/utils";

// mobile: View work on its own row, Ask and CV share the next; from md all three sit in one row
export function HeroActions({ className }: { className?: string }) {
  return (
    <div className={cn("grid grid-cols-[1fr_auto] gap-[8px] | md:flex md:gap-[10px]", className)}>
      <Button href="#work" size="lg" className="col-span-2 justify-center">
        View work
      </Button>
      <Button href="#ask" variant="ghost" size="lg" className="justify-center border-text">
        Ask my AI about me
      </Button>
      <Button
        href={SITE.cv}
        variant="ghost"
        size="lg"
        external={false}
        className="justify-center | md:border-transparent md:hover:border-transparent"
      >
        CV
      </Button>
    </div>
  );
}
