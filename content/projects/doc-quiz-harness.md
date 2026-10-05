---
title: Quiz Dock
slug: doc-quiz-harness
kind: personal
show: [now]
caseStudy: true
order: 5
status: building
tags: [agent, tool, llm]
typeLabel: Personal · agent
summary: Study any document with an agent that quizzes you on it. The model writes the questions, code grades the answers.
description: A hand-written agent harness in TypeScript on the raw Anthropic SDK, with no agent framework. The model navigates a document through a section-reading tool, writes quiz questions as validated tool input, and code grades the answers.
keyIdea: The model writes questions; code grades them.
role: Solo · back end, AI
timeline: 2026 · since September
stack: [TypeScript, Node.js, Anthropic SDK, Zod, tsx]
cover: /work/doc-quiz-harness/cover.png
links:
  code: https://github.com/ITalik-gr/quiz-dock
nowBuilding:
  lastUpdate: 2026-09
  updateNote: "CLI works; building the web version: Next.js, Hono, sessions in SQLite"
features:
  - title: Hand-written agent loop
    text: "Tool registry, message history, step limit and error-to-model feedback, written from scratch and shared by quiz and chat modes."
  - title: Grounded document chat
    text: The model sees only section titles and reads sections through a tool before it answers.
  - title: Interactive quiz tool
    text: The model writes questions as schema-validated tool input; the user answers by number and code grades them.
  - title: Event-driven output
    text: The core emits typed events instead of printing, so the same loop can drive a CLI or a web UI.
architecture:
  summary: Code splits a Markdown document into sections.
  highlight: The model decides which sections to read and when to quiz; parsing, validation and grading are deterministic code.
  steps:
    - { kind: input, title: Markdown file via CLI flags, note: User message in the terminal }
    - { kind: code, title: Split into sections by headings }
    - { kind: llm, title: Model plans from the section index, note: "readSection returns section text; it answers from that text" }
    - { kind: llm, title: Model writes a quiz as tool input }
    - { kind: check, title: Zod validates the questions }
    - { kind: code, title: Code grades the answers, note: User picks options by number }
    - { kind: llm, title: Model explains the mistakes, note: Events rendered in the terminal }
decisions:
  - chose: my own agent loop on the raw SDK
    over: an agent framework
    because: "I wanted direct control over message history, tool results, errors and step limits. Every tool call gets a result; failures go back to the model with is_error."
  - chose: a section index plus a read tool
    over: the whole document in every request
    because: "history holds only the sections the model opened, so long chats send fewer input tokens and every answer traces to a specific section."
  - chose: grading answers in code
    over: letting the model judge answers
    because: comparing the chosen option with the correct index is exact, free and deterministic. The model only explains the mistakes.
aiSpecifics:
  - { key: Model, value: "claude-sonnet-4-6, the default in the LLM call wrapper" }
  - { key: Grounding, value: "Section index in the system prompt; sections must be read before answering" }
  - { key: Tool use, value: "readSection, startQuiz, askHuman; parallel tool calls off for quizzes" }
  - { key: Memory, value: "Full message history per session, in process memory" }
  - { key: Cost controls, value: "Step limit, max_tokens 1024, token usage summed per run" }
---

## Problem

Generic chatbots answer from training data, so for new or niche libraries they confidently mix in facts the docs never state. Quiz Dock stays inside one document: the model reads it through a tool and writes the questions, and code grades the answers.

Reading documentation doesn't mean understanding it.

I wanted a study tool that stays inside one document: it explains what I ask, tests me on it and explains my mistakes from the exact section they come from.

## What I'd do differently

I'd separate the generic loop from the quiz from day one: my first core had the quiz prompt baked in, and I refactored it before adding chat. I'd also design tools that pause the loop earlier; the readline human-in-the-loop works in a CLI but not over HTTP.

## Results

The CLI works end to end in two modes: grounded chat about a document, and quizzes the model starts when asked. Malformed tool input is rejected by Zod and the model corrects it on the next step.

## Next

In progress: a web version with a Next.js front end and a Hono server, sessions and history in SQLite (later D1), and tools that pause the loop until the user answers in the UI. Then an ingestion agent that reads multi-page docs with subagents.
