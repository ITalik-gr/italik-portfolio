export const SITE = {
  name: "Vitaliy Hrytsenko",
  handle: "Italik",
  monogram: "VH",
  roleLine: "Full-stack developer · AI agents & integrations",
  url: "https://www.italik.dev",
  location: { city: "Kyiv", country: "Ukraine", timeZone: "Europe/Kyiv" },
  openTo: ["full-time", "contract", "part-time"],
  email: "italik.gr@gmail.com",
  cv: "/cv.pdf",
  socials: {
    telegram: "https://t.me/ITalik_gr",
    github: "https://github.com/ITalik-gr",
    // no LinkedIn yet; add it here when it exists
  },
  meta: {
    title: "Vitaliy Hrytsenko — Full-stack developer building AI agents",
    description:
      "Full-stack developer building AI agents and LLM-powered products, from the agent loop to the interface. React, Next.js, Node.js, Cloudflare.",
  },
} as const;

// each home page hands out its own CV; case pages use the one of the home page the visitor came from
export const CV_BY_HOME: Record<string, string> = {
  "/": SITE.cv,
  "/frontend": "/cv/Vitaliy_Hrytsenko_Frontend.pdf",
  "/fullstack": "/cv/Vitaliy_Hrytsenko_Fullstack.pdf",
};

// same-page anchors: the nav only lives on home pages, and a role page must not jump back to "/"
export const NAV = [
  { label: "Work", href: "#work" },
  { label: "Experience", href: "#experience" },
  { label: "About", href: "#about" },
  { label: "Ask AI", href: "#ask" },
] as const;

export const HERO = {
  title: "I build AI agents that ship",
  lines: ["I build", "AI agents", "that ship"],
  sub: "Full-stack developer. I design, build and ship AI agents into real products.",
  stack: [
    "TypeScript",
    "React",
    "Next.js",
    "Astro",
    "Node.js",
    "Cloudflare Workers",
    "Anthropic API",
    "MCP",
  ],
} as const;

// two heroes: a big ask-my-AI field (every home page) or a cursor trail of project screenshots (/trail, for showing the design)
export type HeroVariant = "ask" | "trail";
export const HERO_VARIANT: HeroVariant = "ask";

export const HERO_TRAIL = [
  { title: "Money Track", src: "/hero-trail/money-track.webp" },
  { title: "Lottie Theme", src: "/hero-trail/lottie-theme.webp" },
  { title: "AI Telegram Assistant", src: "/hero-trail/tg-assistant.webp" },
  { title: "ppc.io", src: "/hero-trail/ppc-io.webp" },
  { title: "sollas.co", src: "/hero-trail/sollas.webp" },
] as const;

export const HERO_QUESTIONS = [
  "Has he shipped AI to production?",
  "Can he start next week?",
  "What did he build at Sollas?",
  "Is he a fit for a full-stack AI role?",
] as const;

export const SECTIONS = {
  featured: { title: "Featured", meta: undefined },
  lab: { title: "Lab", meta: "Personal projects & agents" },
  nowBuilding: {
    title: "Now building",
    meta: "Work in progress",
  },
  clientWork: {
    title: "Client work",
    meta: "Via Sollas · Metamorfosi · Freelance",
  },
  experience: { title: "Experience", meta: "3+ yrs · remote" },
  about: { title: "About", meta: "Kyiv, Ukraine" },
  ask: { title: "Ask my AI about me", meta: "Live demo" },
  skills: { title: "Skills", meta: "By area" },
} as const;

export const ABOUT = [
  "Hi, I'm Vitaliy, or just Italik. I'm a full-stack developer from Kyiv who's been shipping for the web for 3+ years, taking products from a Figma file all the way to production.",
  "Now I focus on AI: I build agents from scratch, wire LLMs into real products and keep them honest about the data. In Money Track the model never computes a number.",
  "I enjoy owning a feature from idea to something that actually ships. I work remotely from Kyiv, alongside designers and, where there are any, the client's own developers, and I'm happy to own the whole stack or slot into an existing team.",
  "Next, I want to build AI products with a team, as an AI engineer or full-stack developer. Full-time, contract or part-time all work for me.",
] as const;

export const ASK = {
  lines: ["Ask my AI", "about me"],
  sub: "It knows my projects, experience and how I work. Ask it anything a recruiter would.",
  chips: [
    "What AI agents has he built?",
    "Is he a fit for a full-stack role?",
    "How does Money Track avoid made-up numbers?",
    "Where is he based and how does he work?",
  ],
  // v1 architecture (phase 7): the whole knowledge base sits in one cached prompt, no embeddings
  pipeline: ["content", "knowledge base", "LLM", "answer"],
  pipelineAccent: "LLM",
  howItWorks:
    "Site content and my notes are loaded into one cached prompt. The model answers only from them and cites the files it used.",
  assistantName: "Italik.ai",
  drawerTitle: "Ask AI about Vitaliy",
  channel: "Ask-italik",
  languageNote: "Answers in the language you ask",
  placeholder: "Ask anything…",
} as const;

export const FOOTER = {
  credit: "Designed & built by Vitaliy with Next.js",
  copyright: "© 2026 · italik.dev",
} as const;
