import { slugify } from "./markdown";
import type { PostCardData } from "./schemas";
import { BLOG } from "./site";

export type Audience = PostCardData["audience"];
export type BlogQuery = { tag: string | null; audience: Audience | null; page: number };

// /blog?tag=evals&audience=founders&page=2, read the same way on the server (defaults) and in the browser
export function parseBlogQuery(params: { get(name: string): string | null }): BlogQuery {
  const audience = params.get("audience");
  const page = Number(params.get("page"));
  return {
    tag: params.get("tag"),
    audience: BLOG.showAudience && (audience === "founders" || audience === "developers") ? audience : null,
    page: Number.isInteger(page) && page > 1 ? page : 1,
  };
}

export function blogHref({ tag, audience, page }: Partial<BlogQuery>) {
  const params = new URLSearchParams();
  if (audience) params.set("audience", audience);
  if (tag) params.set("tag", tag);
  if (page && page > 1) params.set("page", String(page));
  const query = params.toString();
  return query ? `/blog?${query}` : "/blog";
}

// the tags that are actually used, most used first; a chip for a tag with no posts would lead nowhere
export function usedTags(posts: PostCardData[]) {
  const counts = new Map<string, number>();
  for (const post of posts) for (const tag of post.tags) counts.set(tag, (counts.get(tag) ?? 0) + 1);
  return [...counts.entries()].sort((a, b) => b[1] - a[1]).map(([name]) => ({ name, slug: slugify(name) }));
}

// featured = newest post in the current filter, page 1 only; BLOG.perPage posts a page including it
export function selectPosts(posts: PostCardData[], query: BlogQuery) {
  const list = posts.filter(
    (post) =>
      (!query.audience || post.audience === query.audience) &&
      (!query.tag || post.tags.some((tag) => slugify(tag) === query.tag)),
  );
  const pages = Math.max(1, Math.ceil(list.length / BLOG.perPage));
  const page = Math.min(query.page, pages);
  const items = list.slice((page - 1) * BLOG.perPage, page * BLOG.perPage);
  const featured = page === 1 ? items[0] : undefined;
  return { total: list.length, pages, page, featured, rest: featured ? items.slice(1) : items };
}
