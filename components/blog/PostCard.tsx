import Link from "next/link";
import { formatDate } from "@/lib/format";
import type { PostCardData } from "@/lib/schemas";
import { BLOG } from "@/lib/site";
import { cn } from "@/lib/utils";
import { AudienceLabel } from "./article/PostMeta";
import { PostCover } from "./PostCover";

// cover, meta, title, summary; on hover the cover leans in and the title turns accent
// position: where the card sat in its list, sent with the post_open event
type Props = { post: PostCardData; summary?: boolean; className?: string; position?: number };

export function PostCard({ post, summary = true, className, position }: Props) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      data-track-position={position}
      className={cn("group flex min-w-0 flex-col gap-[16px]", className)}
    >
      <PostCover
        post={post}
        sizes="(min-width: 1024px) 33vw, 100vw"
        className="transition-transform duration-600 ease-out-expo group-hover:scale-[1.015]"
      />
      <span className="flex items-center justify-between gap-[12px] font-mono text-[11px] tracking-[0.06em] text-muted uppercase">
        {BLOG.showAudience && <AudienceLabel audience={post.audience} />}
        <span>
          {formatDate(post.date)} · {post.minutes} min
        </span>
      </span>
      <span className="text-fl-24/26 leading-[1.1] font-medium tracking-[-0.03em] text-pretty transition-colors duration-250 group-hover:text-accent">
        {post.title}
      </span>
      {summary && <span className="text-[16px] leading-[1.5] text-pretty text-text-3">{post.summary}</span>}
      {post.tags.length > 0 && (
        <span className="flex flex-wrap gap-[12px] font-mono text-[11px] tracking-[0.06em] text-muted uppercase">
          {post.tags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </span>
      )}
    </Link>
  );
}
