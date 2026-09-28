import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { getExperience } from "@/lib/content";
import { SECTIONS } from "@/lib/site";
import { ExperienceRole } from "./ExperienceRole";

export function Experience() {
  const { number, label, title, meta } = SECTIONS.experience;

  return (
    <Section id="experience" labelledBy="experience-title">
      <SectionHeader
        id="experience-title"
        number={number}
        label={label}
        meta={meta}
        title={title}
      />
      <ol className="relative mt-fl-36/56 pl-[26px] | md:pl-[48px]">
        <span
          aria-hidden
          className="absolute top-[10px] bottom-0 left-[3px] w-px bg-line | md:top-[14px] md:left-[4px]"
        />
        {getExperience().map((role) => (
          <ExperienceRole key={role.slug} role={role} />
        ))}
      </ol>
    </Section>
  );
}
