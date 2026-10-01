import Link from "next/link";
import { PostCard } from "@/components/blog/PostCard";
import { Reveal } from "@/components/motion/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { getPosts, toPostCard } from "@/lib/content";

const LATEST = 3;

// the latest articles as cards, the same ones as on /blog; hidden until the first article is published
export function Writing() {
  const posts = getPosts().slice(0, LATEST).map(toPostCard);
  if (posts.length === 0) return null;

  return (
    <Section id="writing" labelledBy="writing-title">
      <SectionHeader
        id="writing-title"
        title="Blog"
        meta={
          <Link href="/blog" className="transition-colors duration-150 hover:text-accent">
            All posts →
          </Link>
        }
      />
      <Reveal className="mt-fl-40/72 grid gap-x-[24px] gap-y-fl-48/72 | md:grid-cols-2 | lg:grid-cols-3">
        {posts.map((post, index) => (
          // phones stack the cards: a hairline marks where one ends and the next begins
          <PostCard
            key={post.slug}
            post={post}
            position={index + 1}
            className="border-t border-zone-line pt-[24px] first:border-t-0 first:pt-0 | md:border-t-0 md:pt-0"
          />
        ))}
      </Reveal>
      {/* the header's link hides on phones, so they get their own */}
      <Link
        href="/blog"
        className="mt-[32px] inline-flex font-mono text-[12px] tracking-[0.06em] text-text uppercase transition-colors hover:text-accent | md:hidden"
      >
        All posts →
      </Link>
    </Section>
  );
}
