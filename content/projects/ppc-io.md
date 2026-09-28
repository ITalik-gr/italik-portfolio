---
title: ppc.io
slug: ppc-io
kind: client
show: [clients]
caseStudy: true
draft: true
order: 10
status: live
tags: [marketing-site]
typeLabel: Client · marketing site
via: Sollas
summary: A multi-page marketing site for a PPC tool company, with collections of AI agents and tools that the team keeps adding to.
role: "Sole developer: Figma to deploy, then long-term maintenance (~1.5 years)"
timeline: ~1.5 years
stack: [Astro, Strapi CMS → Astro content collections]
links:
  live: https://ppc.io
frameUrl: ppc.io
# TODO: screenshots (src) for the gallery
gallery:
  - { kind: desktop, label: Agents collection, url: ppc.io/agents }
  - { kind: mobile, label: Home }
  - { kind: mobile, label: Tool page }
  - { kind: desktop, label: Tool template, url: "ppc.io/tools/[slug]" }
highlights:
  - title: Strapi → content collections
    text: The migration removed an external CMS dependency and made builds faster.
  - title: Templated collections
    text: New agents and tools pages ship without a developer.
outcome:
  - { value: "~10", label: Pages + 2 dynamic templates }
  - { value: 1.5y, label: Maintained solo }
  # TODO: Lighthouse / build time before → after
---

## Brief

A multi-page marketing site for a PPC tool company, with collections of AI agents and tools that the team keeps adding to.

## What I did

Built the complete site single-handedly (~10 pages plus 2 dynamic templates for the agents and tools collections). Maintained and evolved it as the main long-running project. Migrated content from Strapi CMS to Astro content collections.
