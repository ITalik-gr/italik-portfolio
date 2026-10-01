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
    x: "https://x.com/italikdev",
    // no LinkedIn yet; add it here when it exists
  },
  // who he is, for any audience: JSON-LD Person and llms.txt
  description:
    "Full-stack developer in Kyiv. Builds AI inside real products and whole products solo, with React, Next.js, Node.js and Cloudflare.",
} as const;

export type Audience = "client" | "employer";

// localStorage key for the last home page seen; read by the nav, the CV, the chat and analytics
export const HOME_KEY = "italik:home";

// every home page and who it's for; only employer pages hand out a CV.
// case pages follow the home page the visitor came from, a direct visit counts as "/"
export const HOMES: Record<string, { audience: Audience; cv?: string }> = {
  "/": { audience: "client" },
  "/ai": { audience: "employer", cv: SITE.cv },
  "/frontend": { audience: "employer", cv: "/cv/Vitaliy_Hrytsenko_Frontend.pdf" },
  "/fullstack": { audience: "employer", cv: "/cv/Vitaliy_Hrytsenko_Fullstack.pdf" },
};

// client pages that aren't home pages: they never remember a home and never show a CV
export const CLIENT_PAGES = ["/services", "/blog"];
export const isClientPage = (pathname: string) =>
  CLIENT_PAGES.some((page) => pathname === page || pathname.startsWith(`${page}/`));

// anchors point at home page sections; elsewhere NavLink sends them to the right home page.
// samePage: the section is on every page with this nav (the contact footer), so the anchor stays as is
export type NavItem = { label: string; href: string; samePage?: boolean };

// employers get no Services on purpose: they shouldn't read "he takes clients"; it lives in the footers
export const NAV: Record<Audience, readonly NavItem[]> = {
  client: [
    { label: "Work", href: "#work" },
    { label: "Services", href: "/services" },
    { label: "Blog", href: "/blog" },
    { label: "About", href: "#about" },
    { label: "Contact", href: "#contact", samePage: true },
  ],
  employer: [
    { label: "Work", href: "#work" },
    { label: "Experience", href: "#experience" },
    { label: "About", href: "#about" },
    { label: "Ask AI", href: "#ask" },
  ],
};

// the employer portfolio linked from client pages: old links in applications and CVs land on "/"
export const HIRING = { label: "Hiring? See my developer portfolio", href: "/ai" } as const;

// clients don't care what time it is in Kyiv; they care how fast I answer
export const REPLY_NOTE = "Replies the same day";

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

export const BLOG = {
  title: "Blog",
  // flip on once both audiences have posts: the switch on /blog and the labels on cards and articles
  showAudience: false,
  audiences: { founders: "For founders", developers: "For developers" },
  author:
    "Vitaliy Hrytsenko, full-stack developer building AI products. Solo, from decision to production.",
  perPage: 9,
  sub: "How I solve problems in real products: what didn't work, what did, and the numbers.",
  meta: {
    title: "Blog · Vitaliy Hrytsenko",
    description:
      "Articles by Vitaliy Hrytsenko on building AI features and products: the problem, what didn't work, the fix and the numbers.",
  },
} as const;

export const FOOTER = {
  credit: "Designed & built by Vitaliy with Next.js",
  copyright: "© 2026 · italik.dev",
} as const;
