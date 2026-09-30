import type { MetadataRoute } from "next";
import { getCaseStudies } from "@/lib/content";
import { ROLE_PROFILES } from "@/lib/profiles";
import { siteUrl } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
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
  ];
}
