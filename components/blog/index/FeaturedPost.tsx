import Link from "next/link";
import { formatDate } from "@/lib/format";
import type { PostCardData } from "@/lib/schemas";
import { BLOG } from "@/lib/site";
import { AudienceLabel } from "../article/PostMeta";
import { PostCover } from "../PostCover";

// the newest post, full width: cover 7 / text 5, key numbers in white
export function FeaturedPost({ post }: { post: PostCardData }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      data-track-position="featured"
      className="group grid items-end gap-[20px] border-t border-zone-line pt-[24px] | md:pt-[40px] | lg:grid-cols-[minmax(0,6fr)_minmax(0,5fr)] lg:gap-[48px]"
    >
      <PostCover
        post={post}
        sizes="(min-width: 1024px) 55vw, 100vw"
        className="transition-transform duration-600 ease-out-expo group-hover:scale-[1.015]"
      />
      <div className="flex min-w-0 flex-col gap-[22px]">
        <span className="flex flex-wrap items-center gap-[14px] font-mono text-[12px] tracking-[0.06em] text-muted uppercase">
          {BLOG.showAudience && <AudienceLabel audience={post.audience} />}
          <span>
            {formatDate(post.date)} · {post.minutes} min
          </span>
        </span>
        <span className="text-fl-36/56 leading-[0.95] font-semibold tracking-[-0.045em] text-balance transition-colors duration-250 group-hover:text-accent">
          {post.title}
        </span>
        <span className="text-fl-17/20 leading-[1.45] text-pretty text-text-3">{post.summary}</span>
        {post.keys.length > 0 && (
          <div className="flex flex-wrap gap-[32px] border-t border-zone-line pt-[18px]">
            {post.keys.map((key) => (
              <span key={key.caption} className="flex flex-col gap-[6px]">
                <span className="text-[32px] leading-none font-semibold tracking-[-0.03em]">{key.value}</span>
                <span className="font-mono text-[11px] tracking-[0.06em] text-muted uppercase">{key.caption}</span>
              </span>
            ))}
          </div>
        )}
        {post.tags.length > 0 && (
          <span className="flex flex-wrap gap-[14px] font-mono text-[12px] tracking-[0.06em] text-muted uppercase">
            {post.tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </span>
        )}
      </div>
    </Link>
  );
}
