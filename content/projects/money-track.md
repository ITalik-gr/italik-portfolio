---
title: Money Track
slug: money-track
kind: personal
featured: true
lab: true
caseStudy: true
# case copy is taken from the design reference; confirm against the repo
draft: true
order: 1
status: live
statusNote: open source
tags: [product, llm, open-source]
typeLabel: Personal · AI product
summary: AI-powered personal finance app with a deterministic-first core, so the AI never invents numbers.
description: AI-powered personal finance app with a deterministic-first core, so the AI never invents numbers. Bank sync via Monobank webhooks, per-user data isolation with Durable Objects, and an LLM advisor grounded in one canonical SQL layer.
keyIdea: The model never computes a number.
role: Solo · design, front-end, back-end, AI
timeline: 2026 · ~2 months
stack: [React, TypeScript, Cloudflare Workers, Durable Objects, D1, Hono, Anthropic API]
links:
  demo: https://money.italik.dev/demo
  code: https://github.com/ITalik-gr/money-track
frameUrl: money.italik.dev/demo
features:
  - title: Bank sync
    text: Transactions arrive through Monobank webhooks, no manual import.
  - title: Per-user isolation
    text: Each user's data lives in its own Durable Object.
  - title: Grounded advisor
    text: An LLM advisor that reads from one canonical SQL layer and explains, never calculates.
architecture:
  intro: "Read it like a git graph: time runs down, lanes are layers, curves are data handing off. The model has one lane and it only reads."
  steps:
    - { lane: ingest, text: Monobank webhook arrives }
    - { lane: ingest, text: Worker (Hono) validates and normalises }
    - { lane: storage, text: Write to the user's Durable Object }
    - { lane: storage, text: Persist rows in D1 }
    - { lane: core, text: "Canonical SQL: totals, budgets, trends" }
    - { lane: core, text: Every number is computed here }
    - { lane: llm, text: Advisor receives query results }
    - { lane: llm, text: "Explains and suggests, read-only" }
    - { lane: ui, text: Numbers rendered straight from SQL, from: [6] }
    - { lane: ui, text: Advice shown next to the numbers, from: [8, 9] }
decisions:
  - chose: a canonical SQL layer
    over: letting the LLM compute totals
    because: every figure has to be correct and traceable to a query. The model explains results; it never produces them.
  - chose: one Durable Object per user
    over: a shared table with a user filter
    because: "isolation becomes structural: one user's request cannot reach another user's data through a missed WHERE clause."
  - chose: Monobank webhooks
    over: polling the bank API
    because: transactions arrive as they happen, with no polling schedule to maintain.
aiSpecifics:
  - { key: Model, value: "TODO: Anthropic API, model name from the repo" }
  - { key: Grounding, value: Answers built only from canonical SQL query results }
  - { key: Tool use, value: "Read-only queries against the user's data" }
  - { key: Cost / latency, value: "TODO: per-request cost and p50 latency" }
  - { key: Evals, value: "TODO: how answers are checked against SQL output" }
---

## Problem

Finance apps with an AI layer tend to let the model do the maths. Language models are bad at arithmetic and confident about it, and in a money app a wrong total is worse than no answer.

## What I'd do differently

TODO: confirm from the repo. Draft from the design: write the evaluation set before the prompt, not after.

## Results

Live, with a public demo and open-source code. Bank sync, isolation and the grounded advisor run in production.

## Next

TODO: next steps from the repo roadmap.
