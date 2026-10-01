---
title: ppc.io
slug: ppc-io
kind: client
show: [clients]
caseStudy: true
order: 10
status: live
tags: [marketing-site]
typeLabel: Client · marketing site
via: Sollas
summary: "A PPC agency's site and free-tools library, run solo for ~22 months: the library grew from 19 to ~78 tools."
role: "Front-end developer: design to Astro and React, then new sections, tool pages and animations"
# TODO: team (repo has 5 committers; roles unknown)
timeline: 2024–2026 · ~22 months
stack: [Astro, React, TypeScript, Tailwind CSS, MDX, Cloudflare Workers]
links:
  live: https://ppc.io
frameUrl: ppc.io
cover: /work/ppc-io/cover.jpg
gallery:
  - { kind: desktop, label: Agents page, url: ppc.io/agents, src: /work/ppc-io/agents.jpg }
  - { kind: desktop, label: Free tools library, url: ppc.io/free-tools, src: /work/ppc-io/free-tools.jpg }
  - { kind: desktop, label: AI consulting, url: ppc.io, src: /work/ppc-io/ai-consulting.jpg }
  - { kind: desktop, label: ROI calculator, url: ppc.io, src: /work/ppc-io/calculator.jpg }
highlights:
  - title: Searchable toolkit grid
    text: "A React island inside static Astro pages: search, category tabs, filtering and pagination over the tools and agents collections."
  - title: Animated sections
    text: Scroll-triggered GSAP and Lottie animations and Swiper carousels, built to keep static pages fast.
  - title: Strapi → content collections
    text: "I migrated the content from Strapi to typed Astro collections: no external CMS to run, faster builds, and a bad entry fails the build."
outcome:
  - { value: ~22 mo, label: Front-end in my hands }
  - { value: "96", label: Tool pages on one template }
  - { value: "2", label: Home page rebuilds }
  # TODO: Lighthouse / build time before → after
---

## Brief

The agency needed a site that sells its services and a free-tools library that collects email leads. I ran the front end solo for ~22 months: two home page rebuilds, 96 tool pages from one template, the content moved from Strapi into the Astro repo, and the library grew from 19 to about 78 tools.

ppc.io is a paid-search (PPC) agency. Its library holds free tools, prompts and AI agents behind an email signup.

## What I did

I turned the design into Astro components and sections: the home page, pricing, agents and toolkit pages. I rebuilt the home page twice, in 2025 and 2026, and built the agents and toolkit pages with search, filtering, pagination and scroll animations.

I migrated the content from Strapi to in-repo MDX collections validated by Zod, which removed the external CMS and sped up builds. Around that move the free-tools library grew from 19 to about 78 tools, gated behind an email signup, and I built the tool pages and card components.
