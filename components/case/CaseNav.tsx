import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import { ProjectMorph } from "@/components/motion/ProjectMorph";
import { cn } from "@/lib/utils";

type Item = { slug: string; title: string; href: string };
type Props = { prev?: Item; next?: Item };

export function CaseNav({ prev, next }: Props) {
  return (
    <nav aria-label="More projects" className="mt-fl-96/180 border-t border-line">
      <Reveal className="grid | md:grid-cols-2">
        {prev && <NavLink item={prev} label="← Previous" />}
        {next && (
          <NavLink
            item={next}
            label="Next →"
            className="border-t border-line | md:col-start-2 md:border-t-0 md:border-l md:text-right"
          />
        )}
      </Reveal>
    </nav>
  );
}

function NavLink({ item, label, className }: { item: Item; label: string; className?: string }) {
  const external = item.href.startsWith("http");

  return (
    <Link
      href={item.href}
      {...(external && { target: "_blank", rel: "noopener noreferrer" })}
      className={cn("group block px-gutter py-[32px] | md:py-[40px]", className)}
    >
      <span className="font-mono text-[12px] leading-[16px] tracking-[0.06em] text-muted uppercase">
        {label}
      </span>
      <ProjectMorph slug={item.slug} part="title">
        <span className="mt-[16px] block text-fl-44/86 leading-[0.85] font-bold tracking-[-0.05em] font-stretch-[88%] transition-colors duration-150 group-hover:text-accent">
          {item.title}
        </span>
      </ProjectMorph>
    </Link>
  );
}
