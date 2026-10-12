---
title: Keyline
slug: keyline
kind: personal
show: [featured, lab]
caseStudy: true
order: 0
status: live
statusNote: free to use
tags: [web-app, mcp, product, llm, agent]
typeLabel: Personal · AI product
summary: Motion editor where your own Claude animates a live scene and you point at any frame to fix it.
description: "A web editor for motion graphics that you and your own Claude edit together. Claude connects through a 31-tool remote MCP server or an in-app chat. Every edit, human or AI, is a validated, invertible batch of ops on one live scene in a Durable Object, and one SVG renderer serves the editor, the export and Claude's own checks."
keyIdea: Every edit, yours or Claude's, is one undo step.
role: Solo · product, design, front end, back end, AI
timeline: 2026 · 1 week
stack: [TypeScript, Next.js 16, React 19, Cloudflare Workers, Durable Objects, D1 + Drizzle, R2, MCP SDK, Anthropic API, Workers AI (Clef)]
shipsAs: [Web app, Remote MCP server, In-app AI chat]
links:
  live: https://keyline.italik.dev/?ref=italik.dev
frameUrl: keyline.italik.dev
cover: /work/keyline/landing-comment.png
coverMobile: /work/keyline/landing-mobile.png
gallery:
  - { kind: desktop, label: Editor and chat, url: keyline.italik.dev, src: /work/keyline/editor-chat.jpg }
  - { kind: mobile, label: Landing, src: /work/keyline/landing-mobile.png }
  - { kind: desktop, label: Motion tuning, url: keyline.italik.dev, src: /work/keyline/editor-motion.jpg }
  - { kind: desktop, label: Reference with marked details, url: keyline.italik.dev, src: /work/keyline/editor-reference.jpg }
  - { kind: desktop, label: Inspector, url: keyline.italik.dev, src: /work/keyline/editor-inspector.jpg }
  - { kind: desktop, label: Export in the browser, url: keyline.italik.dev, src: /work/keyline/editor-export.jpg }
  - { kind: desktop, label: Projects, url: keyline.italik.dev/dashboard, src: /work/keyline/dashboard.png }
  - { kind: desktop, label: Landing, url: keyline.italik.dev, src: /work/keyline/landing-hero.png }
  - { kind: desktop, label: Explore, url: keyline.italik.dev/explore, src: /work/keyline/explore-desktop.png }
features:
  - title: Your Claude, live
    text: "A 31-tool remote MCP server with OAuth 2.1: claude.ai or Claude Code edits the scene while you watch it change."
  - title: Point at a frame
    text: Pause, select elements and pin a comment to that second; Claude claims it, fixes exactly that and resolves the thread.
  - title: Tune feel without words
    text: Timing bars and an easing editor with spring sliders and a live loop; copy any move as CSS, Motion or SwiftUI.
  - title: References in, checked out
    text: "Drop images, a brand URL or a video; the browser breaks clips into moves, and a vision model checks the result against your checklist."
