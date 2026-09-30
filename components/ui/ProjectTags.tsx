import { formatTag } from "@/lib/format";
import type { ProjectStatus } from "@/lib/schemas";
import { cn } from "@/lib/utils";
import { Status } from "./Status";

type Props = {
  status: ProjectStatus;
  tags: readonly string[];
  className?: string;
};

// the first two tags in a project's frontmatter are the ones that show
export function ProjectTags({ status, tags, className }: Props) {
  return (
    <p
      className={cn(
        "flex flex-wrap items-center gap-x-[12px] gap-y-[4px] text-[13px] leading-[18px] text-text-3 | md:text-[14px] md:leading-[20px]",
        className,
      )}
    >
      <Status status={status} />
      {tags.slice(0, 2).map((tag) => (
        <span key={tag}>{formatTag(tag)}</span>
      ))}
    </p>
  );
}
