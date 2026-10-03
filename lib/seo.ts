import type { Profile } from "./profiles";
import type { Post, Project } from "./schemas";
import { SERVICES, SERVICES_PAGE, SERVICE_FAQ } from "./services";
import { HOMES, SITE } from "./site";

export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? SITE.url).replace(/\/$/, "");

const person = {
  "@type": "Person",
  "@id": `${siteUrl}/#person`,
  name: SITE.name,
  alternateName: SITE.handle,
  url: siteUrl,
  jobTitle: "Full-stack developer",
  description: SITE.description,
  image: `${siteUrl}/about.jpg`,
  email: `mailto:${SITE.email}`,
  knowsLanguage: ["en", "uk"],
  address: {
    "@type": "PostalAddress",
    addressLocality: SITE.location.city,
    addressCountry: "UA",
  },
  sameAs: Object.values(SITE.socials),
  knowsAbout: [
    "AI agents",
    "LLM integration",
    "MCP servers",
    "Anthropic API",
    "Full-stack web development",
    "React",
    "Next.js",
    "Astro",
    "TypeScript",
    "Node.js",
    "NestJS",
    "Cloudflare Workers",
  ],
};

// every home page is about the same person; the client home points at the services,
// the employer pages are profiles of the person
export function homeJsonLd(profile: Profile) {
  const url = profile.path === "/" ? siteUrl : `${siteUrl}${profile.path}`;
  const forClients = HOMES[profile.path]?.audience === "client";
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
        "@type": forClients ? "WebPage" : "ProfilePage",
        "@id": `${url}#page`,
        url,
        name: profile.meta.title,
        description: profile.meta.description,
        isPartOf: { "@id": `${siteUrl}/#website` },
        ...(forClients
          ? { about: { "@id": `${siteUrl}/services#service` }, author: { "@id": person["@id"] } }
          : { mainEntity: { "@id": person["@id"] } }),
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

// an opengraph-image inside a route group is served at a hashed path; same djb2 as Next, checked by tests/e2e/seo.spec.ts
function ogImageUrl(url: string, segmentDir: string) {
  let hash = 5381;
  for (const char of segmentDir) hash = ((hash << 5) + hash + char.charCodeAt(0)) & 0xffffffff;
  return `${url}/opengraph-image-${(hash >>> 0).toString(36).slice(0, 6)}`;
}

// a post has only a date; Google wants a full datetime with an offset, so it's midnight in Kyiv
export function kyivDateTime(date: string) {
  const offset = new Intl.DateTimeFormat("en-US", {
    timeZone: SITE.location.timeZone,
    timeZoneName: "longOffset",
  })
    .formatToParts(new Date(`${date}T12:00:00Z`))
    .find((part) => part.type === "timeZoneName")!
    .value.replace("GMT", "");
  return `${date}T00:00:00${offset || "+00:00"}`;
}

export function postJsonLd(post: Post) {
  const url = `${siteUrl}/blog/${post.slug}`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        "@id": `${url}#post`,
        url,
        mainEntityOfPage: url,
        headline: post.title,
        description: post.summary,
        datePublished: kyivDateTime(post.date),
        author: person,
        publisher: { "@id": person["@id"] },
        image: ogImageUrl(url, "/(client)/blog/[slug]"),
        keywords: post.tags.join(", "),
        inLanguage: "en",
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
          { "@type": "ListItem", position: 2, name: "Writing", item: `${siteUrl}/blog` },
          { "@type": "ListItem", position: 3, name: post.title, item: url },
        ],
      },
    ],
  };
}

// client work: what he offers (no prices, rates are on request) plus the FAQ as structured answers
export function servicesJsonLd() {
  const url = `${siteUrl}/services`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ProfessionalService",
        "@id": `${url}#service`,
        url,
        name: `${SITE.name}, development services`,
        description: SERVICES_PAGE.meta.description,
        provider: { "@id": person["@id"] },
        founder: person,
        areaServed: "Worldwide",
        address: person.address,
        email: SITE.email,
        image: ogImageUrl(url, "/(client)/services"),
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Services",
          itemListElement: SERVICES.map((service) => ({
            "@type": "Offer",
            itemOffered: { "@type": "Service", name: service.title, description: service.text },
          })),
        },
      },
      {
        "@type": "FAQPage",
        "@id": `${url}#faq`,
        mainEntity: SERVICE_FAQ.map((item) => ({
          "@type": "Question",
          name: item.q,
          acceptedAnswer: { "@type": "Answer", text: item.a },
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
          { "@type": "ListItem", position: 2, name: "Services", item: url },
        ],
      },
    ],
  };
}
