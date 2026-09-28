import { cn } from "@/lib/utils";

type Props = {
  current: number;
  total: number;
  className?: string;
};

export function Progress({ current, total, className }: Props) {
  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={total}
      aria-valuenow={current}
      aria-label={`Phase ${current} of ${total}`}
      className={cn("flex gap-[3px] | md:gap-[4px]", className)}
    >
      {Array.from({ length: total }, (_, i) => (
        <span key={i} className={cn("h-[3px] flex-1", i < current ? "bg-accent" : "bg-line")} />
      ))}
    </div>
  );
}
