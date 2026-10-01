"use client";

import { useSearchParams } from "next/navigation";
import { parseBlogQuery } from "@/lib/blog-filter";
import type { PostCardData } from "@/lib/schemas";
import { BlogListView } from "./BlogListView";

// the page is static; the filter in the URL is applied in the browser
export function BlogList({ posts }: { posts: PostCardData[] }) {
  return <BlogListView posts={posts} query={parseBlogQuery(useSearchParams())} />;
}
