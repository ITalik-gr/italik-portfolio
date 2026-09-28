import { DraftText } from "@/components/ui/DraftText";
import type { Project } from "@/lib/schemas";

type Props = { rows: NonNullable<Project["aiSpecifics"]> };

export function CaseSpecs({ rows }: Props) {
  return (
    <dl className="font-mono">
      {rows.map((row) => (
        <div
          key={row.key}
          className="grid gap-y-[6px] border-b border-line py-[14px] | md:grid-cols-[224px_1fr] md:py-[16px]"
        >
          <dt className="text-[12px] leading-[19px] tracking-[0.06em] text-muted uppercase | md:pt-[2px]">
            {row.key}
          </dt>
          <dd className="text-fl-14/15 leading-[24px] text-text">
            <DraftText text={row.value} />
          </dd>
        </div>
      ))}
    </dl>
  );
}
