import { ABOUT, ASK, HERO, SITE } from "./site";

// one home page, three angles: each profile overrides only what changes for that kind of role
export const HOME_SECTION_KEYS = [
  "featured",
  "lab",
  "nowBuilding",
  "clientWork",
  "experience",
  "about",
  "ask",
  "skills",
] as const;
export type HomeSectionKey = (typeof HOME_SECTION_KEYS)[number];

export type Profile = {
  slug: "ai" | "frontend" | "fullstack";
  path: string;
  meta: { title: string; description: string };
  hero: {
    title: string;
    lines: readonly string[];
    sub: string;
  };
  stack: readonly string[];
  sections: readonly HomeSectionKey[];
  // featured projects in order; keyIdea fills in for projects that have none of their own
  featured?: readonly { slug: string; keyIdea?: string }[];
  skillsOrder?: readonly string[];
  about: readonly string[];
  askChips: readonly string[];
};

const AI: Profile = {
  slug: "ai",
  path: "/",
  meta: SITE.meta,
  hero: HERO,
  stack: HERO.stack,
  sections: [
    "featured",
    "lab",
    "experience",
    "clientWork",
    "about",
    "ask",
    "nowBuilding",
    "skills",
  ],
  about: ABOUT,
  askChips: ASK.chips,
};

const FRONTEND: Profile = {
  slug: "frontend",
  path: "/frontend",
  meta: {
    title: "Vitaliy Hrytsenko — Front-end developer (React, Next.js, Astro)",
    description:
      "Front-end developer who turns Figma into fast, pixel-perfect sites and apps with React, Next.js and Astro. 30+ shipped, Core Web Vitals and SEO included.",
  },
  hero: {
    title: "Every pixel, every ms.",
    lines: ["Every pixel,", "every ms."],
    sub: "Front-end developer. React, Next.js, Astro. Pixel-perfect to the design, fast in Core Web Vitals, 30+ shipped.",
  },
  stack: [
    "TypeScript",
    "React",
    "Next.js",
    "Astro",
    "Tailwind CSS",
    "GSAP",
    "Figma",
    "Core Web Vitals",
  ],
  sections: ["featured", "clientWork", "experience", "about", "lab", "ask", "skills"],
  featured: [
    { slug: "ppc-io", keyIdea: "One front-end, 22 months, two home rebuilds." },
    { slug: "sollas-co", keyIdea: "Figma to deploy, then every redesign since." },
  ],
  skillsOrder: [
    "Frontend",
    "Quality",
    "Integrations & CMS",
    "Tools",
    "Backend",
    "Data",
    "Cloud & infra",
    "AI",
  ],
  about: [
    ABOUT[0],
    "I care about the details on the front end: layouts that match Figma to the pixel, animation that feels right, and pages that load fast and rank. For two years I shipped 1–2 marketing sites a week for an agency, and I still maintain sites I first built in 2024. When a product needs AI, I can build that too.",
    ABOUT[2],
    "Next, I want to own the front end of a product or a site that matters to a team. Full-time, contract or part-time all work for me.",
  ],
  askChips: [
    "Is he a fit for a front-end role?",
    "How fast can he ship a site from Figma?",
    "What has he built with Next.js and Astro?",
    "Where is he based and how does he work?",
  ],
};

const FULLSTACK: Profile = {
  slug: "fullstack",
  path: "/fullstack",
  meta: {
    title: "Vitaliy Hrytsenko — Full-stack developer (React, Node.js, Cloudflare)",
    description:
      "Full-stack developer who owns features end to end: React and Next.js on the front, Node.js, Cloudflare Workers, PostgreSQL and Stripe on the back, AI where it helps.",
  },
  hero: {
    title: "I build products end to end",
    lines: ["I build", "products", "end to end"],
    sub: "Full-stack developer. React and Next.js on the front, Node.js and NestJS on the back, and AI features when a product needs them.",
  },
  stack: [
    "TypeScript",
    "React",
    "Next.js",
    "Node.js",
    "NestJS",
    "PostgreSQL",
    "Cloudflare Workers",
    "Stripe",
  ],
  sections: [
    "featured",
    "experience",
    "clientWork",
    "lab",
    "nowBuilding",
    "about",
    "ask",
    "skills",
  ],
  featured: [
    { slug: "money-track" },
    { slug: "answerly", keyIdea: "Sole developer: chat, auth and Stripe payouts." },
  ],
  skillsOrder: [
    "Backend",
    "Frontend",
    "Data",
    "Cloud & infra",
    "Integrations & CMS",
    "AI",
    "Quality",
    "Tools",
  ],
  about: [
    ABOUT[0],
    "I work on both halves: the schema, the API, the payments and the interface. I was the only developer on Answerly, from real-time chat to Stripe payouts, and I run my own products on Cloudflare Workers, with each user's data in its own Durable Object. AI goes in where it actually helps.",
    ABOUT[2],
    "Next, I want to own features end to end in a product team. Full-time, contract or part-time all work for me.",
  ],
  askChips: [
    "Is he a fit for a full-stack role?",
    "What back-end work has he shipped?",
    "How did he build Answerly's payments?",
    "Where is he based and how does he work?",
  ],
};

export const PROFILES = { ai: AI, frontend: FRONTEND, fullstack: FULLSTACK } as const;
// the role pages; "/" stays the AI profile
export const ROLE_PROFILES = [FRONTEND, FULLSTACK] as const;

export function getRoleProfile(slug: string) {
  return ROLE_PROFILES.find((profile) => profile.slug === slug);
}
