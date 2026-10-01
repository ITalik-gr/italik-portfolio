import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { BlogList } from "@/components/blog/index/BlogList";
import { BlogListView } from "@/components/blog/index/BlogListView";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { Contact } from "@/components/sections/Contact";
import { Cta } from "@/components/sections/Cta";
import { getPosts, toPostCard } from "@/lib/content";
import { BLOG } from "@/lib/site";

const { title, description } = BLOG.meta;

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/blog", types: { "application/rss+xml": "/blog/rss.xml" } },
  openGraph: { url: "/blog", siteName: "italik.dev", type: "website", locale: "en_US", title, description },
  twitter: { card: "summary_large_image", title, description },
};

export default function BlogPage() {
  const posts = getPosts().map(toPostCard);
  // no published article, no blog
  if (posts.length === 0) notFound();
  const unfiltered = { tag: null, audience: null, page: 1 };

  return (
    <>
      <main id="main">
        <section aria-labelledby="blog-title" className="px-gutter">
          <div className="grid items-end gap-[16px] pt-fl-40/96 | md:grid-cols-[minmax(0,1fr)_minmax(0,560px)] md:gap-[40px]">
            <SplitHeading
              id="blog-title"
              text={BLOG.title}
              className="text-fl-64/112 leading-[0.88] font-semibold tracking-[-0.055em]"
            />
            <p className="max-w-[560px] text-fl-18/22 leading-[1.4] tracking-[-0.01em] text-pretty text-text-3">
              {BLOG.sub}
            </p>
          </div>
          {/* the server renders the unfiltered list; ?tag= and ?page= are applied once the browser reads the URL */}
          <Suspense fallback={<BlogListView posts={posts} query={unfiltered} />}>
            <BlogList posts={posts} />
          </Suspense>
        </section>
        <Cta />
      </main>
      <Contact audience="client" />
    </>
  );
}
