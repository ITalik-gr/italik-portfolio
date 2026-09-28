import { test } from "@playwright/test";
import { OUTPUT_DIR, VIEWPORTS } from "./viewports";

// add case slugs here as /work/[slug] pages appear
const ROUTES = [
  { name: "home", path: "/" },
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
