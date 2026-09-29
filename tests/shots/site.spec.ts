import { test } from "@playwright/test";
import { OUTPUT_DIR, VIEWPORTS } from "./viewports";

// add case slugs here as /work/[slug] pages appear
const ROUTES = [
  { name: "home", path: "/" },
  { name: "case-money-track", path: "/work/money-track" },
  { name: "case-lottie-theme", path: "/work/lottie-theme" },
  { name: "case-tg-assistant", path: "/work/tg-assistant" },
  { name: "case-job-radar", path: "/work/job-radar" },
  { name: "case-doc-quiz-harness", path: "/work/doc-quiz-harness" },
  { name: "case-ask-about-me-chat", path: "/work/ask-about-me-chat" },
  { name: "case-ppc-io", path: "/work/ppc-io" },
  { name: "case-answerly", path: "/work/answerly" },
  { name: "case-sollas-co", path: "/work/sollas-co" },
  { name: "case-backlinks", path: "/work/backlinks" },
  // temporary, removed with the page before launch
  { name: "debug", path: "/debug" },
  { name: "ui", path: "/ui" },
];

for (const route of ROUTES) {
  for (const viewport of VIEWPORTS) {
    test(`${route.name} @ ${viewport.name}`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.goto(route.path);
      await page.evaluate(() => document.fonts.ready);
      await page.screenshot({
        path: `${OUTPUT_DIR}/site/${route.name}-${viewport.name}.png`,
        fullPage: true,
      });
    });
  }
}
