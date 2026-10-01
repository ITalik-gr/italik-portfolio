import { getPosts } from "@/lib/content";
import { toPlainText } from "@/lib/markdown";
import { siteUrl } from "@/lib/seo";
import { BLOG, SITE } from "@/lib/site";

export const dynamic = "force-static";

const escape = (text: string) =>
  text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export function GET() {
  const posts = getPosts();
  // no published article, no feed
  if (posts.length === 0) return new Response("Not found", { status: 404 });

  const items = posts.map((post) => {
    const url = `${siteUrl}/blog/${post.slug}`;
    return `    <item>
      <title>${escape(post.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${new Date(`${post.date}T00:00:00Z`).toUTCString()}</pubDate>
      <description>${escape(post.summary)}</description>
      <content:encoded><![CDATA[${toPlainText(post.body).replace(/]]>/g, "]]]]><![CDATA[>")}]]></content:encoded>
${post.tags.map((tag) => `      <category>${escape(tag)}</category>`).join("\n")}
    </item>`;
  });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>${escape(BLOG.meta.title)}</title>
    <link>${siteUrl}/blog</link>
    <atom:link href="${siteUrl}/blog/rss.xml" rel="self" type="application/rss+xml" />
    <description>${escape(BLOG.meta.description)}</description>
    <language>en</language>
    <managingEditor>${SITE.email} (${SITE.name})</managingEditor>
    <lastBuildDate>${new Date(`${posts[0].date}T00:00:00Z`).toUTCString()}</lastBuildDate>
${items.join("\n")}
  </channel>
</rss>
`;
  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}
