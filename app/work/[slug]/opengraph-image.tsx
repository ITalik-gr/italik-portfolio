import { notFound } from "next/navigation";
import { OG_ACCENT, OG_SIZE, OG_TEXT, renderOgCard } from "@/components/og/OgCard";
import { getCaseStudies, getProject } from "@/lib/content";
import { SITE } from "@/lib/site";

export const alt = `Case study by ${SITE.name}`;
export const size = OG_SIZE;
export const contentType = "image/png";

export function generateStaticParams() {
  return getCaseStudies().map((project) => ({ slug: project.slug }));
}

// the title shrinks with its length so long names still fit on one line
const titleSize = (title: string) => Math.min(190, Math.floor(1072 / (title.length * 0.5)));

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const project = getProject((await params).slug);
  if (!project?.caseStudy) notFound();

  return renderOgCard({
    kicker: (
      <div style={{ display: "flex", gap: 16 }}>
        <div style={{ color: OG_ACCENT }}>Case study</div>
        <div style={{ color: OG_TEXT }}>{project.typeLabel}</div>
      </div>
    ),
    lines: [project.title],
    titleSize: titleSize(project.title),
    lead: project.keyIdea ?? project.summary,
    leadAccent: Boolean(project.keyIdea),
    path: `/work/${project.slug}`,
  });
}
