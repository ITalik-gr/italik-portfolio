import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import type { Project } from "@/lib/schemas";
import { SECTIONS } from "@/lib/site";
import { FeaturedCard } from "./FeaturedCard";

type Props = { projects: Project[] };

// optional section: renders only when there is something to feature
export function Featured({ projects }: Props) {
  if (projects.length === 0) return null;

  const { title, meta } = SECTIONS.featured;

  return (
    <Section id="work" labelledBy="featured-title">
      <SectionHeader id="featured-title" meta={meta} title={title} />
      <div className="flex flex-col">
        {projects.map((project, index) => (
          <FeaturedCard key={project.slug} project={project} mirrored={index % 2 === 1} />
        ))}
      </div>
    </Section>
  );
}
