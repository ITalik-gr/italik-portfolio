import { CvButton } from "@/components/layout/CvButton";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

// mobile: View work on its own row, Ask and CV share the next (Ask spans it when there's no CV); from md all three sit in one row
export function HeroActions({ className }: { className?: string }) {
  return (
    <div className={cn("grid grid-cols-[1fr_auto] gap-[8px] | md:flex md:gap-[10px]", className)}>
      <Button href="#work" size="lg" className="col-span-2 justify-center">
        View work
      </Button>
      <Button href="#ask" variant="ghost" size="lg" className="justify-center border-text last:col-span-2">
        Ask my AI about me
      </Button>
      <CvButton
        variant="ghost"
        size="lg"
        external={false}
        className="justify-center | md:border-transparent md:hover:border-transparent"
      >
        CV
      </CvButton>
    </div>
  );
}
