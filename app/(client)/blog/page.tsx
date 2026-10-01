import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PostList } from "@/components/blog/PostList";
import { Contact } from "@/components/sections/Contact";
import { Cta } from "@/components/sections/Cta";
import { getPosts } from "@/lib/content";
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
  const posts = getPosts();
  // no published article, no blog
  if (posts.length === 0) notFound();

  return (
    <>
      <main id="main">
        <section aria-labelledby="blog-title" className="px-gutter pt-fl-56/120">
          <p className="text-[14px] leading-[20px] text-accent | md:text-[15px] md:leading-[21px]">
            {BLOG.kicker}
          </p>
          <h1
            id="blog-title"
            className="mt-fl-16/24 font-display text-fl-56/144 leading-[0.85] font-semibold tracking-[-0.045em]"
          >
            {BLOG.title}
          </h1>
          <p className="mt-fl-16/24 max-w-[600px] text-fl-17/24 leading-[1.35] tracking-[-0.01em] text-text-3">
            {BLOG.sub}
          </p>
          <div className="mt-fl-40/72">
            <PostList posts={posts} />
          </div>
        </section>
        <Cta />
      </main>
      <Contact audience="client" />
    </>
  );
}
