# Knowledge base: about Vitaliy (for the AI chat)

## Identity
- Vitaliy Hrytsenko, goes by Italik.
- Full-stack developer who builds AI agents and LLM-powered products, with a strong front-end background.
- Based in Kyiv, Ukraine. Kyiv time: UTC+2 in winter, UTC+3 in summer.
- 3+ years of commercial experience (since March 2023); 30+ websites and apps shipped.
- Contact: italik.gr@gmail.com · Telegram @ITalik_gr · GitHub github.com/ITalik-gr · X @italikdev. CV: /cv.pdf
- He doesn't use LinkedIn; email or Telegram is the best way to reach him.

## What he's looking for
- Remote roles: full-time, contract or part-time. Office or hybrid in Kyiv also works.
- Target roles: AI Engineer, Full-stack Developer (AI), Product Engineer; strong front-end roles too.
- Most interested in: AI agents and LLM features inside real products, owning features end to end, product-focused teams.
- Why he's looking: his recent roles have been contracts, and he wants stable, long-term work with one team.

## Availability and logistics
- Can start within a few days.
- Hours: flexible; he can commit as many hours per week as the role needs.
- Time zones: full overlap with Europe. He can work until 22:00 Kyiv time, which gives about 6 hours of overlap with the US East Coast (until roughly 3 pm ET).
- Relocation: open to moving within Ukraine, for example to Lviv.
- Contracts: can work B2B as a Ukrainian sole proprietor (FOP); setting it up takes a few days.
- Salary and rates are not discussed in the chat; visitors should write to him directly.

## Strengths
- Takes products from Figma to production on his own and is comfortable being the only developer. Has also worked in teams of up to 20 people.
- Front-end: React, Next.js, Astro, TypeScript; pixel-perfect, fast, animated interfaces; Core Web Vitals and SEO.
- Back-end, and where he used it:
  - Node.js, Firebase, Stripe Checkout and Connect: Answerly, where he was the sole developer (realtime chat, auth, payments, payouts, webhooks).
  - Cloudflare Workers, Durable Objects, D1, Hono: Money Track (per-user data isolation with Durable Objects, D1 as the shared directory of users, shared rates and OAuth clients, bank sync through Monobank webhooks).
  - Cloudflare Workers, D1, grammY: the AI Telegram Assistant.
  - Strapi as a headless CMS: ppc.io and the Backlinks site.
  - PostgreSQL and Express in client work at Sollas; NestJS in his personal back-end projects.
- AI: puts LLMs into real products (Anthropic API, xAI Grok API) and builds agent harnesses.
- Reliable AI features: he makes sure the model can't invent data. In Money Track a deterministic core owns every number, and validation blocks any figure the model didn't take from the canonical SQL. His rule: an instruction to the model is not a guarantee; a check is.
- Fast delivery: shipped 1–2 marketing sites a week for two years at an agency.

## Learning and adaptability
- Picks up new technologies quickly and learns them by shipping real work with them.
- Cloudflare: learned Workers, D1 and Durable Objects on his own products, then used Workers for client deployments.
- ppc.io: built the site on Astro + Strapi, then migrated the content to Astro content collections, which removed an external dependency, sped up builds and typed the content at build time.
- Stripe: implemented Checkout and Connect (payments, payouts, webhooks) for Answerly.
- Tools he hasn't used in production yet (for example Redis, Docker Compose, GitHub Actions) are a short ramp-up for him, not a blocker.

## How he works
- Remote and async-first: clear written updates, asks questions early, shows work in progress.
- Used to working with designers, project managers and the client's developers; Figma handoff is his normal flow.
- Prefers logic, data and product work over pure layout.
- Tools: Git and GitHub, Figma, Vercel, Cloudflare, Jira, Linear, Notion.

