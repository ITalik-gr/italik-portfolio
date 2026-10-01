---
title: Ask-about-me chat
slug: ask-about-me-chat
kind: personal
show: [lab]
caseStudy: true
order: 7
status: live
tags: [agent, llm]
typeLabel: Personal · AI feature
summary: The AI chat on this site. It answers only from my real content, for under a cent a question.
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
  summary: Deterministic code builds the knowledge base and enforces every limit.
  highlight: The model sees one cached prompt and the visitor's last few messages, and only writes the answer.
  steps:
    - { kind: input, title: Visitor asks a question }
    - { kind: code, title: Zod validation and length limits, note: Rate limit and daily budget in Redis }
    - { kind: llm, title: The model answers from the cached prompt }
    - { kind: code, title: Sources line stripped from the stream, note: Spend recorded per day }
    - { kind: output, title: "Streamed answer, source chips" }
  background: { kind: code, label: Build time, text: "Project, experience and about-me files → knowledge base, drafts skipped" }
decisions:
  - chose: the whole knowledge base in a cached prompt
    over: embeddings and retrieval
    because: "it is about 19k tokens, so everything fits. Prompt caching makes repeat reads cost a tenth, and there is no retrieval step that could miss the right fact."
  - chose: building the knowledge from site content
    over: a separate hand-written chat document
    because: one definition of every fact. When I edit a project page, the chat knows it on the next build.
  - chose: a budget in input-token equivalents
    over: counting requests
    because: "output, cache writes and cache reads cost different amounts. One weighted number caps the real daily spend, whichever model runs: about $3 a day on Sonnet 5.5."
aiSpecifics:
  - { key: Model, value: "The one I pick through CHAT_MODEL, no code change; now Claude Sonnet 5.5" }
  - { key: Grounding, value: "Knowledge base only; unknown answers point to my email" }
  - { key: Tool use, value: "None: one streamed call per question" }
  - { key: Memory, value: "Last 10 messages of the current page; nothing stored on the server" }
  - { key: Cost controls, value: "Prompt caching (~16 fresh input tokens per question), 20 requests per 10 min, daily budget" }
  - { key: Evals, value: "29 golden questions: facts, refusals, NDA, injection, language, client work; all pass on Sonnet 5.5" }
---

## Problem

A visitor has one specific question and little time, and a generic chatbot would happily invent the answer. This chat answers only from the site's content, passes its whole eval set, and each question costs under a cent.

A recruiter has 30 to 90 seconds and one specific question: has he used Stripe, can he start soon, does he know Python? Scanning a whole portfolio for that is slow, and a generic chatbot would happily invent the answer.

## What I'd do differently

I'd rely less on rules in the prompt. Told not to use Markdown, the model still formatted answers now and then, so the UI now renders paragraphs and bold instead of fighting it. Asked to refuse a prompt injection, it quoted its own rules back; a neutral refusal fixed that.

## Results

Works end to end with streaming, source chips, a floating drawer on every page and the section on the home page. The eval set passes 29 of 29, and the prompt cache holds: after the first request, each question reads about 19k cached tokens and costs well under a cent.

## Next

Log anonymous questions to see what recruiters actually ask. Move to embeddings only if the knowledge base outgrows the prompt.
