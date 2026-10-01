---
title: Money Track
slug: money-track
kind: personal
show: [featured, lab]
caseStudy: true
order: 1
status: live
statusNote: open source
tags: [web-app, mcp, product, llm, bot, open-source]
typeLabel: Personal · AI product
summary: "An AI finance app where every number comes from SQL: ~97% categorisation accuracy at ~80% lower cost."
description: A multi-user finance app that syncs Monobank and CSV statements, categorises spending and answers questions about your money. Each user's data lives in its own Durable Object. A small judgment model and Claude share categorisation in a measured cascade. The same numbers are exposed to Claude over an MCP server with built-in OAuth 2.1.
keyIdea: The model never computes a number.
role: Solo · design, front-end, back-end, AI
timeline: 2026 · ~3 months
stack: [TypeScript, React, RTK Query, Cloudflare Workers, Durable Objects (SQLite), D1, Hono, Anthropic API, TypeSafe Jev]
shipsAs: [Web app (PWA), MCP server, Telegram bot + Mini App]
links:
  live: https://money.italik.dev
  demo: https://money.italik.dev/demo
  code: https://github.com/ITalik-gr/money-track
frameUrl: money.italik.dev/demo
cover: /work/money-track/dashboard-desktop-dark.png
coverMobile: /work/money-track/dashboard-mobile-dark.png
# both themes on purpose: dark leads, light shows the app is themed end to end
gallery:
  - { kind: desktop, label: AI chat, url: money.italik.dev/demo, src: /work/money-track/chat-desktop-dark.png }
  - { kind: mobile, label: AI chat, src: /work/money-track/chat-mobile-dark.png }
  - { kind: mobile, label: AI overview, src: /work/money-track/statistics-mobile-dark.png }
  - { kind: desktop, label: AI financial overview, url: money.italik.dev/demo, src: /work/money-track/statistics-desktop-dark.png }
  - { kind: mobile, label: Dashboard, src: /work/money-track/dashboard-mobile-light.png }
  - { kind: mobile, label: Subscriptions, src: /work/money-track/subscriptions-mobile-light.png }
  - { kind: desktop, label: Monthly trends, url: money.italik.dev/demo, src: /work/money-track/statistics-trends-desktop-light.png }
  - { kind: desktop, label: Subscriptions, url: money.italik.dev/demo, src: /work/money-track/subscriptions-desktop-dark.png }
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
  variant: map
  title: The model never touches the data.
  summary: "Every number is computed by deterministic code inside the user's own Durable Object. Models only classify rows the rules can't settle and phrase answers, and every answer passes a grounding check before it renders."
  zones:
    - { id: clients, label: Clients, x: 0, y: 0, w: 272, h: 640 }
    - { id: edge, label: "Cloudflare edge · deterministic", x: 304, y: 0, w: 648, h: 640 }
    - { id: external, label: External, x: 984, y: 0, w: 376, h: 640 }
    - { id: llm, label: "LLM zone · read-only, no writes", kind: llm, parent: external, x: 1016, y: 160, w: 312, h: 296 }
  nodes:
    - { id: web, zone: clients, kind: output, title: Web app, sub: PWA · React, x: 32, y: 104, w: 208 }
    - { id: tg, zone: clients, kind: output, title: Telegram bot, sub: Bot · mini app, x: 32, y: 208, w: 208 }
    - { id: mcp, zone: clients, kind: output, title: MCP client, sub: Claude · URL + consent, x: 32, y: 312, w: 208 }
    - { id: worker, zone: edge, kind: code, title: Worker, sub: Hono · auth · routing, x: 336, y: 208, w: 208 }
    - { id: oauth, zone: edge, kind: code, title: OAuth 2.1 server, sub: PKCE · rotating tokens, x: 336, y: 344, w: 208 }
    - { id: normaliser, zone: edge, kind: code, title: Bank normaliser, sub: One per provider · CSV, x: 640, y: 48, w: 280 }
    - { id: do, zone: edge, kind: code, title: "User's Durable Object", sub: Own SQLite · rules ladder, x: 640, y: 208, w: 280 }
    - { id: sql, zone: edge, kind: code, title: Canonical SQL, sub: Builds the snapshot, x: 640, y: 344, w: 280 }
    - { id: grounding, zone: edge, kind: check, title: Grounding check, sub: Drops unknown numbers, x: 640, y: 512, w: 280 }
    - { id: monobank, zone: external, kind: external, title: Monobank API, sub: Webhooks · pull, x: 1040, y: 48, w: 264 }
    - { id: jev, zone: llm, kind: llm, title: Jev → Haiku, sub: "Rows the rules can't settle", x: 1040, y: 208, w: 264 }
    - { id: claude, zone: llm, kind: llm, title: Claude, sub: Model routed per task, x: 1040, y: 344, w: 264 }
  edges:
    - { from: web, to: worker, points: [[240, 140], [288, 140], [288, 244], [336, 244]] }
    - { from: tg, to: worker, points: [[240, 244], [336, 244]] }
    - { from: mcp, to: worker, points: [[240, 348], [288, 348], [288, 244], [336, 244]] }
    - { from: monobank, to: normaliser, label: webhook, points: [[1040, 84], [920, 84]], labelAt: [980, 74], labelAnchor: middle }
    - { from: normaliser, to: do, label: upsert, points: [[780, 120], [780, 208]], labelAt: [792, 168] }
    - { from: worker, to: do, label: routes, points: [[544, 244], [640, 244]], labelAt: [592, 234], labelAnchor: middle }
    - { from: worker, to: oauth, label: MCP auth, points: [[440, 280], [440, 344]], labelAt: [452, 316], dashed: true }
    - { from: do, to: jev, label: unknown rows, points: [[920, 232], [1040, 232]], labelAt: [980, 222], labelAnchor: middle }
    - { from: jev, to: do, label: category, points: [[1040, 256], [920, 256]], labelAt: [980, 276], labelAnchor: middle }
    - { from: do, to: sql, label: read, points: [[780, 280], [780, 344]], labelAt: [792, 316] }
    - { from: sql, to: claude, label: snapshot, points: [[920, 368], [1040, 368]], labelAt: [980, 358], labelAnchor: middle }
    - { from: sql, to: claude, label: + tools, points: [[920, 392], [1040, 392]], labelAt: [980, 412], labelAnchor: middle }
    - { from: claude, to: grounding, label: draft answer, points: [[1172, 416], [1172, 548], [920, 548]], labelAt: [1184, 500] }
    - { from: grounding, to: mcp, label: checked answer, points: [[640, 548], [136, 548], [136, 384]], labelAt: [392, 538], labelAnchor: middle, emphasis: true }
  trace:
    question: Can I afford a $400 laptop this month?
    steps:
      - { kind: code, text: "Worker checks the session and routes to the user's own Durable Object" }
      - { kind: code, text: "Canonical SQL builds the snapshot the screens use: balances, burn, budgets" }
      - { kind: llm, text: "Claude gets the snapshot plus read-only tools: query_spend, find_transactions" }
      - { kind: llm, text: It drafts the answer and explains it. It never computes a total itself }
      - { kind: check, text: "Grounding check drops any figure or date the snapshot doesn't contain" }
      - { kind: code, text: "The checked answer streams to the web app, Telegram or an MCP client" }
  guarantees:
    - { title: Every figure comes from SQL., caption: Checked before it renders }
    - { title: AI changes are logged and revertible., caption: No silent writes }
    - { title: 35 / 36 on held-out merchants., accent: 35 / 36, caption: npm run eval · $0.03 per run }
    - { title: Public demo capped at $1 a day., caption: Cost is a feature }
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

The AI advisor invented numbers on real bank data, and better prompts didn't stop it. In a finance app, a confidently wrong number is worse than a missing feature. So I moved every calculation into SQL, added a check that blocks any figure the database didn't produce, and let rules categorise spending before a model does: ~97% accuracy at ~80% lower cost.

I wanted one place for my own money: Monobank, cash and subscriptions, with an assistant I could ask "can I afford this?" Bank apps show transactions but don't explain them, and general chatbots will state a plausible total for anything.

## What I'd do differently

I'd write the eval set before the first prompt. A judgment model tuned on my dataset scored 98.9%, but only 72% on 36 merchants written afterwards. The cause was a hand-condensed copy of the category guide: a second definition of the same thing, a pattern I've since removed across the codebase.

## Results

Live in production with open Google sign-up and a public demo. `npm run check` runs lint and the tests, including golden analytics snapshots. Latest held-out eval: Haiku gets 35 of 36 root categories right, for $0.03 per run.

## Next

Connect a second MCP client (ChatGPT) to the live server. Resolve sole-trader tax edge cases and verify the PrivatBank live API. Re-measure search reranking before wiring it in.
