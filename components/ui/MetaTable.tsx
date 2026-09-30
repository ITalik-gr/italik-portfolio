import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Row = { key: string; value: ReactNode };

type Props = {
  rows: Row[];
  keyWidth?: number;
  className?: string;
};

export function MetaTable({ rows, keyWidth = 110, className }: Props) {
  return (
    <dl
      style={{ gridTemplateColumns: `${keyWidth}px 1fr` }}
      className={cn(
        "grid content-start gap-y-[12px] border-t border-line pt-[20px] text-[15px] leading-[24px]",
        className,
      )}
    >
      {rows.map((row) => (
        <div key={row.key} className="contents">
          <dt className="text-muted">{row.key}</dt>
          <dd className="text-text">{row.value}</dd>
        </div>
      ))}
    </dl>
  );
}
