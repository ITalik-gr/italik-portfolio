import Link from "next/link";
import type { PointerEvent, ReactNode } from "react";
import { ProjectCover } from "@/components/ui/ProjectCover";
import { Status } from "@/components/ui/Status";
import { cn } from "@/lib/utils";
import type { LabItem } from "./LabList";

type Props = {
  item: LabItem;
  index: number;
  dimmed: boolean;
  onActivate: () => void;
};

// touch taps also fire pointerenter; only a real mouse should switch the preview
const onMouseOnly = (handler: () => void) => (event: PointerEvent) => {
  if (event.pointerType === "mouse") handler();
};

export function LabRow({ item, index, dimmed, onActivate }: Props) {
  const external = item.href?.startsWith("http");
  const textClass = "flex min-w-0 flex-col gap-[8px] | lg:w-fit lg:max-w-full lg:gap-[14px]";

  const text = (
    <>
      <p className="flex flex-wrap items-center gap-x-[18px] gap-y-[4px] font-mono text-[10px] leading-[13px] tracking-[0.06em] text-muted uppercase | md:text-[12px] md:leading-[16px]">
        <span className="hidden | lg:inline">{String(index + 1).padStart(2, "0")}</span>
        <Status
          status={item.status}
          tone="neutral"
          className="text-[10px] leading-[13px] | md:text-[12px] md:leading-[16px]"
        />
        <span>{item.tags.join(" · ")}</span>
      </p>
      <h3
        className={cn(
          "text-fl-36/75 leading-[0.9] font-bold tracking-[-0.05em] font-stretch-[88%] transition-colors duration-300",
          dimmed && "lg:text-line-strong",
        )}
      >
        {item.title}
      </h3>
      <p className="text-[14px] leading-[1.45] text-text-3 | md:hidden">{item.summary}</p>
      <p className="hidden max-w-[620px] text-[18px] leading-[1.45] text-text-3 | md:block">
        {item.description}
      </p>
      {item.stack.length > 0 && (
        <p className="hidden font-mono text-[12px] leading-[16px] text-muted | lg:block">
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
      >
        {text}
      </Link>
    );
  }

  return (
    <li className="grid items-start gap-[16px] py-[24px] | md:grid-cols-[1fr_minmax(0,300px)] md:gap-[24px] | lg:grid-cols-1 lg:pt-[32px] lg:pb-[40px]">
      {body}
      <ProjectCover label={item.title} className="| lg:hidden" />
    </li>
  );
}
