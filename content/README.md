# content/

Every project is one Markdown file in `projects/`, every job one file in `experience/`. The frontmatter is validated by the Zod schemas in `lib/schemas.ts`: a wrong field fails the build instead of rendering a broken card.

## Adding a project

1. Create `projects/<slug>.md`; the file name must equal `slug`.
2. Fill the basics: `title`, `slug`, `kind` (`personal` | `client`), `order`, `status`, `typeLabel`, `summary`.
3. Decide **where it shows** with `show` (see below). Leave it out and the project exists only for the future `/work` page and the AI chat.
4. Add links under `links` and, if it has one, turn on its case page with `caseStudy: true`.

```yaml
---
title: Money Track
slug: money-track
kind: personal
show: [featured, lab]
caseStudy: true
order: 1
status: live
typeLabel: Personal · AI product
summary: One sentence for cards.
links:
  demo: https://money.italik.dev/demo
  code: https://github.com/ITalik-gr/money-track
---
```

## Where a project shows: `show`

| Value | Home section | Notes |
| --- | --- | --- |
| `featured` | 01 Featured | Big card with screenshot, key idea and buttons. Keep it to 1–2 projects. |
| `lab` | 02 Lab | Row with hover preview. When a project is also `featured`, the page morph starts from Featured unless the Lab row is the one clicked. |
| `now` | 03 Now building | Needs a `nowBuilding` block (the build fails without one). |
| `clients` | 04 Client work | Card in the client grid. |

Order inside every section follows `order` (lower first).

## Links: where clicks go

All project links come from `getProjectLinks()` in `lib/project-links.ts`; components never read `links` directly.

| Field | Meaning |
| --- | --- |
| `caseStudy: true` | The project has a page at `/work/<slug>`. "Case study →" buttons appear only then. Personal projects use template A, client projects template B. |
| `links.live` | The running product. Shown as "Live ↗". |
| `links.demo` | A demo, used when there is no `live`. Shown as "Live demo ↗". |
| `links.code` | Public repository. "Code ↗". |
| `internalLink` | An on-site target for projects without their own page, e.g. `/#ask`. |
| `hideLinks: true` | No outside links at all (NDA, migrated sites). Required for `status: nda`; cannot be combined with `caseStudy`. |

A title or card leads to the first that exists: case page → `internalLink` → live site. Its marker says which one it is ("Case study →", "Open →", "Live ↗"), so a label never points somewhere else. `tests/e2e/links.spec.ts` checks this on the home and case pages.

## Images

- `cover`: desktop screenshot, 16:10. Every home layout uses only this one.
- `coverMobile`: phone screenshot, 9:19.5, for case pages.
- `features[].image` (template A) and `gallery` (template B) are optional extra screens on case pages.

## Case pages

- Template A (`kind: personal`): `keyIdea`, `features`, `architecture`, `decisions`, `aiSpecifics` in the frontmatter; `## Problem`, `## What I'd do differently`, `## Results`, `## Next` in the body.
- Template B (`kind: client`): `highlights`, `outcome`, `gallery` in the frontmatter; `## Brief`, `## What I did` in the body.
- Text that starts with `TODO` renders greyed out as `[TODO · …]`, so drafts stay visible without passing as real claims. `draft: true` marks a case whose copy is not final.

## Blog posts

Every article is one Markdown file in `posts/`; the file name must equal `slug`. The blog (`/blog`, the nav link, the home "Writing" block, RSS, the sitemap) appears only once at least one post has `draft: false`. Drafts open only in `pnpm dev`, marked "Draft" and `noindex`.

```yaml
---
title: The model never computes a number      # under ~70 characters, a claim or a number
slug: the-model-never-computes-a-number
date: "2026-10-01"
summary: One sentence, a claim plus a number. Shown under the title, on cards and in search results.
tags: [AI, LLM, Case study]                   # display names; the first one is the breadcrumb
draft: true                                   # Claude drafts, Vitaliy publishes
audience: founders                            # founders | developers (labels hidden until BLOG.showAudience)
project: money-track                          # optional: adds "Live demo / Code / Case study" at the end
projectLinks: [demo, case]                    # optional: only these buttons; leave out for all that exist
keys:                                         # optional, up to 3: the key-numbers block and the cover
  - { value: "~97%", caption: categorisation accuracy }
  - { value: "~80%", caption: lower AI cost }
cover: /blog/<slug>/cover.png                 # optional 16:10 image; without it the first key number is the cover
canonical: https://dev.to/...                 # optional, only when the original lives elsewhere
---
```

Read time is counted from the text (about 220 words a minute).

### What the article page does on its own

- **Contents.** Every `##` heading becomes an item in the contents: a sticky list in the right margin on wide screens, a "Contents" bar under the header on phones. The current section is highlighted. Keep `##` headings short (2 to 6 words) so the list reads well; use `###` for sub-points, they stay out of the contents.
- **Key numbers.** `keys` render right under the title in large accent type, wider than the text. Put the one result a founder should remember first; it also becomes the cover.
- **Reading progress** line at the top, the project row (`project`; a general article without a project simply has none; `projectLinks` picks the buttons), the author block with Copy link and Share on X, related posts (most shared tags first) and previous / next. Each part hides itself when there is nothing to show.
- The site's CTA and footer close every article.

### Blocks you can use in the text

| Write | Get | Use it for |
| --- | --- | --- |
| `## Heading` | 40px section heading, in the contents | One per step of the story: problem, what failed, fix, result |
| `### Heading` | 24px sub-heading | A detail inside a section |
| `> One sentence.` | Large white pull quote | The one line people should quote. Once per article |
| `:::fail` … `:::` | Dark box labelled "✕ What didn't work" | The failed attempt and how you noticed. Every "how I solved it" post should have one |
| `:::note Title` … `:::` | Dark box labelled "Note", optional bold title | A side remark that would break the flow |
| `:::takeaway Title` … `:::` | Dark box with an H2 title, in the contents | "What this means for your product" at the end: 2 to 4 bullets in money, cost or reliability terms |
| `![alt](/path.png "Caption")` | Figure wider than the text, numbered "FIG. 1, 2…" | Screenshots and diagrams. Always write the caption: what to look at |
| ```` ```ts title="advisor/context.ts" ```` | Code with a file tab, language, Copy button, line numbers, grey highlighting | 5 to 25 lines that show the idea, with one sentence before it saying why it matters. TS, JS, SQL and shell are highlighted |
| A Markdown table | Rows with a mono label column; the last column is bright, the middle ones grey | Before → after comparisons: `\| \| Before \| After \|` |
| `1.` / `-` lists | Numbered `01 02 03` or dotted items | Steps and short lists |
| `` `code` ``, `**bold**`, `*italic*`, `[link](url)` | Inline styles; links in accent | Links to `/work/…` open on the site, the rest in a new tab |

Boxes can hold any of the other blocks (paragraphs, lists, code). Avoid em dashes everywhere, including captions and tables.
