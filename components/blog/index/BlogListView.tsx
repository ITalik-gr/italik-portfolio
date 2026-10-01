import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import { blogHref, selectPosts, usedTags, type BlogQuery } from "@/lib/blog-filter";
import type { PostCardData } from "@/lib/schemas";
import { BLOG, SITE } from "@/lib/site";
import { cn } from "@/lib/utils";
import { PostCard } from "../PostCard";
import { FeaturedPost } from "./FeaturedPost";

type Props = { posts: PostCardData[]; query: BlogQuery };

const MONO = "font-mono text-[12px] tracking-[0.06em] uppercase";

// filters, the featured post, the card grid and pages; every control is a link, so it works without JS
export function BlogListView({ posts, query }: Props) {
  const { total, pages, page, featured, rest } = selectPosts(posts, query);
  const tags = usedTags(posts);
  const audiences = [
    { key: null, label: "All" },
    { key: "founders" as const, label: BLOG.audiences.founders },
    { key: "developers" as const, label: BLOG.audiences.developers },
  ];

  return (
    <>
      <div className="mt-fl-32/64 flex flex-col gap-[16px]">
        <div className="flex flex-wrap items-center justify-between gap-[12px] border-t border-zone-line pt-[16px]">
          {BLOG.showAudience ? (
            <div className={cn(MONO, "flex gap-[18px] text-[13px] | md:gap-[28px]")}>
              {audiences.map((audience) => {
                const on = query.audience === audience.key;
                return (
                  <Link
                    key={audience.label}
                    href={blogHref({ tag: query.tag, audience: audience.key })}
                    scroll={false}
                    aria-current={on ? "page" : undefined}
                    className={cn("flex min-h-[44px] items-center gap-[8px] transition-colors", on ? "text-accent" : "text-muted hover:text-text")}
                  >
                    <span className={cn("size-[6px] rounded-full", on ? "bg-accent" : "bg-transparent")} />
                    {audience.label}
                  </Link>
                );
              })}
            </div>
          ) : (
            <span />
          )}
          <span className={cn(MONO, "text-muted")}>{total === 1 ? "1 post" : `${total} posts`}</span>
        </div>
        {tags.length > 0 && (
          // phones: one row that scrolls sideways
          <div className="flex gap-[8px] overflow-x-auto [scrollbar-width:none] | md:flex-wrap">
            {tags.map((tag) => {
              const on = query.tag === tag.slug;
              return (
                <Link
                  key={tag.slug}
                  href={blogHref({ audience: query.audience, tag: on ? null : tag.slug })}
                  scroll={false}
                  aria-current={on ? "page" : undefined}
                  className={cn(
                    "flex min-h-[40px] shrink-0 items-center gap-[8px] border px-[14px] text-[15px] font-medium whitespace-nowrap transition-colors duration-200",
                    on ? "border-accent text-accent" : "border-line text-text-2 hover:border-muted",
                  )}
                >
                  {tag.name}
                  {on && <span className="font-mono text-[12px]">×</span>}
                </Link>
              );
            })}
          </div>
        )}
      </div>

      <div className="mt-fl-28/40">
        {total === 0 ? (
          <div className="flex flex-col items-start gap-[20px] border-t border-zone-line pt-fl-48/96 pb-fl-24/48">
            <span className={cn(MONO, "text-muted")}>0 posts</span>
            <p className="max-w-[900px] text-fl-36/64 leading-none font-semibold tracking-[-0.045em] text-balance">
              {query.tag ? `Nothing tagged ${tags.find((tag) => tag.slug === query.tag)?.name ?? query.tag} yet.` : "No posts for this audience yet."}
            </p>
            <p className="max-w-[520px] text-[18px] leading-[1.5] text-text-3">
              Try another tag, or follow along to see new posts as they land.
            </p>
            <Link
              href="/blog"
              className={cn(MONO, "mt-[12px] bg-text px-[22px] py-[16px] text-[13px] text-bg transition-colors hover:bg-accent")}
            >
              ← All posts
            </Link>
          </div>
        ) : (
          <>
            {featured && <FeaturedPost post={featured} />}
            {rest.length > 0 && (
              <Reveal className="mt-fl-48/96 grid gap-x-[24px] gap-y-fl-48/72 | md:grid-cols-2 | lg:grid-cols-3">
                {rest.map((post, index) => (
                  // phones stack the cards: a hairline marks where one ends and the next begins
                  <PostCard
                    key={post.slug}
                    post={post}
                    position={index + 1}
                    className="border-t border-zone-line pt-[24px] | md:border-t-0 md:pt-0"
                  />
                ))}
              </Reveal>
            )}
          </>
        )}

        {pages > 1 && (
          <nav aria-label="Pages" className="mt-fl-32/56 flex items-center justify-between font-mono text-[14px] tracking-[0.06em] uppercase">
            <PageLink href={page > 1 ? blogHref({ ...query, page: page - 1 }) : undefined}>← Prev</PageLink>
            <span className="flex gap-[4px]">
              {Array.from({ length: pages }, (_, index) => index + 1).map((n) => (
                <Link
                  key={n}
                  href={blogHref({ ...query, page: n })}
                  aria-current={n === page ? "page" : undefined}
                  className={cn("flex size-[44px] items-center justify-center", n === page ? "text-accent" : "text-muted hover:text-text")}
                >
                  {n}
                </Link>
              ))}
            </span>
            <PageLink href={page < pages ? blogHref({ ...query, page: page + 1 }) : undefined}>Next →</PageLink>
          </nav>
        )}

        {/* a hairline above, so on phones the last card's tags don't run into the links */}
        <div className={cn(MONO, "mt-fl-40/56 flex flex-wrap gap-[32px] border-t border-zone-line pt-[20px] normal-case text-muted")}>
          <a href="/blog/rss.xml" className="transition-colors hover:text-accent">
            RSS ↗
          </a>
          <a href={SITE.socials.x} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-accent">
            Follow on X @italikdev ↗
          </a>
        </div>
      </div>
    </>
  );
}

function PageLink({ href, children }: { href?: string; children: string }) {
  return href ? (
    <Link href={href} className="flex min-h-[44px] items-center text-text hover:text-accent">
      {children}
    </Link>
  ) : (
    <span aria-disabled className="flex min-h-[44px] items-center text-line-strong">
      {children}
    </span>
  );
}
