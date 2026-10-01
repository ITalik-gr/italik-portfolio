import Link from "next/link";
import type { PostCardData } from "@/lib/schemas";
import { cn } from "@/lib/utils";
import { PostCard } from "../PostCard";

type Props = { related: PostCardData[]; prev?: PostCardData; next?: PostCardData };

// related posts and the older / newer neighbours; each part drops out when there's nothing to show
export function PostRelated({ related, prev, next }: Props) {
  if (related.length === 0 && !prev && !next) return null;

  return (
    <section aria-labelledby="related-title" className="mt-fl-96/160 px-gutter">
      {related.length > 0 && (
        <>
          <div className="flex justify-between border-t border-zone-line pt-[20px] font-mono text-[12px] tracking-[0.06em] text-muted uppercase">
            <h2 id="related-title" className="text-text">
              Related posts
            </h2>
            <Link href="/blog" className="transition-colors duration-150 hover:text-accent">
              All posts →
            </Link>
          </div>
          <div className="mt-[32px] grid gap-[24px] | lg:grid-cols-3">
            {related.map((post, index) => (
              <PostCard key={post.slug} post={post} summary={false} position={index + 1} />
            ))}
          </div>
        </>
      )}
      {(prev || next) && (
        <nav
          aria-label="More posts"
          className="mt-fl-48/72 grid border-y border-zone-line | md:grid-cols-2"
        >
          {prev ? <Neighbour post={prev} label="← Previous" /> : <span />}
          {next && <Neighbour post={next} label="Next →" end />}
        </nav>
      )}
    </section>
  );
}

function Neighbour({ post, label, end }: { post: PostCardData; label: string; end?: boolean }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className={cn(
        "group flex flex-col gap-[14px] py-[32px]",
        end
          ? "border-t border-zone-line | md:items-end md:border-t-0 md:border-l md:pl-[24px] md:text-right"
          : "md:pr-[24px]",
      )}
    >
      <span className="font-mono text-[12px] tracking-[0.06em] text-muted uppercase">{label}</span>
      <span className="text-fl-26/40 leading-none font-semibold tracking-[-0.04em] text-balance transition-colors duration-250 group-hover:text-accent">
        {post.title}
      </span>
    </Link>
  );
}
