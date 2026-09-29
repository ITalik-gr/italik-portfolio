---
title: Job Radar
slug: job-radar
kind: personal
show: [lab]
caseStudy: true
order: 4
status: live
tags: [tool, llm, automation, web-app]
typeLabel: Personal · AI tool
summary: A job-search radar that shows at most 10 vacancies a day and remembers every decision.
description: A personal tool that collects vacancies and company catalogues, filters them with plain code and calls a cheap model only on new text. The score is deterministic. I pick every company and send every letter myself; the tool only drafts a first paragraph, and code checks it before I see it.
keyIdea: The model extracts facts. Code makes every decision.
role: Solo · design, front-end, back-end, AI
timeline: 2026 · ~1 month
stack: [TypeScript, Hono, Drizzle ORM, Cloudflare Workers, D1, Anthropic API, Workers AI, React, Mantine, Zod]
shipsAs: [Web app, CLI, Chrome extension, Telegram digest]
cover: /work/job-radar/cover.png
gallery:
  - { kind: desktop, label: Sources, src: /work/job-radar/sources.png }
  - { kind: desktop, label: Rules, src: /work/job-radar/rules.png }
  - { kind: desktop, label: Templates, src: /work/job-radar/templates.png }
links:
  code: https://github.com/ITalik-gr/job-radar
features:
  - title: Ten-card daily queue
    text: "A hard cap of 10 cards a day, and every decision (interesting, contacted, blocked, snoozed) removes the company from later queues."
  - title: Free filters first
    text: "Stop words, role, geography and experience checks run before any model call. Rejected vacancies are kept for statistics."
  - title: Catalogues through my browser
    text: A Chrome extension parses catalogues behind Cloudflare in my own session, paginating at a human pace with page limits.
  - title: Faster, personal letters
    text: "I choose who to write to and press send myself; drafts start from my own templates, and replies are tracked so nobody gets chased twice."
architecture:
  summary: Fetchers and normalised page diffs feed a deterministic filter chain.
  highlight: The model only extracts facts from new text as strict JSON; scoring, dedupe and sending rules are plain code.
  steps:
    - { kind: input, title: "ATS APIs, RSS, job boards", note: Chrome extension scrapes catalogues }
    - { kind: code, title: "Normalise pages, block-level diff", note: "Vacancies and snapshots in D1; stop words, role, geo filters" }
    - { kind: llm, title: Haiku extracts strict JSON }
    - { kind: check, title: "Zod check, score, dedupe" }
    - { kind: llm, title: Sonnet drafts the first paragraph }
    - { kind: check, title: "Validate, else use my template" }
    - { kind: output, title: "Daily queue, 10 cards", note: "I review, edit and send by hand" }
  notes: ["Reply tracking, Telegram digest"]
decisions:
  - chose: deterministic scoring in code
    over: letting the model score vacancies
    because: "the same input always gives the same score, so I can explain any card. The model's relevance is only one small input."
  - chose: a block-level diff on normalised text
    over: classifying whole pages on every crawl
    because: "stripping dates, counters and tokens keeps hashes stable, so a vacancy is classified once. That is what cut the model spend."
  - chose: an AI intro validated by code, with a template fallback
    over: sending model text directly
    because: "a made-up fact in a letter to a real person costs more than a generic paragraph. Any failed check or low confidence falls back to my template."
aiSpecifics:
  - { key: Models, value: "claude-haiku-4-5 for extraction, claude-sonnet-5 for drafts; Workers AI Llama as an alternative" }
  - { key: Grounding, value: "Strict JSON, missing facts must be null, Zod parse, one retry, then manual review" }
  - { key: Tool use, value: "None: single-shot calls with structured JSON output" }
  - { key: Memory, value: "Company state and outreach history in the DB; LLM cache keyed by model and prompt version" }
  - { key: Cost controls, value: "Free filters first, daily call limit, text truncation, cache, AI Gateway" }
  - { key: Tests, value: "726 unit tests with the model call stubbed; no eval set yet" }
---

## Problem

Job boards optimise for volume, and a list of 40 positions leads to no letters at all. I wanted a short daily list of relevant vacancies and companies, with a memory of who I had already contacted or turned down.

## What I'd do differently

At first I called the model before the free filters, and it burned the 500-call daily limit on 498 vacancies, 6 of them relevant. Now I set the filter order and a spend budget before the first model call, not after the first bill.

## Results

It runs daily on Cloudflare Workers with D1. The repo has 726 passing tests across 56 files and a fixture test for every source adapter. Model cost fell from about $15 to an estimated $1–2 a month.

## Next

Batch API for scheduled classification. Classify only what reaches the queue. A budget ceiling in money, not in call count.
