import type { ArchKind } from "@/lib/schemas-architecture";
import { cn } from "@/lib/utils";
import { KIND_LABELS, kindBox, type KindContext } from "./kinds";

type Props = { kinds: ArchKind[]; context: KindContext; className?: string };

export function Legend({ kinds, context, className }: Props) {
  return (
    <ul
      aria-label="Legend"
      className={cn(
        "flex flex-wrap gap-x-[16px] gap-y-[10px] font-mono text-[12px] leading-[16px] text-text-3 | md:gap-x-[20px]",
        className,
      )}
    >
      {kinds.map((kind) => (
        <li key={kind} className="flex items-center gap-[8px]">
          <span aria-hidden className={cn("size-[14px] shrink-0", kindBox(kind, context))} />
          {KIND_LABELS[kind]}
        </li>
      ))}
    </ul>
  );
}
