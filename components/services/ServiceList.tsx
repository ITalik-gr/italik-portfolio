import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { getProject } from "@/lib/content";
import { getProjectLinks } from "@/lib/project-links";
import { SERVICES } from "@/lib/services";

export function ServiceList() {
  return (
    <Section id="services" labelledBy="services-title">
      <SectionHeader id="services-title" title="What I build" meta="Rates on request" />
      <ul className="mt-fl-40/72 flex flex-col">
        {SERVICES.map((service) => (
          <li
            key={service.title}
            className="grid gap-[16px] border-t border-line py-fl-28/48 | lg:grid-cols-[5fr_7fr] lg:gap-[40px]"
          >
            <h3 className="text-fl-32/56 leading-[0.95] font-semibold tracking-[-0.035em]">
              {service.title}
            </h3>
            <div className="flex flex-col gap-[16px] | lg:gap-[20px]">
              <p className="max-w-[680px] text-fl-17/21 leading-[1.45] text-text-2">
                {service.text}
              </p>
              <ProofLinks slugs={service.proof} />
            </div>
          </li>
        ))}
      </ul>
    </Section>
  );
}

function ProofLinks({ slugs }: { slugs: readonly string[] }) {
  const links = slugs.flatMap((slug) => {
    const project = getProject(slug);
    const href = project && getProjectLinks(project).case;
    return project && href ? [{ title: project.title, href }] : [];
  });
  if (links.length === 0) return null;

  return (
    <p className="flex flex-wrap gap-x-[20px] gap-y-[6px] text-[14px] leading-[20px] | md:text-[15px] md:leading-[21px]">
      <span className="text-muted">Work</span>
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="text-text underline decoration-line-strong underline-offset-[4px] transition-colors duration-150 hover:text-accent hover:decoration-accent"
        >
          {link.title}
        </Link>
      ))}
    </p>
  );
}
