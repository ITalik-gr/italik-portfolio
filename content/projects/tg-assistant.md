---
title: AI Telegram Assistant
slug: tg-assistant
kind: personal
show: [lab, now]
caseStudy: true
order: 3
status: v2-in-progress
tags: [bot, rag, agent, llm, automation]
typeLabel: Personal · AI bot
summary: "A group-chat AI bot where code decides when the model runs: an estimated $3-6 a month instead of $75-150."
description: A serverless Telegram bot for a friends' group chat. It logs messages, summarises on demand and answers as a persona with semantic memory. An LLM intent classifier routes requests, and cheap deterministic gates decide whether a model is called at all.
keyIdea: Code decides when the model runs.
role: Solo · design, back-end, AI, ops
timeline: 2026 · ~2 months
stack: [TypeScript, Cloudflare Workers, grammY, D1, xAI Grok, Workers AI, Vectorize, R2]
shipsAs: [Telegram bot]
links:
  code: https://github.com/ITalik-gr/tg_chat_bot
frameUrl: t.me · group chat
# illustration, not a real screenshot: the live chat is private, so names and messages are made up
cover: /work/tg-assistant/cover.png
nowBuilding:
  title: AI Telegram Assistant v2
  summary: "A ground-up rewrite: function calling instead of a hardcoded router, tests, and smarter memory recall."
  # TODO verify: phase numbers come from the design mock
  phase: { current: 1, total: 3 }
  lastUpdate: "2026"
  updateNote: v1 runs in a live chat; rewrite underway
features:
  - title: Summaries on demand
    text: "/summary 2h turns a stretch of chat into a retelling built from the transcript, daily digests and stored facts."
  - title: Semantic memory
    text: Facts are tied to real chat members, embedded in Vectorize and recalled by similarity when they matter.
  - title: Plain-language actions
    text: "Reminders, todos, stats, translation, search and drawing all work by simply addressing the bot."
  - title: Learns from reactions
    text: Reactions and replies to the bot's messages are distilled nightly into a tone note that steers later replies.
architecture:
  summary: The webhook returns 200 at once and the work runs in the background.
  highlight: Deterministic code filters, logs and routes; Grok is called only to classify, reply or distil.
  steps:
    - { kind: input, title: "Telegram webhook, secret check", note: "Voice, photo, video, docs to text" }
    - { kind: code, title: Log the message in D1 }
    - { kind: check, title: "Gates: addressed, cooldown, chance" }
    - { kind: llm, title: "Grok classifies intent, argument" }
    - { kind: code, title: Dispatch to a handler, note: "Recall facts, moods, vibe" }
    - { kind: llm, title: Grok replies in persona }
    - { kind: output, title: Reply sent to the chat, note: "Log reply, reaction scores" }
  background: { kind: llm, label: Nightly, text: "Digests, facts, style" }
decisions:
  - chose: an AI intent classifier with keyword hints
    over: keyword routing and regex alone
    because: "regex argument extraction was brittle. The model picks the action and a clean argument, and routing falls back to keywords if the AI call fails."
  - chose: cheap gates before every model call
    over: calling Grok on every message
    because: "my estimate was $75–150 a month ungated versus about $3–6 with gates and prompt caching. Address checks, cooldowns and chance run first."
  - chose: D1 plus a per-minute cron for reminders
    over: a Durable Object per chat
    because: it is simpler and needs no paid tier. Repeating reminders just move their due time forward instead of being deleted.
aiSpecifics:
  - { key: Model, value: "grok-4-fast via Cloudflare AI Gateway; separate env vars for chat, reply and profile models" }
  - { key: Grounding, value: "Recall uses only stored facts above a 0.45 similarity score; chat text is treated as untrusted" }
  - { key: Tool use, value: "None yet: intent classifier plus a hardcoded dispatch; function calling is next" }
  - { key: Memory, value: "Facts per member in D1, aliases, profiles, Vectorize (bge-m3), a nightly vibe note" }
  - { key: Cost controls, value: "Deterministic gates, static-first prompts for caching, classifier capped at 200 tokens" }
---

## Problem

Calling the model on every message in a busy group chat would cost an estimated $75-150 a month. Cheap code checks run first (is the bot addressed, cooldown, chance), so the model runs only when it's needed: about $3-6 a month.

Our friends' group chat produces hundreds of messages a day, and anyone who steps away can't catch up. Existing bots are generic: they forget context and can't take the chat's tone. I wanted one that logs quietly, remembers who is who and answers in the chat's own voice.

## What I'd do differently

It grew to about 6,400 lines before it got structure: two files took on too much and the persona lived in three prompts. v2 starts from tests and a config module. An early prompt-injection loop taught me to treat chat history as untrusted input, not as instructions.

## Results

Deployed and running in a live group chat: 14 D1 migrations, about 35 modules, and most media handled by Workers AI (Whisper, captions, embeddings) so Grok is kept for the work where quality matters.

## Next

Split the two largest modules and add lint and tests. Replace the classifier and switch with Grok function calling. Add reranking and hybrid search to memory recall.
