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
