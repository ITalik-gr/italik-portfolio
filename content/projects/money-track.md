---
title: Money Track
slug: money-track
kind: personal
show: [featured, lab]
caseStudy: true
order: 1
status: live
statusNote: open source
tags: [product, llm, mcp, web-app, bot, open-source]
typeLabel: Personal · AI product
summary: A personal finance tracker whose AI advisor is not allowed to invent a single figure.
description: A multi-user finance app that syncs Monobank and CSV statements, categorises spending and answers questions about your money. Each user's data lives in its own Durable Object. A small judgment model and Claude share categorisation in a measured cascade. The same numbers are exposed to Claude over an MCP server with built-in OAuth 2.1.
keyIdea: The model never computes a number.
role: Solo · design, front-end, back-end, AI
timeline: 2026 · ~3 months
stack: [TypeScript, React, RTK Query, Cloudflare Workers, Durable Objects (SQLite), Hono, Anthropic API, TypeSafe Jev]
shipsAs: [Web app (PWA), MCP server, Telegram bot + Mini App]
links:
  live: https://money.italik.dev
  demo: https://money.italik.dev/demo
  code: https://github.com/ITalik-gr/money-track
frameUrl: money.italik.dev/demo
cover: /work/money-track/cover.png
coverMobile: /work/money-track/cover-mobile.png
features:
  - title: Grounded AI advisor
    text: Chat, advice and reports read the same snapshot the screens use; a check drops any figure or date the data doesn't contain.
  - title: Deterministic-first categorisation
    text: Aliases, subscriptions, merchant consensus and MCC rules run first; a model only sees rows those rules could not settle.
  - title: Your ledger over MCP
    text: A read-only MCP server with its own OAuth 2.1 server, so Claude connects with just a URL and a consent screen.
  - title: Throwaway public demo
    text: /demo creates a private sandbox with six months of seeded data that resets after 24 hours.
architecture:
  intro: Bank rows go through one deterministic parser into each user's own SQLite. Models only classify unknown rows or phrase answers. Every figure comes from canonical SQL and is checked before it renders.
  steps:
    - { lane: ingest, text: "Monobank webhook, CSV, quick-add" }
    - { lane: core, text: One normaliser per bank provider }
    - { lane: storage, text: "Upsert into the user's Durable Object" }
    - { lane: core, text: "Rules ladder: alias, subscription, MCC" }
    - { lane: llm, text: Jev judges; Haiku below threshold }
    - { lane: storage, text: "AI changes logged, revertible" }
    - { lane: core, text: Canonical SQL builds the snapshot, from: [3] }
    - { lane: llm, text: Claude answers via read-only tools }
    - { lane: core, text: Grounding check rejects unknown numbers }
    - { lane: ui, text: "Web PWA, Telegram, MCP clients", from: [7, 9] }
decisions:
  - chose: one Durable Object per user
    over: user_id filters on shared tables
    because: "with dozens of canonical queries, one missing filter would leak another user's data. Physical isolation keeps the queries unchanged, and forwarding the whole request into the object is one network hop."
  - chose: my own OAuth 2.1 authorization server
    over: delegating MCP auth to Google
    because: "Google knows who the user is, not what access this ledger grants. Tokens are bound to this server's audience, as the MCP spec requires, with PKCE S256 and rotating refresh tokens."
  - chose: a Jev → Haiku cascade
    over: Claude categorising every row
    because: "on cases written before the code, Jev files a row only at confidence ≥ 0.8 and passes the rest to Haiku. That kept Haiku's accuracy at about a fifth of the cost."
aiSpecifics:
  - { key: Models, value: "claude-haiku-4-5, claude-sonnet-5, claude-opus-4-8, jev-latest; routed per task" }
  - { key: Grounding, value: "Figures or dates not in the canonical snapshot are dropped before rendering" }
  - { key: Tool use, value: "query_spend, find_transactions, list_categories, remember_fact; read-only MCP server" }
  - { key: Memory, value: "Server-side chat history, user-confirmed facts, advice history to avoid repeats" }
  - { key: Cost controls, value: "Per-task model routing, 1h prompt cache on bulk enrich, demo capped at $1/day" }
  - { key: Evals, value: "npm run eval: 168 real bank descriptions plus 36 held-out merchants" }
---

## Problem

I wanted one place for my own money: Monobank, a sole-trader account, cash and subscriptions, with an assistant I could ask "can I afford this?"

Bank apps show transactions but don't explain them. General chatbots will state a plausible total for anything. In a finance app, a confidently wrong number is worse than a missing feature.

## What I'd do differently

I'd write the eval set before the first prompt. A judgment model tuned on my dataset scored 98.9%, but only 72% on 36 merchants written afterwards. The cause was a hand-condensed copy of the category guide: a second definition of the same thing, a pattern I've since removed across the codebase.

## Results

Live in production with open Google sign-up and a public demo. `npm run check` runs 23 lint checks plus 232 tests, including golden analytics snapshots. Latest held-out eval: Haiku gets 35 of 36 root categories right, for $0.03 per run.

## Next

Connect a second MCP client (ChatGPT) to the live server. Resolve sole-trader tax edge cases and verify the PrivatBank live API. Re-measure search reranking before wiring it in.
