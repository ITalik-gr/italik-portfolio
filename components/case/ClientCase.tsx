import { getBodySections, getProjects } from "@/lib/content";
import { getProjectLinks } from "@/lib/project-links";
import type { Project } from "@/lib/schemas";
import { CaseBlocks, type CaseBlock } from "./CaseBlocks";
import { CaseGallery } from "./CaseGallery";
import { CaseHighlights } from "./CaseHighlights";
import { CaseOutcome } from "./CaseOutcome";
import { CaseProblem } from "./CaseProblem";
import { CaseProse } from "./CaseProse";
import { CaseRelated } from "./CaseRelated";

// template B: client projects
export function ClientCase({ project }: { project: Project }) {
  const body = getBodySections(project.body);
  const blocks: CaseBlock[] = [];

  if (body["Brief"]) {
    blocks.push({
      key: "brief",
      label: "Brief",
      content: <CaseProblem paragraphs={body["Brief"]} />,
    });
  }
  if (body["What I did"]) {
    blocks.push({
      key: "did",
      label: "What I did",
      content: <CaseProse paragraphs={body["What I did"]} />,
      after: project.gallery && <CaseGallery shots={project.gallery} title={project.title} />,
    });
  }
  if (project.highlights) {
    blocks.push({
      key: "highlights",
      label: "Highlights",
      content: <CaseHighlights highlights={project.highlights} />,
    });
  }
  if (project.outcome) {
    blocks.push({
      key: "outcome",
      label: "Outcome",
      content: <CaseOutcome outcome={project.outcome} />,
    });
  }

  // other client work with somewhere to go, whether or not it is shown on the home page
  const related = getProjects()
    .filter((item) => item.kind === "client" && item.slug !== project.slug)
    .map((item) => ({
      slug: item.slug,
      title: item.title,
      href: getProjectLinks(item).primary?.href,
      meta: item.stack.join(" · "),
    }))
    .filter((item): item is { slug: string; title: string; href: string; meta: string } =>
      Boolean(item.href),
    );

  return (
    <>
      <CaseBlocks blocks={blocks} />
      {related.length > 0 && (
        <CaseRelated id="case-related" items={related} />
      )}
    </>
  );
}
