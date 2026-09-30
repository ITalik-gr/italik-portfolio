// /services: client work, next to the hiring-focused home pages. No prices on purpose: rates are on request.
export const SERVICES_PAGE = {
  title: "AI features and web apps, built and shipped",
  sub: "I take your product from idea to production: AI agents inside your app, full-stack web apps and fast marketing sites. Remote from Kyiv, on European hours.",
  cta: "Tell me about your project",
  mailSubject: "Project enquiry",
  meta: {
    title: "Services: AI agents, full-stack apps and sites · Vitaliy Hrytsenko",
    description:
      "Hire Vitaliy Hrytsenko to build AI agents and LLM features, full-stack web apps and MVPs, or fast marketing sites. Remote from Kyiv, NDA on request, you own the code.",
  },
} as const;

export const SERVICES = [
  {
    title: "AI agents & LLM features",
    text: "An agent or AI feature inside your product: tool use, MCP servers, answers grounded in your own data, and evals and cost limits so it stays reliable once real users arrive.",
    proof: ["money-track", "lottie-theme", "tg-assistant", "ask-about-me-chat"],
  },
  {
    title: "Full-stack web apps & MVPs",
    text: "React and Next.js on the front, Node.js and NestJS on the back, with auth, payments and deployment. One developer from the first screen to launch.",
    proof: ["answerly", "money-track"],
  },
  {
    title: "Marketing sites",
    text: "Fast, animated sites in Next.js or Astro, pixel-perfect to your Figma, with a CMS your team can edit. Core Web Vitals and SEO included.",
    proof: ["ppc-io", "sollas-co", "backlinks"],
  },
] as const;

export const SERVICE_FACTS = [
  { value: "3+", label: "years shipping for the web" },
  { value: "30+", label: "sites and apps shipped" },
  { value: "22", label: "months evolving one client product" },
  { value: "Solo", label: "from design hand-off to production" },
] as const;

export const SERVICE_STEPS = [
  { title: "Intro call", text: "A short call about the product, the people who use it and the deadline." },
  {
    title: "Scope and estimate",
    text: "A written scope with milestones and an estimate. Rates on request.",
  },
  {
    title: "Build",
    text: "Weekly demos and a short written report every week, with more detail whenever you ask.",
  },
  {
    title: "Launch and support",
    text: "Deploy and handover, then a month of free support. After that, support by agreement or by the hour.",
  },
] as const;

export const SERVICE_FORMATS = ["Fixed-scope project", "Monthly contract", "Hourly or part-time"] as const;

export const SERVICE_TERMS = [
  "Everything stays yours: code, repositories, accounts and data",
  "NDA on request",
  "B2B contract as a Ukrainian sole proprietor",
  "Can start within a few days",
  "Full overlap with Europe, about 6 hours with the US East Coast",
] as const;

export const SERVICE_FAQ = [
  {
    q: "How much does it cost?",
    a: "It depends on the scope. Write to me with what you need, and I'll send an estimate.",
  },
  { q: "Can you sign an NDA?", a: "Yes, before we discuss the details." },
  {
    q: "Who owns the code?",
    a: "You do. The code, repositories, accounts and data are yours from the first day.",
  },
  {
    q: "What happens after launch?",
    a: "The first month of support is free. After that, we agree on ongoing support or I work by the hour.",
  },
  {
    q: "How will I know how it's going?",
    a: "A demo and a short written report every week, and a more detailed report whenever you ask for one.",
  },
] as const;
