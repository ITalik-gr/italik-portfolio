import type { Project } from "@/lib/schemas";

type Props = { outcome: NonNullable<Project["outcome"]> };

export function CaseOutcome({ outcome }: Props) {
  return (
    <dl className="grid grid-cols-2 gap-x-[16px] gap-y-[32px] | md:grid-cols-3 md:gap-x-[24px]">
      {outcome.map((item) => (
        <div key={item.label} className="flex flex-col-reverse">
          <dt className="mt-[10px] font-mono text-[12px] leading-[16px] text-text-3 | md:text-[13px] md:leading-[17px]">
            {item.label}
          </dt>
          <dd className="text-fl-56/96 leading-[0.85] font-bold tracking-[-0.05em] font-stretch-[88%]">
            {item.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}
