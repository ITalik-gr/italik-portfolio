import { ABOUT, ASK, HERO, HERO_QUESTIONS } from "./site";

// one home page, several angles: "/" for founders, the role pages for employers. Each profile overrides only what changes
export const HOME_SECTION_KEYS = [
  "offers",
  "featured",
  "lab",
  "nowBuilding",
  "clientWork",
  "experience",
  "about",
  "ask",
  "skills",
  "howIWork",
] as const;
export type HomeSectionKey = (typeof HOME_SECTION_KEYS)[number];

export type Profile = {
  slug: "client" | "ai" | "frontend" | "fullstack";
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
  heroQuestions: readonly string[];
};

const CLIENT: Profile = {
  slug: "client",
  path: "/",
  meta: {
    title: "Vitaliy Hrytsenko · Solo developer for founders",
    description:
      "A solo developer for founders. I take your product from decision to production, without step-by-step specs. AI features, agents and full products. Remote from Kyiv.",
  },
  hero: {
    title: HERO.title,
    lines: HERO.lines,
    sub: "A solo developer for founders. I take it from decision to production, without step-by-step specs.",
  },
  stack: HERO.stack,
  // short on purpose: what I do, proof, how I work; no Experience or Skills for founders
  sections: ["offers", "featured", "howIWork", "about", "ask"],
  featured: [
    { slug: "money-track" },
    { slug: "answerly", keyIdea: "Sole developer: chat, auth and Stripe payouts." },
    { slug: "tg-assistant" },
  ],
  // the last paragraph of ABOUT is about looking for a role
  about: ABOUT.slice(0, 3),
  // TODO phase 6: founder questions
  askChips: [ASK.chips[0], ASK.chips[2], ASK.chips[3]],
  heroQuestions: [HERO_QUESTIONS[0], HERO_QUESTIONS[2]],
};

const AI: Profile = {
  slug: "ai",
  path: "/ai",
  meta: {
    title: "Vitaliy Hrytsenko · Full-stack developer building AI agents",
    description:
      "Full-stack developer in Kyiv building AI agents and LLM products end to end with React, Next.js, Node.js and Cloudflare. Open to remote full-time or contract work.",
  },
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
  heroQuestions: HERO_QUESTIONS,
};

const FRONTEND: Profile = {
  slug: "frontend",
  path: "/frontend",
  meta: {
    title: "Vitaliy Hrytsenko · Front-end developer (React, Next.js, Astro)",
    description:
      "Front-end developer who turns Figma into fast, pixel-perfect sites and apps with React, Next.js and Astro. 30+ shipped, Core Web Vitals and SEO included. Remote.",
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
  heroQuestions: HERO_QUESTIONS,
};

const FULLSTACK: Profile = {
  slug: "fullstack",
  path: "/fullstack",
  meta: {
    title: "Vitaliy Hrytsenko · Full-stack developer (React, Node.js, NestJS)",
    description:
      "Full-stack developer who owns features end to end: React and Next.js on the front, Node.js, NestJS and PostgreSQL on the back, AI features when a product needs them.",
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
  heroQuestions: HERO_QUESTIONS,
};

export const PROFILES = { client: CLIENT, ai: AI, frontend: FRONTEND, fullstack: FULLSTACK } as const;
// the employer pages under app/(employer)/[profile]; "/" is the client profile
export const ROLE_PROFILES = [AI, FULLSTACK, FRONTEND] as const;

export function getRoleProfile(slug: string) {
  return ROLE_PROFILES.find((profile) => profile.slug === slug);
}
