import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { getLabProjects } from "@/lib/content";
import { formatTag } from "@/lib/format";
import { getProjectLinks } from "@/lib/project-links";
import { SECTIONS } from "@/lib/site";
import { LabList, type LabItem } from "./LabList";

export function Lab() {
  const { number, label, title, meta } = SECTIONS.lab;

  const items: LabItem[] = getLabProjects().map((project) => ({
    slug: project.slug,
    title: project.title,
    status: project.status,
    tags: project.tags.map(formatTag),
    summary: project.summary,
    description: project.description ?? project.summary,
    stack: project.stack.map((item) => item.toLowerCase()),
    frameUrl: project.frameUrl,
    href: getProjectLinks(project).primary?.href,
    shareTitle: !project.show.includes("featured"),
  }));

  return (
    <Section id="lab" labelledBy="lab-title">
      <SectionHeader id="lab-title" number={number} label={label} meta={meta} title={title} />
      <LabList items={items} />
    </Section>
  );
}
