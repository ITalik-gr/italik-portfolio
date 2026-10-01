import type { MetadataRoute } from "next";
import { getCaseStudies, getPosts } from "@/lib/content";
import { ROLE_PROFILES } from "@/lib/profiles";
import { siteUrl } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getPosts();
  return [
    { url: siteUrl, changeFrequency: "weekly", priority: 1 },
    { url: `${siteUrl}/services`, changeFrequency: "monthly", priority: 0.9 },
    ...ROLE_PROFILES.map((profile) => ({
      url: `${siteUrl}${profile.path}`,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    })),
    ...getCaseStudies().map((project) => ({
      url: `${siteUrl}/work/${project.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    // the blog appears only with its first published article
    ...(posts.length > 0
      ? [{ url: `${siteUrl}/blog`, changeFrequency: "weekly" as const, priority: 0.8 }]
      : []),
    ...posts.map((post) => ({
      url: `${siteUrl}/blog/${post.slug}`,
      lastModified: post.date,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
