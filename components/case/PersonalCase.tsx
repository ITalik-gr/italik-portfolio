import { getBodySections, getLabProjects } from "@/lib/content";
import { getProjectHref } from "@/lib/project-links";
import type { Project } from "@/lib/schemas";
import { CaseArchitecture, CaseArchitectureIntro } from "./CaseArchitecture";
import { CaseBlocks, sectionNumber, type CaseBlock } from "./CaseBlocks";
import { CaseClosing } from "./CaseClosing";
import { CaseDecisions } from "./CaseDecisions";
import { CaseFeatures } from "./CaseFeatures";
import { CaseNav } from "./CaseNav";
import { CaseProblem } from "./CaseProblem";
import { CaseSpecs } from "./CaseSpecs";

// template A: personal / AI projects
export function PersonalCase({ project }: { project: Project }) {
  const body = getBodySections(project.body);
  const blocks: CaseBlock[] = [];

  if (body["Problem"]) {
    blocks.push({
      key: "problem",
      label: "Problem",
      content: <CaseProblem paragraphs={body["Problem"]} />,
    });
  }
  if (project.features) {
    blocks.push({
      key: "built",
      label: "What I built",
      content: <CaseFeatures features={project.features} />,
    });
  }
  if (project.architecture) {
    blocks.push({
      key: "architecture",
      label: "Architecture",
      aside: <CaseArchitectureIntro architecture={project.architecture} />,
      content: <CaseArchitecture architecture={project.architecture} />,
    });
  }
  if (project.decisions) {
    blocks.push({
      key: "decisions",
      label: "Decisions & trade-offs",
      content: <CaseDecisions decisions={project.decisions} />,
    });
  }
  if (project.aiSpecifics) {
    blocks.push({
      key: "ai",
      label: "AI specifics",
      content: <CaseSpecs rows={project.aiSpecifics} />,
    });
  }

  const closing = ["What I'd do differently", "Results", "Next"]
    .filter((heading) => body[heading])
    .map((heading, index) => ({
      id: `case-closing-${index}`,
      number: sectionNumber(blocks.length + index),
      label: heading,
      paragraphs: body[heading],
    }));

  const { prev, next } = getLabNeighbours(project);

  return (
    <>
      <CaseBlocks blocks={blocks} />
      {closing.length > 0 && <CaseClosing columns={closing} />}
      <CaseNav prev={prev} next={next} />
    </>
  );
}

export function getLabPosition(project: Project) {
  const lab = getLabProjects();
  const index = lab.findIndex((item) => item.slug === project.slug);
  if (index === -1) return undefined;
  return `${sectionNumber(index)} / ${String(lab.length).padStart(2, "0")} in Lab`;
}

// prev/next walk the Lab in a loop, skipping projects with nowhere to go
function getLabNeighbours(project: Project) {
  const linked = getLabProjects()
    .map((item) => ({ slug: item.slug, title: item.title, href: getProjectHref(item) }))
    .filter((item): item is { slug: string; title: string; href: string } => Boolean(item.href));
  const at = linked.findIndex((item) => item.slug === project.slug);
  if (at === -1 || linked.length < 2) return {};

  const pick = (offset: number) => linked[(at + offset + linked.length) % linked.length];
  return { prev: pick(-1), next: pick(1) };
}
