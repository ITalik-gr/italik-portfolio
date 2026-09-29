type Skill = { name: string; verified: boolean };
type SkillGroup = { label: string; items: Skill[] };

const ok = (...names: string[]): Skill[] => names.map((name) => ({ name, verified: true }));
const unverified = (...names: string[]): Skill[] =>
  names.map((name) => ({ name, verified: false }));

// unverified skills stay here but never render until confirmed
const SKILL_GROUPS: SkillGroup[] = [
  {
    label: "AI",
    items: [
      ...ok(
        "LLM API integration (Anthropic, xAI Grok)",
        "agent harnesses & tool use",
        "MCP servers",
        "prompt design",
        "Claude Code (custom skills & workflows)",
        // backed by the case studies: Money Track, the site chat, Job Radar, the Telegram bot
        "structured outputs",
        "prompt caching",
        "evals",
        "embeddings (Vectorize)",
      ),
    ],
  },
  {
    label: "Frontend",
    items: ok(
      "TypeScript",
      "React",
      "Next.js",
      "Astro",
      "Tailwind CSS",
      "Redux",
      "MobX",
      "TanStack Query",
      "Zod",
      "shadcn/ui",
      "Radix UI",
    ),
  },
  {
    label: "Backend",
    items: ok("Node.js", "NestJS", "Express", "Hono", "REST APIs", "JWT auth", "webhooks"),
  },
  {
    label: "Data",
    items: [
      ...ok("PostgreSQL", "Prisma", "MongoDB", "Cloudflare D1", "Supabase", "Firebase"),
    ],
  },
  {
    label: "Cloud & infra",
    items: [...ok("Cloudflare Workers", "Durable Objects", "Vercel"), ...unverified("Docker")],
  },
  {
    label: "Integrations & CMS",
    items: ok("Stripe (Checkout, Connect)", "Strapi", "WordPress", "third-party APIs"),
  },
  {
    label: "Quality",
    // Playwright runs this site's e2e tests; Vitest is still unconfirmed
    items: [...ok("Core Web Vitals", "SEO", "Playwright"), ...unverified("Vitest")],
  },
  { label: "Tools", items: ok("Git/GitHub", "Figma", "Vite", "Chrome DevTools") },
];

export function getSkillGroups() {
  return SKILL_GROUPS.map((group) => ({
    label: group.label,
    items: group.items.filter((skill) => skill.verified).map((skill) => skill.name),
  }));
}

export const MORE_PROJECTS = {
  caption: "+25 marketing sites for agency clients",
  items: [
    { name: "Bold", category: "Agency site + our work", href: "https://www.boldgrp.io" },
    { name: "Axioma Search", category: "Marketing site", href: "https://www.axiomasearch.com" },
    {
      name: "Birch Rose Associates",
      category: "Marketing site",
      href: "https://www.birchroseassociates.co.uk",
    },
    { name: "Lechley", category: "Marketing site", href: "https://www.lechley.com" },
    { name: "Thor Companies", category: "Marketing site", href: "https://www.thor-companies.com" },
    {
      name: "The HOTH",
      category: "WordPress pages · via Sollas",
      href: "https://www.thehoth.com",
    },
    {
      name: "Authority Builders",
      category: "WordPress pages · via Sollas",
      href: "https://authority.builders",
    },
  ],
} as const;
