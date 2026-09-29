---
title: Backlinks
slug: backlinks
kind: client
show: [clients]
caseStudy: true
order: 14
status: live
statusNote: my version
tags: [marketing-site]
typeLabel: Client · marketing site
via: Sollas
summary: A marketing site and blog for a link-building service, editable by the team without a developer.
role: "Sole developer: Next.js front-end and Strapi CMS"
# TODO: team (designers)
timeline: 2024 · ~6 weeks
stack: [Next.js, React, Strapi, SCSS, ConvertKit]
# only the vercel build is mine; the production domain runs an older build and is never linked
links:
  live: https://backlinks-dun.vercel.app
frameUrl: backlinks-dun.vercel.app
# blog and apply pages 404 on this build (the CMS is gone), so only the home page is shown
cover: /work/backlinks/cover.jpg
coverMobile: /work/backlinks/mobile-home.png
gallery:
  - { kind: desktop, label: Home sections, url: backlinks-dun.vercel.app, src: /work/backlinks/sections-1.png }
  - { kind: mobile, label: Home, src: /work/backlinks/mobile-home.png }
  - { kind: mobile, label: Comparison, src: /work/backlinks/mobile-section.png }
highlights:
  - title: CMS-driven page sections
    text: "Pages are lists of typed Strapi components, and one renderer maps each to a React section, so editors rearrange pages without code."
  - title: Blog with article tooling
    text: "Categories, authors, pagination, related posts, share links and an auto-built table of contents."
  - title: Validated apply form
    text: Custom inputs, client-side validation and submission of leads to ConvertKit.
outcome:
  - { value: "24", label: Section types in the CMS }
  - { value: "9", label: CMS content types }
  - { value: ~6 wk, label: Figma to finished build }
---

## Brief

Backlinks offers link building and SEO services. It needed a marketing site with a blog, an examples page and an application form for prospective clients, all editable by the team through a CMS.

## What I did

I built the front-end in Next.js (App Router) and the back-end in Strapi. In Strapi I modelled the pages, 24 reusable section components and a blog with posts, authors and categories. On the front-end, a section renderer turns the API response into pages, and I flattened Strapi's nested response format so components get plain data.

I also built the blog (pagination, category filters, related posts, sharing, a contents list from headings), SEO fields per page, and the apply form with validation and ConvertKit submission.
