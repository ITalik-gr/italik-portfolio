import Link from "next/link";
import type { PointerEvent, ReactNode } from "react";
import { ProjectMorph, claimMorph } from "@/components/motion/ProjectMorph";
import { ProjectCover } from "@/components/ui/ProjectCover";
import { ProjectTags } from "@/components/ui/ProjectTags";
import { cn } from "@/lib/utils";
import type { LabItem } from "./LabList";

type Props = {
  item: LabItem;
  dimmed: boolean;
  onActivate: () => void;
};

// touch taps also fire pointerenter; only a real mouse should switch the preview
const onMouseOnly = (handler: () => void) => (event: PointerEvent) => {
  if (event.pointerType === "mouse") handler();
};

export function LabRow({ item, dimmed, onActivate }: Props) {
  const external = item.href?.startsWith("http");
  const textClass = "flex min-w-0 flex-col gap-[8px] | lg:w-fit lg:max-w-full lg:gap-[14px]";

  const text = (
    <>
      <ProjectTags status={item.status} tags={item.tags} />
      <ProjectMorph slug={item.slug} part="title" source="lab" primary={item.shareTitle}>
        <h3
          className={cn(
            "text-fl-36/75 leading-[0.9] font-semibold tracking-[-0.045em] transition-colors duration-300",
            dimmed && "lg:text-line-strong",
          )}
        >
          {item.title}
        </h3>
      </ProjectMorph>
      <p className="text-[14px] leading-[1.45] text-text-3 | md:hidden">{item.summary}</p>
      <p className="hidden max-w-[620px] text-[18px] leading-[1.45] text-text-3 | md:block">
        {item.description}
      </p>
      {item.stack.length > 0 && (
        <p className="hidden text-[14px] leading-[20px] text-muted | lg:block">
          {item.stack.join(" · ")}
        </p>
      )}
    </>
  );

  // the hover target is the text block itself, not the empty space next to it
  let body: ReactNode = (
    <div className={textClass} onPointerEnter={onMouseOnly(onActivate)}>
      {text}
    </div>
  );
  if (item.href) {
    body = (
      <Link
        href={item.href}
        {...(external && { target: "_blank", rel: "noopener noreferrer" })}
        className={textClass}
        onPointerEnter={onMouseOnly(onActivate)}
        onFocus={onActivate}
        onClick={() => claimMorph(item.slug, "lab", isDesktop() ? "lab" : "lab-row")}
      >
        {text}
      </Link>
    );
  }

  return (
    <li className="grid items-start gap-[16px] py-[24px] | md:grid-cols-[1fr_minmax(0,300px)] md:gap-[24px] | lg:grid-cols-1 lg:pt-[32px] lg:pb-[40px]">
      {body}
      <ProjectMorph slug={item.slug} part="cover" source="lab-row" primary={false}>
        <ProjectCover
          label={item.title}
          src={item.cover}
          sizes="(min-width: 768px) 300px, 100vw"
          className="| lg:hidden"
        />
      </ProjectMorph>
    </li>
  );
}

// the side preview only exists from lg; below it the row shows its own cover
const isDesktop = () => window.matchMedia("(min-width: 1024px)").matches;
