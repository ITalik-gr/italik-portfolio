import Link from "next/link";
import { ProjectMorph } from "@/components/motion/ProjectMorph";
import { Reveal } from "@/components/motion/Reveal";
import { HomeLink } from "@/components/layout/HomeLink";
import { CaseLabel } from "./CaseSection";

type Item = { slug: string; title: string; href: string; meta: string };
type Props = { id: string; items: Item[] };

export function CaseRelated({ id, items }: Props) {
  return (
    <section
      aria-labelledby={id}
      className="mt-fl-96/180 border-t border-line px-gutter pt-[20px] pb-[40px] | md:pt-[24px]"
    >
      <Reveal>
        <div className="flex items-center justify-between gap-[16px]">
          <CaseLabel id={id} label="Related projects" />
          <HomeLink
            hash="#clients"
            className="text-[14px] leading-[20px] text-muted transition-colors duration-150 hover:text-accent | md:text-[15px] md:leading-[21px]"
          >
            All client work →
          </HomeLink>
        </div>
        <ul className="mt-fl-32/40 flex flex-col gap-fl-24/40">
          {items.map((item) => {
            const external = item.href.startsWith("http");
            const title = (
              <span className="text-fl-44/101 leading-[0.85] font-semibold tracking-[-0.045em] transition-colors duration-150 group-hover:text-accent">
                {item.title}
              </span>
            );
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  {...(external && {
                    target: "_blank",
                    rel: "noopener noreferrer",
                  })}
                  className="group flex flex-col gap-[10px] | md:flex-row md:items-end md:justify-between md:gap-[24px]"
                >
                  {/* only a case page has a hero title to morph into */}
                  {external ? (
                    title
                  ) : (
                    <ProjectMorph slug={item.slug} part="title">
                      {title}
                    </ProjectMorph>
                  )}
                  <span className="font-mono text-[12px] leading-[16px] text-text-3 | md:text-[13px] md:leading-[17px] md:whitespace-nowrap">
                    {item.meta} {external ? "↗" : "→"}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </Reveal>
    </section>
  );
}
