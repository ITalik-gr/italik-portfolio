import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { getNowBuilding } from "@/lib/content";
import { SECTIONS } from "@/lib/site";
import { NowBuildingCard } from "./NowBuildingCard";

export function NowBuilding() {
  const projects = getNowBuilding();
  if (projects.length === 0) return null;

  const { title, meta } = SECTIONS.nowBuilding;

  return (
    <Section id="now" labelledBy="now-title">
      <SectionHeader id="now-title" meta={meta} title={title} />
      <ul className="mt-fl-24/40 grid gap-[12px] | lg:grid-cols-3 lg:gap-x-fl-16/24 lg:gap-y-0">
        {projects.map((project) => (
          <NowBuildingCard key={project.slug} project={project} />
        ))}
      </ul>
    </Section>
  );
}
