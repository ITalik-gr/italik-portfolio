import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { getLabProjects } from "@/lib/content";
import { getProjectLinks } from "@/lib/project-links";
import { SECTIONS } from "@/lib/site";
import { LabList, type LabItem } from "./LabList";

type Props = { featured: ReadonlySet<string> };

export function Lab({ featured }: Props) {
  const { title, meta } = SECTIONS.lab;

  const items: LabItem[] = getLabProjects().map((project) => ({
    slug: project.slug,
    title: project.title,
    status: project.status,
    tags: project.tags,
    summary: project.summary,
    description: project.description ?? project.summary,
    stack: project.stack,
    frameUrl: project.frameUrl,
    cover: project.cover,
    href: getProjectLinks(project).primary?.href,
    shareTitle: !featured.has(project.slug),
  }));

  return (
    <Section id="lab" labelledBy="lab-title">
      <SectionHeader id="lab-title" meta={meta} title={title} />
      <LabList items={items} />
    </Section>
  );
}