architecture:
  variant: map
  title: Humans and Claude share one write path.
  summary: "A drag in the editor and a tool call from Claude become the same thing: a batch of ops, validated whole and committed by the project's Durable Object. Claude sees frames from the same renderer the editor and the export use."
  zones:
    - { id: clients, label: Clients, x: 0, y: 0, w: 272, h: 640 }
    - { id: edge, label: "Cloudflare edge · deterministic", x: 304, y: 0, w: 648, h: 640 }
    - { id: ai, label: AI, x: 984, y: 0, w: 376, h: 640 }
    - { id: llm, label: "LLM zone · edits only through ops", kind: llm, parent: ai, x: 1016, y: 200, w: 312, h: 408 }
  nodes:
    - { id: yours, zone: clients, kind: llm, title: Your Claude, sub: claude.ai · Claude Code, x: 32, y: 104, w: 208 }
    - { id: editor, zone: clients, kind: output, title: Web editor, sub: SVG stage · timeline, x: 32, y: 240, w: 208 }
    - { id: export, zone: clients, kind: output, title: Video export, sub: WebCodecs → MP4 · WebM, x: 32, y: 512, w: 208 }
    - { id: mcp, zone: edge, kind: code, title: MCP server, sub: 31 tools · OAuth 2.1, x: 336, y: 104, w: 232 }
    - { id: room, zone: edge, kind: code, title: Project's Durable Object, sub: Commits · presence · undo, x: 336, y: 240, w: 232 }
    - { id: runner, zone: edge, kind: code, title: Chat runner, sub: Agent loop · own API key, x: 336, y: 376, w: 232 }
    - { id: store, zone: edge, kind: code, title: D1 · R2 · KV, sub: Index · assets · fonts, x: 648, y: 104, w: 272 }
    - { id: ops, zone: edge, kind: check, title: Op validator, sub: Whole batch · exact inverses, x: 648, y: 240, w: 272 }
    - { id: render, zone: edge, kind: code, title: Frame renderer, sub: renderToSvg → resvg PNG, x: 648, y: 512, w: 272 }
    - { id: route, zone: llm, kind: llm, title: Clef-flash, sub: Picks effort and model, x: 1040, y: 240, w: 264 }
    - { id: claude, zone: llm, kind: llm, title: Claude, sub: Opus / Sonnet 5.5, x: 1040, y: 376, w: 264 }
    - { id: check, zone: llm, kind: llm, title: Clef vision, sub: Checks rendered frames, x: 1040, y: 512, w: 264 }
  edges:
    - { from: yours, to: mcp, label: tool calls, points: [[240, 140], [336, 140]], labelAt: [288, 130], labelAnchor: middle }
    - { from: editor, to: room, label: ops · live, points: [[240, 276], [336, 276]], labelAt: [288, 266], labelAnchor: middle, emphasis: true }
    - { from: editor, to: runner, label: chat, points: [[180, 312], [180, 412], [336, 412]], labelAt: [192, 362] }
    - { from: editor, to: export, label: every frame, points: [[80, 312], [80, 512]], labelAt: [92, 470] }
    - { from: mcp, to: room, label: ops, points: [[452, 176], [452, 240]], labelAt: [464, 212] }
    - { from: runner, to: room, label: ops, points: [[452, 376], [452, 312]], labelAt: [464, 348] }
    - { from: room, to: ops, label: validate, points: [[568, 276], [648, 276]], labelAt: [608, 266], labelAnchor: middle }
    - { from: room, to: store, label: snapshots, points: [[548, 240], [548, 208], [600, 208], [600, 140], [648, 140]], labelAt: [560, 200], dashed: true }
    - { from: runner, to: route, label: message kind, points: [[548, 376], [548, 344], [1000, 344], [1000, 276], [1040, 276]], labelAt: [780, 334], labelAnchor: middle }
    - { from: runner, to: claude, label: turn + tools, points: [[568, 412], [1040, 412]], labelAt: [800, 402], labelAnchor: middle }
    - { from: runner, to: render, label: render_frame, points: [[452, 448], [452, 548], [648, 548]], labelAt: [464, 500] }
    - { from: render, to: claude, label: PNG frames, points: [[800, 512], [800, 480], [1100, 480], [1100, 448]], labelAt: [950, 470], labelAnchor: middle }
    - { from: render, to: check, label: frames, points: [[920, 548], [1040, 548]], labelAt: [980, 538], labelAnchor: middle }
  trace:
    question: Make the second card bounce in like this reference video.
    steps:
      - { kind: code, text: "The browser turns the clip into moves, an easing guess and contact sheets" }
      - { kind: llm, text: "Clef-flash reads the message as a revision: medium effort, Opus" }
      - { kind: llm, text: "Claude reads the project overview, the reference sheets and the selected card" }
      - { kind: check, text: "apply_ops is validated whole; a bad op comes back with its index and a valid example" }
      - { kind: code, text: "The Durable Object commits one undo step and broadcasts it; the card moves live" }
      - { kind: check, text: "A rendered strip, the design lint and the Clef checklist confirm the result" }
  guarantees:
    - { title: Every Claude edit is one undo step., caption: Atomic batches with exact inverses }
    - { title: One renderer for editor, AI and export., caption: The same pure renderToSvg }
    - { title: One write path for humans and AI., caption: Same validator, same Durable Object }
    - { title: 55 / 57 messages routed right., accent: 55 / 57, caption: "Clef-flash eval · never under-picked effort" }
decisions:
  - chose: JSON ops on a scene graph
    over: letting the model write animation code
    because: Ops can be validated, synced and undone exactly, and they render the same on server and client. Nothing the model writes needs a sandbox.
  - chose: the user's own Claude over MCP
    over: hosting a model and selling credits
    because: Generating motion is a commodity and people already pay for Claude. Keyline's AI bill stays near zero, with no markup to explain.
  - chose: one SVG renderer everywhere
    over: canvas, WebGL or a headless browser
    because: One pure function gives the same picture in the editor, the browser export and the Worker frames Claude checks. No render servers.
  - chose: a Durable Object per project
    over: a CRDT
    because: One authority per scene keeps validation and undo simple. Undo runs on the server, so it works across tabs and reloads.
aiSpecifics:
  - { key: Models, value: "claude-opus-5-5, claude-sonnet-5-5, Cloudflare Clef and Clef-flash, or your own Claude over MCP" }
  - { key: Routing, value: "Clef-flash sorts each chat message into question, tweak, revise or build" }
  - { key: Tool use, value: "31 MCP tools, reused one to one as the in-app chat's function calls" }
  - { key: Self-checks, value: "Worker-rendered frames, a design lint and a Clef vision checklist against references" }
  - { key: Cost controls, value: "Per-turn requests, 1h prompt cache, capped tool results, monthly budgets" }
  - { key: Evals, value: "Clef routing 55 / 57, frame detail checks 38 / 40 on real Workers AI" }
---

## Problem

AI can already generate an animation from a prompt. The hard part is the last 10%: "make this card a bit faster", "the bounce feels cheap". Words are a bad interface for timing and easing, and a chat can't be pointed at one element at 2.3 seconds, so people tune motion somewhere else and paste numbers back.

I wanted that loop to be the product: Claude builds, I watch, point at the exact frame and fix the feel by hand.

## What I'd do differently

I'd design the op format for the model first. My strict schemas made Claude fail whole batches, and errors pointed at expanded ops it never wrote. Now a lenient layer accepts names, aliases and defaults, then maps every error back to Claude's own op index with a valid example.

## Results

Live and free with Google or GitHub sign-in. I built it solo in a week, with Claude Code as my coding partner. Clef routing picked the right model and effort for 55 of 57 eval messages. Every chat call is logged with its cost, which is how I found a $3.90 turn and cut it.

## Next

Agent-made knobs: named sliders that drive many keyframes at once. Brand import for JavaScript-rendered sites. Lottie and GIF export, then open-sourcing the scene engine.
