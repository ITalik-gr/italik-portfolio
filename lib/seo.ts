import type { Profile } from "./profiles";
import type { Project } from "./schemas";
import { SITE } from "./site";

export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? SITE.url).replace(/\/$/, "");

const person = {
  "@type": "Person",
  "@id": `${siteUrl}/#person`,
  name: SITE.name,
  alternateName: SITE.handle,
  url: siteUrl,
  jobTitle: "Full-stack developer",
  description: SITE.meta.description,
  email: `mailto:${SITE.email}`,
  address: {
    "@type": "PostalAddress",
    addressLocality: SITE.location.city,
    addressCountry: "UA",
  },
  sameAs: Object.values(SITE.socials),
  knowsAbout: [
    "AI agents",
    "LLM integration",
    "React",
    "Next.js",
    "TypeScript",
    "Node.js",
    "Cloudflare Workers",
  ],
};

// every home page is a profile of the same person; role pages differ only in the page node
export function homeJsonLd(profile: Profile) {
  const url = profile.path === "/" ? siteUrl : `${siteUrl}${profile.path}`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      person,
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: "italik.dev",
        author: { "@id": person["@id"] },
      },
      {
        "@type": "ProfilePage",
        "@id": `${url}#page`,
        url,
        name: profile.meta.title,
        description: profile.meta.description,
        isPartOf: { "@id": `${siteUrl}/#website` },
        mainEntity: { "@id": person["@id"] },
      },
    ],
  };
}

export function caseJsonLd(project: Project) {
  const url = `${siteUrl}/work/${project.slug}`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CreativeWork",
        "@id": `${url}#work`,
        url,
        name: project.title,
        headline: `${project.title}: case study`,
        description: project.description ?? project.summary,
        keywords: project.stack.join(", "),
        creator: person,
        ...(project.cover && { image: `${siteUrl}${project.cover}` }),
        ...(project.links.code && !project.hideLinks && { codeRepository: project.links.code }),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
          { "@type": "ListItem", position: 2, name: project.title, item: url },
        ],
      },
    ],
  };
}
