---
title: Answerly
slug: answerly
kind: client
show: [clients]
caseStudy: true
order: 12
status: offline
statusNote: startup closed
tags: [web-app]
typeLabel: Client · startup web app
via: Sollas
summary: "A creator startup built end to end by one developer: real-time chat, auth, Stripe Checkout and Connect, payouts."
role: Sole developer, full stack
timeline: "2023"
stack: [React, Node.js, Firebase, Stripe]
cover: /work/answerly/cover.jpg
gallery:
  - { kind: desktop, label: Ask and pay flow, src: /work/answerly/ask.jpg }
  - { kind: desktop, label: Paid question chat, src: /work/answerly/chat.jpg }
  - { kind: desktop, label: Stripe Connect onboarding, src: /work/answerly/connected-stripe.jpg }
  - { kind: desktop, label: Creator inbox, src: /work/answerly/chats.jpg }
highlights:
  - title: Pay-per-question flow
    text: "Ask, pay with Stripe Checkout, sign in, get the answer: four steps, with the payment attached to the question it pays for."
  - title: Creator payouts via Stripe Connect
    text: Creators connect their own Stripe account; the platform keeps its fee and webhooks drive the payouts.
  - title: Real-time chat
    text: Every paid question becomes a live thread between the asker and the creator, with a separate inbox for each side.
---

## Brief

The founders needed a working product with money flowing to creators: accounts, real-time chat and payments. I built all of it solo, with Stripe Checkout for askers, Stripe Connect payouts for creators and webhooks keeping orders and payouts in sync.

Answerly was an early-stage startup: creators share a link with their followers, and followers pay to ask them a question.

## What I did

I was the only developer and built the full stack in React, Node.js and Firebase: registration and Google sign-in, creator profiles with a shareable link, and real-time user-to-user chat.

Payments run on Stripe. Askers pay through Checkout before the question is sent; creators onboard with Stripe Connect and get paid out, with webhooks keeping orders and payouts in sync. Hosting, database and analytics are on Firebase.

The startup has since closed, so the product is offline.
