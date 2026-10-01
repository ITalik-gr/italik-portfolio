import { PostList } from "@/components/blog/PostList";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { TextLink } from "@/components/ui/TextLink";
import { getPosts } from "@/lib/content";

const LATEST = 3;

// hidden until the first article is published
export function Writing() {
  const posts = getPosts();
  if (posts.length === 0) return null;

  return (
    <Section id="writing" labelledBy="writing-title">
      <SectionHeader id="writing-title" title="Writing" meta="How I solve things" />
      <div className="mt-fl-40/72">
        <PostList posts={posts.slice(0, LATEST)} />
      </div>
      {posts.length > LATEST && (
        <TextLink href="/blog" className="mt-[8px]">
          All articles
        </TextLink>
      )}
    </Section>
  );
}
