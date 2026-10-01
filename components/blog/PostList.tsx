import Link from "next/link";
import { formatDate } from "@/lib/format";
import type { Post } from "@/lib/schemas";

// one row per article: date, title, the one-line summary
export function PostList({ posts }: { posts: Post[] }) {
  return (
    <ul className="flex flex-col">
      {posts.map((post) => (
        <li key={post.slug} className="border-t border-line">
          <Link
            href={`/blog/${post.slug}`}
            className="group grid gap-[10px] py-fl-24/36 | lg:grid-cols-[2fr_7fr_3fr] lg:items-baseline lg:gap-[40px]"
          >
            <time dateTime={post.date} className="font-mono text-[13px] leading-[18px] text-muted">
              {formatDate(post.date)}
            </time>
            <span className="text-fl-24/40 leading-[1.05] font-semibold tracking-[-0.03em] transition-colors duration-150 group-hover:text-accent">
              {post.title}
            </span>
            <span className="text-fl-16/17 leading-[1.5] text-text-3">{post.summary}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
