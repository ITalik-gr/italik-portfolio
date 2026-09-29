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

export const NAV = [
  { label: "Work", href: "/#work" },
  { label: "Experience", href: "/#experience" },
  { label: "About", href: "/#about" },
  { label: "Ask AI", href: "/#ask" },
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

export const SECTIONS = {
  featured: { number: "01", label: "Featured", title: "Featured", meta: undefined },
  lab: { number: "02", label: "Lab", title: "Lab", meta: "Personal projects & agents" },
  nowBuilding: {
    number: "03",
    label: "Now building",
    title: "Now building",
    meta: "Work in progress",
  },
  clientWork: {
    number: "04",
    label: "Client work",
    title: "Client work",
    meta: "Via Sollas · Metamorfosi · Freelance",
  },
  experience: { number: "05", label: "Experience", title: "Experience", meta: "3+ yrs · remote" },
  about: { number: "06", label: "About", title: "About", meta: "Kyiv, Ukraine" },
  ask: { number: "07", label: "Ask AI", title: "Ask my AI about me", meta: "Live demo" },
  skills: { number: "08", label: "Skills", title: "Skills", meta: "By area" },
  contact: { number: "09", label: "Contact", title: "Say hello", meta: "" },
} as const;

export const ABOUT = [
  "Hi, I'm Vitaliy, or just Italik. I'm a full-stack developer from Kyiv who's been shipping for the web for 3+ years, taking products from a Figma file all the way to production.",
  "Websites have surrounded me for as long as I can remember, and what hooked me is simple: you build something and you see it working, live, for anyone.",
  "Now I'm focused on AI, because it's where software is heading and it opens up things that weren't possible to build a couple of years ago. I build agents from scratch, wire LLMs into real products, and make sure they stay honest about the data.",
  "I enjoy owning a feature from idea to something that actually ships. I work remotely from Kyiv, alongside designers and, where there are any, the client's own developers, and I'm happy to own the whole stack or slot into an existing team.",
  "I'm looking for full-time or contract roles in AI engineering or full-stack development.",
] as const;

export const ASK = {
  title: "Ask my AI about me",
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
