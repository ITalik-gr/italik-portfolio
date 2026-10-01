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

// short: the line on the home page; result: one proof from a case, every offer ends on it
export const SERVICES = [
  {
    title: "Build your product or MVP",
    short: "Fully solo: front end, back end, payments, deploy.",
    text: "I build the whole product myself: front end, back end, auth, payments and deploy. One person from the first screen to launch, so you don't manage a team.",
    result: "Answerly: real-time chat, auth, Stripe Checkout and Connect, payouts. Built solo.",
    proof: ["answerly", "money-track"],
  },
  {
    title: "Add AI to your product",
    short: "LLM features, agents, MCP servers, answers only from your data.",
    text: "AI features that answer only from your own data: LLM features, agents and MCP servers, with evals and cost limits so they hold up once real users arrive.",
    result: "Money Track: ~97% categorisation accuracy at ~80% lower cost.",
    proof: ["money-track", "lottie-theme", "ask-about-me-chat"],
  },
  {
    title: "Build an agent for a task",
    short: "An agent that does one job and checks its own work.",
    text: "An agent that does one specific job and checks its own work before it hands the result back to you.",
    result: "Lottie Theme: the agent recolours a file and checks the result by rendering it.",
    proof: ["lottie-theme", "job-radar"],
  },
  {
    title: "Make what you have faster and cheaper",
    short: "Speed, AI cost, reliability, SEO.",
    text: "Speed, AI cost, reliability and SEO. I find where the money and the time go and fix that first.",
    result: "AI Telegram Assistant: running cost down from $75-150 to $3-6 a month.",
    proof: ["tg-assistant", "job-radar", "ppc-io", "sollas-co"],
  },
  {
    title: "Fix what's vibe-coded",
    short: "Things that broke or can't handle load or real data.",
    text: "Code that broke, can't handle the load or falls over on real data. I find the cause and fix it in the architecture.",
    result:
      "Money Track: the model invented numbers. Every calculation moved into SQL, and a check blocks any figure the database didn't produce.",
    proof: ["money-track", "tg-assistant"],
  },
] as const;

export const HOW_I_WORK = [
  {
    title: "I learn your product myself",
    text: "The product, the users and the goal. I don't wait for a step-by-step spec.",
    proof: "ppc.io: solo for ~22 months, tools library grew from 19 to ~78.",
  },
  {
    title: "If the plan won't work, I say so",
    text: "I explain why and bring my own option. If you still want it your way, I build it and write down the risks.",
    proof:
      "Money Track: better prompts didn't stop the model inventing numbers, so I moved every calculation into SQL.",
  },
  {
    title: "I tell you what to cut",
    text: "Fewer features, faster to users.",
    proof: "Job Radar: the model only where it's needed, cost down from ~$15 to $1-2 a month.",
  },
  {
    title: "I talk in results",
    text: "Money, conversion, cost, stability.",
    proof: "AI Telegram Assistant: running cost down from $75-150 to $3-6 a month.",
  },
] as const;

// the end of a case page, for visitors from the client side
export const CASE_CTA = {
  title: "Need something like this?",
  text: "Tell me the goal. Telegram or email, I reply the same day.",
} as const;

// the section above the footer on client pages: Telegram first, email second, nothing else
export const CTA = {
  // two lines from md, where the first one fits the width
  lines: ["Have a product", "in mind?"],
  text: "Send me the goal, not a spec. Telegram or email, I reply the same day.",
} as const;

export const SERVICE_FACTS = [
  { value: "3+", label: "years shipping for the web" },
  { value: "30+", label: "sites and apps shipped" },
  { value: "22", label: "months evolving one client product" },
  { value: "Solo", label: "from design hand-off to production" },
] as const;

export const SERVICE_STEPS = [
  { title: "The goal", text: "A short call or chat: you tell me the goal, not a spec." },
  {
    title: "The plan",
    text: "I come back with what I'd build, what I'd cut and why, plus an estimate. Rates on request.",
  },
  { title: "Build", text: "I build, with a demo every week." },
  {
    title: "Launch and support",
    text: "Launch, then one month of free support. After that, support by agreement or by the hour.",
  },
] as const;

export const SERVICE_FORMATS = ["Fixed-scope project", "Monthly contract", "Hourly or part-time"] as const;

export const SERVICE_TERMS = [
  "Code, repositories, accounts and data are yours from day one",
  "NDA on request",
  "Contract and invoicing agreed before we start",
  "Can start within a few days",
  "Full overlap with Europe, about 6 hours with the US East Coast",
] as const;

export const SERVICE_FAQ = [
  {
    q: "Do I need a spec?",
    a: "No. Tell me the goal. I'll come back with what I'd build, what I'd cut and why, plus an estimate.",
  },
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
