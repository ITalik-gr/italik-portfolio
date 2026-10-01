import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { KeyNumbers } from "@/components/blog/article/KeyNumbers";
import { PostAuthor } from "@/components/blog/article/PostAuthor";
import { PostMeta } from "@/components/blog/article/PostMeta";
import { PostProject } from "@/components/blog/article/PostProject";
import { PostRelated } from "@/components/blog/article/PostRelated";
import { PostTitle } from "@/components/blog/article/PostTitle";
import { PostTocBar, PostTocRail } from "@/components/blog/article/PostToc";
import { ReadingProgress } from "@/components/blog/article/ReadingProgress";
import { Markdown } from "@/components/blog/Markdown";
import { Contact } from "@/components/sections/Contact";
import { Cta } from "@/components/sections/Cta";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  getPost,
  getPostNeighbours,
  getPostPages,
  getPosts,
  getRelatedPosts,
  toPostCard,
} from "@/lib/content";
import { getToc, parseMarkdown, readingMinutes, slugify } from "@/lib/markdown";
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
  const toc = getToc(parseMarkdown(post.body));
  const { prev, next } = getPostNeighbours(post);
  const firstTag = post.tags[0];

  return (
    <>
      <ReadingProgress />
      <main id="main">
        <JsonLd data={postJsonLd(post)} />
        {toc.length > 0 && <PostTocBar items={toc} />}
        {/* 1fr · 700 · 1fr from xl (780 from 2xl): the text centred, the contents in the right margin */}
        <div className="items-start px-gutter | xl:grid xl:grid-cols-[minmax(0,1fr)_700px_minmax(0,1fr)] xl:gap-x-[48px] | 2xl:grid-cols-[minmax(0,1fr)_780px_minmax(0,1fr)]">
          <article aria-labelledby="post-title" className="mx-auto w-full max-w-[700px] pt-fl-32/72 | xl:col-start-2 | 2xl:max-w-[780px]">
            <nav
              aria-label="Breadcrumb"
              className="flex gap-[10px] font-mono text-[12px] tracking-[0.06em] text-muted uppercase"
            >
              {post.draft && <span className="text-accent">Draft</span>}
              {hasIndex ? (
                <Link href="/blog" className="text-text transition-colors duration-150 hover:text-accent">
                  Blog
                </Link>
              ) : (
                <span className="text-text">Blog</span>
              )}
              {firstTag && (
                <>
                  <span aria-hidden>/</span>
                  <Link href={`/blog?tag=${slugify(firstTag)}`} className="transition-colors duration-150 hover:text-accent">
                    {firstTag}
                  </Link>
                </>
              )}
            </nav>
            <PostTitle id="post-title" text={post.title} />
            <p className="text-fl-18/22 leading-[1.45] tracking-[-0.01em] text-pretty text-text-3">{post.summary}</p>
            <PostMeta post={post} minutes={readingMinutes(post.body)} />
            <KeyNumbers keys={post.keys} />
            <div className="mt-fl-48/72">
              <Markdown source={post.body} />
            </div>
            <PostProject slug={post.project} only={post.projectLinks} />
            <PostAuthor slug={post.slug} />
          </article>
          {toc.length > 0 && (
            <aside className="hidden self-stretch justify-self-end pt-[72px] | xl:block">
              <PostTocRail items={toc} />
            </aside>
          )}
        </div>
        <PostRelated
          related={getRelatedPosts(post).map(toPostCard)}
          prev={prev && toPostCard(prev)}
          next={next && toPostCard(next)}
        />
        <Cta />
      </main>
      <Contact audience="client" />
    </>
  );
}
