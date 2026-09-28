import type { Metadata } from "next";
import type { ReactNode } from "react";
import {
  getCaseStudies,
  getClientProjects,
  getExperience,
  getFeaturedProjects,
  getLabProjects,
  getNowBuilding,
} from "@/lib/content";
import { getKnowledge } from "@/lib/chat/knowledge";
import type { Project } from "@/lib/schemas";
import { getSkillGroups, MORE_PROJECTS } from "@/lib/site-lists";

// temporary content check for phase 1; removed before launch
export const metadata: Metadata = { title: "Debug", robots: { index: false } };

function Block({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-[12px] border-t border-line pt-[24px]">
      <h2 className="font-mono text-[13px] uppercase tracking-[0.08em] text-accent">{title}</h2>
      {children}
    </section>
  );
}

function ProjectRow({ project }: { project: Project }) {
  return (
    <li className="flex flex-col gap-[4px]">
      <span className="text-[19px] font-bold">
        {project.title}
        {project.draft && <span className="ml-[8px] font-mono text-[12px] text-muted">draft</span>}
      </span>
      <span className="font-mono text-[13px] text-muted">
        {project.status}
        {project.statusNote && ` · ${project.statusNote}`} · {project.typeLabel}
        {project.nowBuilding?.phase &&
          ` · phase ${project.nowBuilding.phase.current}/${project.nowBuilding.phase.total}`}
      </span>
      <span className="text-[16px] text-text-3">{project.summary}</span>
      {project.stack.length > 0 && (
        <span className="font-mono text-[12px] text-muted">{project.stack.join(" · ")}</span>
      )}
    </li>
  );
}

function ProjectList({ projects }: { projects: Project[] }) {
  return (
    <ul className="flex flex-col gap-[16px]">
      {projects.map((project) => (
        <ProjectRow key={project.slug} project={project} />
      ))}
    </ul>
  );
}

export default function DebugPage() {
  return (
    <main id="main" className="flex flex-col gap-[40px] px-gutter py-[40px]">
      <h1 className="text-[48px] font-bold tracking-[-0.05em]">Content debug</h1>
      <Block title="Featured">
        <ProjectList projects={getFeaturedProjects()} />
      </Block>
      <Block title="Lab">
        <ProjectList projects={getLabProjects()} />
      </Block>
      <Block title="Now building">
        <ProjectList projects={getNowBuilding()} />
      </Block>
      <Block title="Client work">
        <ProjectList projects={getClientProjects()} />
      </Block>
      <Block title="Case studies">
        <ProjectList projects={getCaseStudies()} />
      </Block>
      <Block title="Experience">
        <ul className="flex flex-col gap-[16px]">
          {getExperience().map((role) => (
            <li key={role.slug} className="flex flex-col gap-[4px]">
              <span className="text-[19px] font-bold">{role.company}</span>
              <span className="font-mono text-[13px] text-muted">
                {role.role} · {role.start} — {role.end} · {role.type}
              </span>
              {role.highlights.map((line) => (
                <span key={line} className="text-[16px] text-text-3">
                  — {line}
                </span>
              ))}
            </li>
          ))}
        </ul>
      </Block>
      <Block title="Skills (verified only)">
        {getSkillGroups().map((group) => (
          <p key={group.label} className="text-[16px]">
            <span className="font-mono text-[13px] text-muted">{group.label}: </span>
            {group.items.join(", ")}
          </p>
        ))}
      </Block>
      <Block title={`More projects · ${MORE_PROJECTS.caption}`}>
        {MORE_PROJECTS.items.map((item) => (
          <p key={item.name} className="text-[16px]">
            {item.name} <span className="font-mono text-[12px] text-muted">{item.category}</span>
          </p>
        ))}
      </Block>
      <Block
        title={`Chat knowledge base · ${getKnowledge().text.length} chars ≈ ${Math.round(getKnowledge().text.length / 3.6)} tokens`}
      >
        <pre className="max-h-[600px] overflow-auto font-mono text-[12px] leading-[1.5] whitespace-pre-wrap text-text-3">
          {getKnowledge().text}
        </pre>
      </Block>
    </main>
  );
}
