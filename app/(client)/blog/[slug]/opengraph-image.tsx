import { notFound } from "next/navigation";
import { OG_ACCENT, OG_SIZE, OG_TEXT, renderOgCard } from "@/components/og/OgCard";
import { getPost, getPostPages } from "@/lib/content";
import { formatDate } from "@/lib/format";
import { SITE } from "@/lib/site";

export const alt = `Article by ${SITE.name}`;
export const size = OG_SIZE;
export const contentType = "image/png";

export function generateStaticParams() {
  return getPostPages().map((post) => ({ slug: post.slug }));
}

// long titles wrap, so the size steps down with length instead of fitting one line
const titleSize = (title: string) => (title.length > 40 ? 84 : title.length > 24 ? 104 : 128);

// splits the title into lines of roughly equal length, the card takes one entry per line
function toLines(title: string, size: number) {
  const perLine = Math.floor(1056 / (size * 0.5));
  const lines: string[] = [];
  for (const word of title.split(" ")) {
    const last = lines.at(-1);
    if (last && `${last} ${word}`.length <= perLine) lines[lines.length - 1] = `${last} ${word}`;
    else lines.push(word);
  }
  return lines;
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const post = getPost((await params).slug);
  if (!post) notFound();
  const size = titleSize(post.title);

  return renderOgCard({
    kicker: (
      <div style={{ display: "flex", gap: 16 }}>
        <div style={{ color: OG_ACCENT }}>Article</div>
        <div style={{ color: OG_TEXT }}>{formatDate(post.date)}</div>
      </div>
    ),
    lines: toLines(post.title, size),
    titleSize: size,
    lead: post.summary,
    path: `/blog/${post.slug}`,
  });
}
