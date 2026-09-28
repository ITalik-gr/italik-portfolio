import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CaseHero } from "@/components/case/CaseHero";
import { ClientCase } from "@/components/case/ClientCase";
import { PersonalCase, getLabPosition } from "@/components/case/PersonalCase";
import { getCaseStudies, getProject } from "@/lib/content";
import { SITE } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return getCaseStudies().map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: PageProps<"/work/[slug]">): Promise<Metadata> {
  const project = getProject((await params).slug);
  if (!project) return {};

  return {
    title: `${project.title} — case study · ${SITE.name}`,
    description: project.summary,
    openGraph: { url: `/work/${project.slug}` },
  };
}

export default async function CasePage({ params }: PageProps<"/work/[slug]">) {
  const project = getProject((await params).slug);
  if (!project?.caseStudy) notFound();

  return (
    <main id="main">
      <CaseHero project={project} labPosition={getLabPosition(project)} />
      {project.kind === "client" ? (
        <ClientCase project={project} />
      ) : (
        <PersonalCase project={project} />
      )}
    </main>
  );
}
