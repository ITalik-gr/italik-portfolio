import { Emphasis } from "@/components/ui/Emphasis";
import type { Experience } from "@/lib/schemas";
import { cn } from "@/lib/utils";

type Props = { role: Experience };

export function ExperienceRole({ role }: Props) {
  const current = role.end === "present";
  const dates = `${role.start} — ${current ? "Present" : role.end}`;
  const title = role.client ? `${role.role} · client: ${role.client}` : role.role;

  return (
    <li className="relative grid gap-[12px] pb-[40px] last:pb-0 | md:gap-[24px] md:pb-fl-40/88 | lg:grid-cols-[5fr_7fr] lg:gap-[40px]">
      <span
        aria-hidden
        className={cn(
          "absolute top-[9px] -left-[26px] size-[7px] rounded-full | md:top-[14px] md:-left-[48px] md:size-[9px]",
          current ? "bg-accent" : "bg-muted",
        )}
      />

      <div className="flex flex-col gap-[8px] | md:gap-[12px]">
        <h3 className="text-fl-34/56 leading-[0.92] font-bold tracking-[-0.045em] font-stretch-[88%]">
          {role.company}
        </h3>
        <p className="text-fl-15/19 leading-[1.15]">{title}</p>
        <p className="font-mono text-[11px] leading-[14px] tracking-[0.04em] text-muted uppercase | md:text-[13px] md:leading-[17px] md:normal-case">
          {dates} · {role.type} · {role.location}
        </p>
      </div>

      <div className="flex flex-col gap-[22px] | lg:pt-[6px]">
        <ul className="flex flex-col gap-[10px] | md:gap-[14px]">
          {role.highlights.map((line) => (
            <li
              key={line}
              className="grid grid-cols-[18px_1fr] text-fl-15/19 leading-[1.45] text-text-3 | md:grid-cols-[22px_1fr]"
            >
              <span aria-hidden className="text-faint">
                —
              </span>
              <span>
                <Emphasis text={line} />
              </span>
            </li>
          ))}
        </ul>
        {role.stack.length > 0 && (
          <p className="hidden pl-[22px] font-mono text-[12px] leading-[16px] text-muted | md:block">
            {role.stack.map((item) => item.toLowerCase()).join(" · ")}
          </p>
        )}
      </div>
    </li>
  );
}
