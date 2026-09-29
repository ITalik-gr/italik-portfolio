---
title: Lottie Theme
slug: lottie-theme
kind: personal
show: [featured, lab]
caseStudy: true
order: 2
status: live
statusNote: open source
tags: [tool, mcp, agent, llm, web-app, open-source]
typeLabel: Personal · tool · MCP
summary: Turn a dark Lottie animation into a light one, by hand, by script or by agent.
description: A browser editor, a CLI and an MCP server that find every colour in a Lottie file, remap it and render the result to check it. All three are thin shells over one core package, so a hand edit and a scripted edit come out identical.
keyIdea: The agent must look at what it rendered.
role: Solo · design, front-end, tooling, AI
timeline: 2026 · ~1 month
stack: [TypeScript, Next.js, React, Zustand, lottie-web, Tailwind CSS, MCP SDK, Anthropic SDK]
shipsAs: [Web app, CLI, MCP server, Live sync bridge]
# the CLI isn't on npm, so no npx commands anywhere
links:
  live: https://lottie.italik.dev
  code: https://github.com/ITalik-gr/lottie-theme
frameUrl: lottie.italik.dev
cover: /work/lottie-theme/landing.png
gallery:
  - { kind: desktop, label: Editor, url: lottie.italik.dev/editor, src: /work/lottie-theme/editor.png }
features:
  - title: Click-to-recolour editor
    text: Click a shape, see every colour under the pointer and recolour it. All edits go through one undo stack.
  - title: Batch CLI
    text: Work out a theme on one animation, save it, then apply the same edit set to a whole folder.
  - title: MCP tools with a renderer
    text: An agent reads palettes, gradients and effect colours, edits them, then renders through Chrome to check its own work.
  - title: Live editor–agent bridge
    text: An agent sees the open file and the selected colour, and pushes edits you watch land in the editor.
architecture:
  intro: The core holds all colour logic in plain TypeScript, with no filesystem or UI code. The LLM only chooses edits and calls tools; it never touches the JSON directly.
  steps:
    - { lane: ingest, text: Lottie JSON dropped or read from disk }
    - { lane: ingest, text: Screenshot sampled for reference colours }
    - { lane: core, text: Find colour slots in eight JSON shapes }
    - { lane: core, text: "Build palette, gradients, effects" }
    - { lane: core, text: Draft opposite theme with a WCAG audit }
    - { lane: llm, text: Agent picks edits via tool calls }
    - { lane: core, text: Apply the edit set to the document }
    - { lane: core, text: Render in Chrome / lottie-web }
    - { lane: llm, text: "Agent looks at the render, corrects", from: [8] }
    - { lane: storage, text: "Write file, edit set kept in meta" }
    - { lane: ui, text: "Editor canvas, undo stack, CLI output", from: [7, 10] }
decisions:
  - chose: one core package with thin shells
    over: separate logic for the editor, CLI and agent
    because: a hand edit and a scripted edit have to come out identical. A parity test against the original Python version locks slot numbering across the whole corpus.
  - chose: sending edit sets between editor and agent
    over: sending whole animations
    because: "an agent's change arrives like a click, lands in the same undo stack and reverts as one step. Nothing is written to disk until the user presses write."
  - chose: calling the API straight from the browser
    over: a backend proxy
    because: "the deployed app has no server, so files never leave the machine. The cost is that the user brings their own key, stored only in that browser."
aiSpecifics:
  - { key: Models, value: "claude-opus-5 by default, claude-sonnet-5, claude-haiku-4-5; switchable in settings" }
  - { key: Grounding, value: "Tools return real document data; the agent must check the rendered canvas" }
  - { key: Tool use, value: "Browser: Anthropic tool runner, 16-step cap. MCP: 12 tools incl. render_preview" }
  - { key: Memory, value: "Conversation kept in the page; the edit set can be embedded in the file" }
  - { key: Cost controls, value: "Prompt caching, stale tool results cleared, per-instruction spend ceiling, live cost estimate" }
  - { key: Evals, value: "No agent eval set yet; unit, parity and headless smoke tests" }
---

## Problem

Dark-theme Lottie animations often have no source file left, and exporters scatter colour across eight different JSON shapes. Simply inverting lightness gives washed-out greys and dark halos on a white page. A designer who needs the light version had no tool short of After Effects.

## What I'd do differently

I built the browser agent and the sync bridge early and haven't re-tested them since the gradient, effect and bitmap work landed. The agent's first version also cost a few dollars per instruction: the cost controls came after the bill, not before.

## Results

It works today as an editor, a CLI and an MCP server, with before/after examples in the README. Without the private corpus, `pnpm test` runs 114 core, 12 sync and 8 MCP tests; the rest need my local set of 53 real files.

## Next

Canvas selection synced with the layer tree. Editable shadow-effect colours in the browser. Adding and removing gradient stops. Publishing the core package to npm.
