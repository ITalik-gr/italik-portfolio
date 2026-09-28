import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { getClientProjects } from "@/lib/content";
import { SECTIONS } from "@/lib/site";
import { ClientCard } from "./ClientCard";
import { MoreProjects } from "./MoreProjects";

export function ClientWork() {
  const { number, label, title, meta } = SECTIONS.clientWork;

  return (
    <Section id="clients" labelledBy="clients-title">
      <SectionHeader id="clients-title" number={number} label={label} meta={meta} title={title} />
      <ul className="mt-fl-32/56 grid gap-y-fl-48/72 | md:grid-cols-2 md:gap-x-[24px] | lg:grid-cols-3">
        {getClientProjects().map((project) => (
          <ClientCard key={project.slug} project={project} />
        ))}
      </ul>
      <MoreProjects />
    </Section>
  );
}
