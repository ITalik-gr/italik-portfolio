---
title: sollas.co
slug: sollas-co
kind: client
show: [clients]
caseStudy: true
order: 11
status: live
tags: [marketing-site]
typeLabel: Client · agency site
via: Sollas
summary: A fast, animated site with case studies and a lead form, selling design services to Web3 and SaaS startups.
role: "Sole developer: Figma to deploy, then redesigns, a framework migration and SEO"
# TODO: team (designers)
timeline: 2024–2026
stack: [Next.js, React, TypeScript, Tailwind CSS, GSAP, Vercel]
links:
  live: https://sollas.co
frameUrl: sollas.co
cover: /work/sollas/hero-screen.png
coverMobile: /work/sollas/mobile-hero.png
gallery:
  - { kind: desktop, label: Case study page, url: sollas.co/cases/unhosted, src: /work/sollas/www.sollas.co_cases_unhosted.png }
  - { kind: mobile, label: Hero, src: /work/sollas/mobile-hero.png }
  - { kind: mobile, label: Numbers, src: /work/sollas/mobile-section.png }
  - { kind: desktop, label: Testimonials and process, url: sollas.co, src: /work/sollas/sections.png }
highlights:
  - title: Spam-resistant contact form
    text: "The email route checks origin, a honeypot, minimum fill time and a per-IP rate limit, and escapes all HTML."
  - title: Data-driven case studies
    text: One dynamic route renders every case from a JSON file; the sitemap is generated from the same files, so no case goes missing.
  - title: SEO checks in the workflow
    text: "Scripts for on-site checks, JSON-LD validation, PageSpeed and CrUX, post-deploy verification and IndexNow, plus a changelog tying changes to results."
outcome:
  - { value: ~2.5y, label: Of builds and redesigns }
  - { value: "182", label: Commits }
  - { value: "1", label: Template for every case }
---

## Brief

Sollas is a UI/UX design agency serving Web3, SaaS, AI and fintech startups. It needed a site that shows the quality of its design work and turns visitors into enquiries, with case studies, a booking flow and a free-audit request form.

## What I did

I built the site from Figma in Next.js, then rebuilt it in 2026 as a redesign with Tailwind 4, GSAP scroll animations and Lenis smooth scrolling. I migrated it to Next.js 16 and turned the case pages into one JSON-driven template.

I added an email route with spam protection and a newsletter signup to Beehiiv, set up AVIF/WebP images with long caching, and cleaned up metadata, schema and accessibility.

I keep maintaining it: security patches, SEO fixes and design changes.
