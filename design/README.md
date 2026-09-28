# design/

Visual reference exported from Claude Design (as of 2026-09-28). **Not production code**: these are prototypes (React + inline styles in a bundle). Use them to see how things should look and move, and to compare screenshots. The site itself is written from scratch.

## Files
```
design/reference/
  home.html               # home, desktop 1440 (final picks: lime · hero B · monogram · subline 2 · featured on)
  mobile.html             # key screens at 390 (hero A/B, lab, chat drawer, case top, contact)
  case-money-track.html   # case study, template A (personal / AI project)
  case-ppc.html           # case study, template B (client project)
  comparison.html         # hero / name / subline variants (history of the choice)
  screenshots/
    home-1440.jpg
    case-money-track-1440.jpg
    mobile-screens.jpg
    comparison.jpg
```
- The HTML files are self-contained bundles: open them in a browser without a server and wait ~5 s.
- `home.html` is a desktop layout and is **not** responsive at 390; mobile behaviour is shown in `mobile.html`.
- Dashed green frames labelled "motion · …" are **animation notes**, not part of the UI.

## Working with the reference
1. Open a file in Playwright (`file://…`), wait ~5 s, screenshot the section at 1440 (and 390 for `mobile.html`).
2. After each section, compare the implementation screenshots with the reference.
3. Missing values can be read from the reference DOM via `getComputedStyle`.
