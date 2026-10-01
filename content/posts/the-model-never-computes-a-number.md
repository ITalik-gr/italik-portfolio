---
title: The model never computes a number
slug: the-model-never-computes-a-number
date: "2026-10-01"
summary: My AI finance advisor invented numbers on real bank data, and better prompts didn't fix it. Moving every calculation into SQL did.
tags: [ai, llm, money-track]
draft: true
---

## The problem: the advisor made numbers up

Money Track is my personal finance app. It syncs bank statements, sorts spending into categories and has an AI advisor you can ask things like "can I afford this?"

On real data, the advisor invented numbers. It gave totals that looked right and weren't. In a finance app, a confidently wrong number is worse than no answer at all, because you act on it.

## What didn't work: better prompts

My first reaction was the usual one: write a better prompt. Tell the model to be careful, to only use the data it was given, to say "I don't know" when unsure.

It helped a little and fixed nothing. A model that adds up a hundred transactions will sometimes get it wrong, however politely you ask. The prompt was never the real problem.

## The fix: every number comes from SQL

So I took arithmetic away from the model completely.

- Every figure is computed in SQL, by the same queries the app's screens use.
- The model gets that snapshot plus read-only tools. It explains and phrases. It never adds anything up itself.
- Before an answer is shown, a check drops any figure or date that isn't in the snapshot.

The result: if the database didn't produce a number, you don't see it.

![The AI chat in Money Track. Every figure in the answer comes from the snapshot.](/work/money-track/chat-desktop-dark.png "Every figure in the chat answer comes from SQL; the model only explains it.")

## Categorisation: rules first, the model only where needed

The same idea works for sorting transactions into categories.

1. Plain rules run first: known merchants, subscriptions, what most users filed a merchant under, the bank's category codes.
2. Only the rows the rules can't settle go to a model.
3. A small, cheap model files a row only when it's at least 80% sure. Everything else goes to a stronger one.

That cascade gets about 97% of categories right at about 80% lower cost than sending every row to the strong model. On 36 merchants it had never seen, the strong model got 35 root categories right, and the whole run cost $0.03.

## The lesson: write the eval set before the prompt

One mistake cost me time. I tuned a model on my own dataset and it scored 98.9%. On 36 merchants written afterwards, it scored 72%.

The cause was a "condensed guide": a shorter copy of the category rules I had written by hand. It was a second definition of the same thing, and I've since removed that pattern across the codebase.

Now I write the test cases first, before the first prompt, and keep one source for the rules.

## What it means for your product

If your AI feature gives answers about money, stock, bookings or anything else people act on:

- Let code compute the facts and let the model talk about them.
- Check every answer against the data before it reaches the user.
- Send the model only the work rules can't do. It's cheaper and more accurate.
- Measure on cases the model hasn't seen, or you're measuring your own prompt.

You can try it yourself: the [Money Track demo](https://money.italik.dev/demo) creates a private sandbox with six months of sample data that resets after 24 hours. The code is [open source](https://github.com/ITalik-gr/money-track), and the [case study](/work/money-track) goes deeper into the architecture.

Does your model invent numbers too? Tell me what you're building, on [Telegram](https://t.me/ITalik_gr) or by [email](mailto:italik.gr@gmail.com).
