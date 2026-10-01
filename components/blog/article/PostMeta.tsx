import Link from "next/link";
import { formatDate } from "@/lib/format";
import { slugify } from "@/lib/markdown";
import type { Post } from "@/lib/schemas";
import { BLOG } from "@/lib/site";

// date · read time · audience · tags, in the mono meta style
export function PostMeta({ post, minutes }: { post: Post; minutes: number }) {
  const parts = [
    <time key="date" dateTime={post.date}>
      {formatDate(post.date)}
    </time>,
    <span key="read">{minutes} min read</span>,
    ...(BLOG.showAudience
      ? [<AudienceLabel key="audience" audience={post.audience} />]
      : []),
  ];

  return (
    <div className="mt-[28px] flex flex-wrap items-center gap-x-[14px] gap-y-[8px] font-mono text-[12px] tracking-[0.06em] text-muted uppercase">
      {parts.flatMap((part, index) => (index > 0 ? [<span key={`dot-${index}`}>·</span>, part] : [part]))}
      {post.tags.length > 0 && <span>·</span>}
      {post.tags.map((tag) => (
        <Link key={tag} href={`/blog?tag=${slugify(tag)}`} className="transition-colors duration-150 hover:text-accent">
          {tag}
        </Link>
      ))}
    </div>
  );
}

export function AudienceLabel({ audience }: { audience: Post["audience"] }) {
  return (
    <span className="border border-line-strong px-[8px] py-[4px] text-text-2">{BLOG.audiences[audience]}</span>
  );
}
