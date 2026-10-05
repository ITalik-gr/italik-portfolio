---
title: Lottie Theme
slug: lottie-theme
kind: personal
show: [featured, lab]
caseStudy: true
order: 2
status: live
statusNote: open source
tags: [mcp, open-source, tool, agent, llm, web-app]
typeLabel: Personal · tool · MCP
summary: Recolours a Lottie animation into any palette or theme, by hand, by script or by an agent that checks its result by rendering it.
description: A browser editor, a CLI, an MCP server and a live editor–agent bridge that find every colour in a Lottie file, remap it and render the result to check it. All four are thin shells over one core package, published to npm, so a hand edit, a script and an agent come out identical.
keyIdea: The agent must look at what it rendered.
role: Solo · design, front end, tooling, AI
timeline: 2026 · ~1 month
stack: [TypeScript, Next.js, React, Zustand, lottie-web, Tailwind CSS, shadcn/ui, MCP SDK, Anthropic SDK, GitHub Actions]
shipsAs: [Web app, CLI on npm, MCP server, Live sync bridge]
links:
  live: https://lottie.italik.dev
  code: https://github.com/ITalik-gr/lottie-theme
frameUrl: lottie.italik.dev
cover: /work/lottie-theme/landing.png
gallery:
  - { kind: desktop, label: Editor, url: lottie.italik.dev/editor, src: /work/lottie-theme/editor.png }
features:
  - title: Click-to-recolour editor
    text: "Palette, layer tree, gradient stops you can add and remove (animated ramps too), shadow colours, pick from canvas and match to a reference screenshot. One undo stack; files stay in the browser, kept in IndexedDB between visits."
  - title: Batch CLI
    text: "report, suggest, apply and batch: work out a theme on one animation, then apply it to a whole folder. Themes match by colour, so they carry over to other files."
  - title: MCP tools with a renderer
    text: 12 tools let an agent read palettes, gradients and effect colours, edit them, then render the result on the target background to check its own work.
  - title: Live editor–agent bridge
    text: An agent sees the open file and the selected colour, and its edits land in the editor as undoable steps.
architecture:
  summary: The core holds all colour logic in plain TypeScript, with no filesystem or UI code.
  highlight: The LLM only chooses edits and calls tools; it never touches the JSON directly.
  steps:
    - { kind: input, title: Lottie JSON dropped or read from disk, note: Screenshot sampled for reference colours }
    - { kind: code, title: Find colour slots in eight JSON shapes, note: "Build palette, gradients, effects; draft opposite theme with a WCAG audit" }
    - { kind: llm, title: Agent picks edits via tool calls }
    - { kind: code, title: "Apply the edit set, render in Chrome / lottie-web" }
    - { kind: llm, title: "Agent looks at the render, corrects" }
    - { kind: code, title: "Write file, edit set kept in meta" }
    - { kind: output, title: "Editor canvas, undo stack, CLI output" }
decisions:
  - chose: one core package with thin shells
    over: separate logic for the editor, CLI and agent
    because: a hand edit, a script and an agent have to come out identical, so every colour rule lives once, in the core.
  - chose: themes matched by colour
    over: themes matched by slot index
    because: "a saved theme applied to a folder used to recolour other files by slot position, silently. Now a theme is portable and stamped with the structure it came from."
  - chose: sending edit sets between editor and agent
    over: sending whole animations
    because: "an agent's change arrives like a click, lands in the same undo stack and reverts as one step. Nothing is written to disk until the user presses write."
  - chose: calling the API straight from the browser
    over: a backend proxy
    because: "the deployed app has no server, so files never leave the machine. The cost is that the user brings their own key, stored only in that browser."
aiSpecifics:
  - { key: Models, value: "Opus 5.5 by default, Sonnet 5.5, Haiku 4.5, Fable 5.1, or any OpenAI-compatible endpoint; the user's own key" }
  - { key: Grounding, value: "Tools return real document data; the agent must check the rendered canvas" }
  - { key: Tool use, value: "Browser: Anthropic tool runner, 16-step cap. MCP: 12 tools incl. render_preview" }
  - { key: Memory, value: "Conversation saved per file and survives panel switches; the edit set can be embedded in the file" }
  - { key: Cost controls, value: "Prompt caching, stale tool results cleared, per-request spend ceiling, live cost readout" }
  - { key: Tests, value: "Pixel eval of the light theme; agent end-to-end checks on a scripted API; no eval of a real model yet" }
---

## Problem

A designer who needed the same animation in another theme or palette, light instead of dark or in brand colours, had no tool short of After Effects. I built one core with three ways in: a web editor, a CLI and an MCP server with 12 tools, published as 4 npm packages. The agent recolours a file, renders it and checks the result before it hands it back.

Dark-theme Lottie animations often have no source file left, and exporters scatter colour across eight different JSON shapes. Simply inverting lightness gives washed-out greys and dark halos on a white page.

## What I'd do differently

I'd put a test on every flow the README promises before writing it down. "Save a theme, apply it to a folder" was documented and quietly recoloured other files by slot index. Path checks in the MCP server, sync hub and dev server followed symlinks lexically, so a link inside the workspace could reach any file. Both are fixed now and covered by tests.

## Results

All four packages are on npm (v0.1.0), released from a git tag with provenance. CI runs typecheck, tests, a production build and browser smoke tests on every push. Unit tests cover the core, the CLI, the sync bridge and the MCP server, with browser smoke checks and agent and editor end-to-end checks on top. A pixel-based eval of the light-theme suggestion drove the latest algorithm: mean lightness on the card fixture went from .65 to .80, and contrast findings from 11 to 0.

## Next

An eval of how well a real model recolours, not only the tool pipeline. Large soft shadows on light pages, which lottie-web clips to the layer box. Trusted Publishing on npm instead of a token. Fresh before/after examples in the README.
