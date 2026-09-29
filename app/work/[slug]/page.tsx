import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CaseHero } from "@/components/case/CaseHero";
import { ClientCase } from "@/components/case/ClientCase";
import { PersonalCase, getLabPosition } from "@/components/case/PersonalCase";
import { JsonLd } from "@/components/seo/JsonLd";
import { getCaseStudies, getProject } from "@/lib/content";
import { caseJsonLd } from "@/lib/seo";
import { SITE } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return getCaseStudies().map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: PageProps<"/work/[slug]">): Promise<Metadata> {
  const project = getProject((await params).slug);
  if (!project) return {};

  const title = `${project.title} — case study · ${SITE.name}`;
  const url = `/work/${project.slug}`;
  // openGraph and twitter replace the layout's objects whole, so every field is repeated here
  return {
    title,
    description: project.summary,
    alternates: { canonical: url },
    openGraph: {
      url,
      siteName: "italik.dev",
      type: "article",
      locale: "en_US",
      title,
      description: project.summary,
    },
    twitter: { card: "summary_large_image", title, description: project.summary },
  };
}

export default async function CasePage({ params }: PageProps<"/work/[slug]">) {
  const project = getProject((await params).slug);
  if (!project?.caseStudy) notFound();

  return (
    <main id="main">
      <JsonLd data={caseJsonLd(project)} />
      <CaseHero project={project} labPosition={getLabPosition(project)} />
      {project.kind === "client" ? (
        <ClientCase project={project} />
      ) : (
        <PersonalCase project={project} />
      )}
    </main>
  );
}
