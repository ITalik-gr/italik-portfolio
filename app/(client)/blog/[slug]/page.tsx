import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Markdown } from "@/components/blog/Markdown";
import { Contact } from "@/components/sections/Contact";
import { Cta } from "@/components/sections/Cta";
import { JsonLd } from "@/components/seo/JsonLd";
import { TextLink } from "@/components/ui/TextLink";
import { getPost, getPostPages, getPosts } from "@/lib/content";
import { formatDate, formatTag } from "@/lib/format";
import { postJsonLd } from "@/lib/seo";
import { SITE } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return getPostPages().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const post = getPost((await params).slug);
  if (!post) return {};

  const title = `${post.title} · ${SITE.name}`;
  const url = `/blog/${post.slug}`;
  return {
    title,
    description: post.summary,
    alternates: {
      canonical: post.canonical ?? url,
      types: { "application/rss+xml": "/blog/rss.xml" },
    },
    // a draft only exists in `pnpm dev`, but it must never be indexed by accident
    ...(post.draft && { robots: { index: false } }),
    openGraph: {
      url,
      siteName: "italik.dev",
      type: "article",
      locale: "en_US",
      title,
      description: post.summary,
      publishedTime: post.date,
      authors: [SITE.name],
      tags: post.tags,
    },
    twitter: { card: "summary_large_image", title, description: post.summary },
  };
}

export default async function PostPage({ params }: PageProps<"/blog/[slug]">) {
  const post = getPost((await params).slug);
  if (!post) notFound();
  // the index exists only once something is published
  const hasIndex = getPosts().length > 0;

  return (
    <>
      <main id="main">
        <JsonLd data={postJsonLd(post)} />
        <article aria-labelledby="post-title" className="px-gutter pt-fl-56/120">
          <p className="flex flex-wrap gap-x-[16px] gap-y-[6px] font-mono text-[13px] leading-[18px] text-muted">
            {post.draft && <span className="text-accent">Draft</span>}
            <time dateTime={post.date}>{formatDate(post.date)}</time>
            {post.tags.map((tag) => (
              <span key={tag}>{formatTag(tag)}</span>
            ))}
          </p>
          <h1
            id="post-title"
            className="mt-fl-16/24 max-w-[16em] text-fl-40/96 leading-[0.92] font-semibold tracking-[-0.04em]"
          >
            {post.title}
          </h1>
          <p className="mt-fl-20/32 max-w-[720px] text-fl-18/24 leading-[1.4] tracking-[-0.01em] text-text-3">
            {post.summary}
          </p>
          <div className="mt-fl-40/72 border-t border-line pt-fl-32/48">
            <Markdown source={post.body} />
          </div>
          {hasIndex && (
            <TextLink href="/blog" className="mt-fl-40/56">
              All articles
            </TextLink>
          )}
        </article>
        <Cta />
      </main>
      <Contact audience="client" />
    </>
  );
}