## How he works with AI agents
- Uses Claude Code every day and treats the agent as a teammate he manages: discuss the task, break it into steps, let the agent track progress, then review and verify the result instead of trusting it.
- Can build features with an agent end to end or write the code himself. He writes specs (CLAUDE.md) that split what he writes by hand (schema, core logic, permissions) from what he delegates (UI scaffolding, forms, seed data).
- Hands repetitive work to agents, uses skills and plugins, and runs code review on everything an agent produces.
- Built his own skills: a front-end code-review skill with severity tiers, and SEO pre- and post-deploy checks for sollas.co.
- Builds agents himself: harnesses from scratch in TypeScript on Node.js, Hono or NestJS, with tools, subagents, memory and human-in-the-loop steps, no framework required. He can also work with popular agent frameworks when a project uses them.

## Experience
- **Sollas**, Full-Stack Developer (Contract), 10/2023 – present, remote. A design agency. Web apps and marketing sites end to end with Next.js, React, TypeScript, Astro + Strapi, Node.js, PostgreSQL, Firebase, Stripe and Cloudflare Workers. Projects: ppc.io (built the front-end solo and migrated it from Strapi to MDX content collections himself; evolved it for about 22 months, his main long-running project), sollas.co (Figma to deploy, owns its SEO with automated pre- and post-deploy checks), Answerly (sole developer), the Backlinks site (sole developer, end to end, including the Strapi setup; no design work), the linkbuilder.io front-end (built solo, then took part in the client's migration to another stack), a real-time crypto/finance dashboard under NDA (front-end: live charts and bot management, Next.js + TypeScript), and WordPress pages for The HOTH and Authority Builders.
- **Metamorfosi Agency (client: Bold, UK)**, Front-End Developer (Contract), 06/2024 – 05/2026, remote. 25+ responsive marketing and landing sites for Bold's UK clients as part of a team, 1–2 production sites a week, pixel-perfect from Figma across breakpoints. Wrote reusable HTML, PostCSS and JavaScript that the back-end team integrated into WordPress; also worked on Bold's own agency site.
- **Freelance Front-End Developer**, 03/2023 – 10/2023, remote. Front-ends, forms and landing pages for client websites; sped up and SEO-optimized existing sites; set up and customized WordPress where needed.
- The Sollas and Metamorfosi contracts ran in parallel for about two years.

## Stack and years
Years of experience with each technology overall, not strictly commercial time.
- JavaScript, HTML, CSS, SASS/SCSS, Git: 3.5 years
- React: 3 years
- TypeScript, Next.js: 2.5 years
- Astro, Node.js, Express, PostgreSQL: 2 years
- NestJS, TanStack Query: 1.5 years
- AI/LLM integration, Claude Code: 1 year
- Also: Redux, MobX, Zod, Tailwind, shadcn/ui, Radix UI, REST APIs, JWT auth, webhooks, WebSockets, Prisma, MongoDB, Supabase, Firebase, Cloudflare Workers, D1, Durable Objects, KV, Hono, Strapi, WordPress, Stripe (Checkout + Connect), Figma, Vite, Vercel, grammY, xAI Grok API, Anthropic API, Storybook, Sentry, basic Docker, basic PHP.

## Projects at a glance
Full details are in each project's file; these lines are only a quick reference.
- **Money Track**: AI personal-finance tracker; a deterministic core owns the numbers and the LLM advises. React, TypeScript, Cloudflare Workers, Durable Objects, D1, Hono, Anthropic API, RTK Query, PWA. Open source. Live demo with a demo account: money.italik.dev/demo · code: github.com/ITalik-gr/money-track
- **Lottie Theme**: turns dark Lottie animations into light ones and back, without After Effects. One core with four shells: a browser editor, a CLI, an MCP server with 12 tools, and a live editor–agent bridge; all published to npm. Open source, 231 tests plus browser and agent end-to-end checks. lottie.italik.dev · code: github.com/ITalik-gr/lottie-theme
- **Quiz Dock (agent harness)**: discuss a document with an agent and get quizzed on it; the model writes the questions, code grades them. Hand-written agent loop in TypeScript on the raw Anthropic SDK, no framework. The CLI works; a web version is in progress, then subagents for multi-page docs. Code: github.com/ITalik-gr/quiz-dock
- **Job Radar**: his own job-search tool: at most 10 vacancies a day, free code filters before any model call, Haiku extracts facts as strict JSON, code does the scoring. He picks every company and sends every letter himself; the tool only drafts a first paragraph that code validates. Code: github.com/ITalik-gr/job-radar
- **AI Telegram Assistant**: serverless bot for group chats (TypeScript, Cloudflare Workers, grammY, D1, xAI Grok API). Keeps recent messages raw, compacts older ones into rolling summaries, keeps memory per member and assembles context for each question. Code: github.com/ITalik-gr/tg_chat_bot. v1 runs in a live chat; v2 is a full rewrite: voice messages, and a new model setup that picks a fast, cheap model where it's enough.
- **This site's AI chat**: Next.js Route Handler, Anthropic API, Upstash rate limiting.
- **Client work**: ppc.io (Astro, Strapi → content collections), sollas.co (Next.js, built solo apart from the design, plus SEO), Answerly (React, Node.js, Firebase, Stripe; sole developer; no live version anymore), Backlinks site (Next.js + Strapi, sole developer; demo at backlinks-dun.vercel.app), a crypto/finance dashboard under NDA (Next.js, front-end), Metamorfosi/Bold marketing sites.

## Honest limits
- Python: understands the syntax and can read it; hasn't used it commercially.
- Test coverage: basic unit and integration tests (Jest in commercial work); no commercial E2E testing yet.
- Not used commercially yet: AWS, GCP, Azure, Kubernetes, GraphQL, Angular, .NET, CI/CD pipelines, RAG and vector databases (he used embeddings with Cloudflare Vectorize for memory recall in his own Telegram bot).
- React Native / Expo: some hands-on experience, no shipped app.

## Languages
- Ukrainian (native), English (B2). Works in English every day in writing and takes calls in English.

## Education
- Master's in History Education (in progress). Details are in the CV.

## FAQ
- Q: Can he start soon? A: Yes, within a few days.
- Q: Does he know Python? A: He understands the syntax and can read it, but his commercial work is in TypeScript and JavaScript.
- Q: Has he worked in a team? A: Yes. He has worked in teams of up to 20 people, including the agency team for Bold and with designers and client developers at Sollas. He has also been the sole developer on several products.
- Q: Can he own a project alone? A: Yes. Answerly, sollas.co and the Backlinks site were built solo, from Figma to deploy. On ppc.io he owned the whole front-end for about 22 months and did the Strapi-to-MDX migration himself while other people handled content and other parts.
- Q: Has he shipped AI features? A: Yes, in his own live products: Money Track's LLM advisor, the AI Telegram Assistant, and this chat.
- Q: How does he use AI for coding? A: Claude Code every day with his own skills. He plans the work with the agent, delegates the repetitive parts, and reviews and verifies everything it produces.
- Q: Does he write tests? A: Yes. His own projects are well tested: Job Radar has 726 tests, Money Track 232 plus golden analytics snapshots, Lottie Theme 231 plus browser and agent end-to-end checks, and this site runs Playwright end-to-end tests. In commercial work he writes unit and integration tests with Jest.
- Q: Is he open to front-end-only roles? A: Yes, although his focus is full-stack and AI.
- Q: Office or remote? A: Remote first; office or hybrid in Kyiv also works, and he is open to moving within Ukraine.
- Q: Can he work on a B2B contract? A: Yes, as a Ukrainian sole proprietor (FOP), which he can set up within a few days.
- Q: Why is he looking for a new role? A: His recent roles have been contracts, and he wants stable, long-term work with one team.
- Q: Why AI? A: He sees it as where software is heading. It makes things possible that weren't a couple of years ago, and he enjoys making AI features reliable, not just impressive.

## Do not discuss
- Salary or rates, personal life, health, family, military matters, politics.
- Client names, data or screenshots of NDA projects beyond the public description.
- Links to backlinks.com, linkbuilder.io or the NDA project.