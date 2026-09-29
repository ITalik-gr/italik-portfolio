---
title: Ask-about-me chat
slug: ask-about-me-chat
kind: personal
show: [lab]
caseStudy: true
order: 7
# becomes live once the site ships (phase 8)
status: building
tags: [agent, llm]
typeLabel: Personal · AI feature
summary: The AI chat on this site. It answers recruiters' questions from my real content and nothing else.
description: A streaming chat that knows my projects, experience and how I work. The whole knowledge base is built from this site's content at build time and sits in a cached system prompt, with rate limits, a daily budget and a golden-question eval set.
keyIdea: It only knows what this site says.
role: Solo · design, front-end, back-end, AI
timeline: "2026"
stack: [Next.js, TypeScript, Anthropic API, Upstash Redis, Zod]
# TODO: code link once the site repo is public
frameUrl: italik.dev/#ask
internalLink: /#ask
cover: /work/ask-about-me-chat/cover.png
coverMobile: /work/ask-about-me-chat/cover-mobile.png
features:
  - title: One source of truth
    text: The knowledge base is built from the same Markdown files that render the site, so the chat can't drift from the pages.
  - title: Answers with sources
    text: Every answer ends with the files it used; the server turns them into source chips and a link to the case study.
  - title: Guardrails
    text: "It declines salary, personal topics, NDA details and prompt injection politely, and answers in the visitor's language."
  - title: Hard spend limits
    text: "A per-IP rate limit, a daily token budget and a request timeout, with a friendly fallback to my email."
architecture:
  intro: Deterministic code builds the knowledge base and enforces every limit. The model sees one cached prompt and the visitor's last few messages, and only writes the answer.
  steps:
    - { lane: ingest, text: "Project, experience, about-me files" }
    - { lane: core, text: "Build the knowledge base, skip TODOs" }
    - { lane: ingest, text: Visitor asks a question }
    - { lane: core, text: Zod validation and length limits }
    - { lane: storage, text: "Rate limit and daily budget in Redis" }
    - { lane: llm, text: Haiku answers from the cached prompt, from: [2, 5] }
    - { lane: core, text: Sources line stripped from the stream }
    - { lane: storage, text: Spend recorded per day, from: [6] }
    - { lane: ui, text: "Streamed answer, source chips", from: [7] }
decisions:
  - chose: the whole knowledge base in a cached prompt
    over: embeddings and retrieval
    because: "it is about 4.6k tokens, so everything fits. Prompt caching makes repeat reads cost a tenth, and there is no retrieval step that could miss the right fact."
  - chose: building the knowledge from site content
    over: a separate hand-written chat document
    because: one definition of every fact. When I edit a project page, the chat knows it on the next build.
  - chose: a budget in input-token equivalents
    over: counting requests
    because: "output, cache writes and cache reads cost different amounts. One weighted number caps the real daily spend, about $1.5 on Haiku."
aiSpecifics:
  - { key: Model, value: "claude-haiku-4-5 by default, swappable through CHAT_MODEL without a code change" }
  - { key: Grounding, value: "Knowledge base only; unknown answers point to my email" }
  - { key: Tool use, value: "None: one streamed call per question" }
  - { key: Memory, value: "Last 10 messages of the current page; nothing stored on the server" }
  - { key: Cost controls, value: "Prompt caching (~16 fresh input tokens per question), 20 requests per 10 min, daily budget" }
  - { key: Evals, value: "25 golden questions: facts, refusals, NDA, injection, language; 25/25 for about $0.035 a run" }
---

## Problem

A recruiter has 30 to 90 seconds and one specific question: has he used Stripe, can he start soon, does he know Python? Scanning a whole portfolio for that is slow, and a generic chatbot would happily invent the answer.

## What I'd do differently

I'd write the eval set even earlier. The first runs showed the model repeating the wording of its own rules when refusing an injection, and formatting answers in Markdown despite being told not to; both were cheap to fix once a test caught them.

## Results

Works end to end with streaming, source chips, a floating drawer on every page and the section on the home page. The eval set passes 25 of 25, and the prompt cache holds: after the first request, each question reads about 4.6k cached tokens.

## Next

Log anonymous questions to see what recruiters actually ask. Move to embeddings only if the knowledge base outgrows the prompt.
