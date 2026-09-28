import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { getFeaturedProjects } from "@/lib/content";
import { SECTIONS } from "@/lib/site";
import { FeaturedCard } from "./FeaturedCard";

// optional section: renders only when some project has featured: true
export function Featured() {
  const projects = getFeaturedProjects();
  if (projects.length === 0) return null;

  const { number, label, title, meta } = SECTIONS.featured;

  return (
    <Section id="work" labelledBy="featured-title">
      <SectionHeader id="featured-title" number={number} label={label} meta={meta} title={title} />
      <div className="flex flex-col">
        {projects.map((project, index) => (
          <FeaturedCard key={project.slug} project={project} mirrored={index % 2 === 1} />
        ))}
      </div>
    </Section>
  );
}
