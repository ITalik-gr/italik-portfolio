import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SECTIONS } from "@/lib/site";
import { getSkillGroups } from "@/lib/site-lists";

// only verified skills reach this list (see lib/site-lists.ts)
type Props = { order?: readonly string[] };

export function Skills({ order }: Props) {
  const { title, meta } = SECTIONS.skills;
  const groups = getSkillGroups();
  // a role page can lead with the groups that matter for that role
  const sorted = order
    ? [...groups].sort((a, b) => order.indexOf(a.label) - order.indexOf(b.label))
    : groups;

  return (
    <Section id="skills" labelledBy="skills-title">
      <SectionHeader id="skills-title" meta={meta} title={title} />
      <dl className="mt-fl-32/56 grid gap-y-fl-28/48 | md:grid-cols-2 md:gap-x-[32px] | lg:grid-cols-4">
        {sorted.map((group) => (
          <div key={group.label} className="flex flex-col gap-[10px] | md:gap-[12px]">
            <dt className="text-[14px] leading-[20px] text-muted">
              {group.label}
            </dt>
            <dd className="text-fl-16/18 leading-[1.5]">{group.items.join(", ")}</dd>
          </div>
        ))}
      </dl>
    </Section>
  );
}
