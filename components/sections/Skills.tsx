import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SECTIONS } from "@/lib/site";
import { getSkillGroups } from "@/lib/site-lists";

// only verified skills reach this list (see lib/site-lists.ts)
export function Skills() {
  const { number, label, title, meta } = SECTIONS.skills;

  return (
    <Section id="skills" labelledBy="skills-title">
      <SectionHeader id="skills-title" number={number} label={label} meta={meta} title={title} />
      <dl className="mt-fl-32/56 grid gap-y-fl-28/48 | md:grid-cols-2 md:gap-x-[32px] | lg:grid-cols-4">
        {getSkillGroups().map((group) => (
          <div key={group.label} className="flex flex-col gap-[10px] | md:gap-[12px]">
            <dt className="font-mono text-[12px] leading-[16px] tracking-[0.06em] text-muted uppercase">
              {group.label}
            </dt>
            <dd className="text-fl-16/18 leading-[1.5]">{group.items.join(", ")}</dd>
          </div>
        ))}
      </dl>
    </Section>
  );
}
