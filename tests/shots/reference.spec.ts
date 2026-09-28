import path from "node:path";
import { pathToFileURL } from "node:url";
import { test } from "@playwright/test";
import { OUTPUT_DIR, VIEWPORTS } from "./viewports";

// home and cases are desktop-only mockups; mobile.html is a 390 board
const REFERENCES = [
  { file: "home.html", viewports: ["1440"] },
  { file: "case-money-track.html", viewports: ["1440"] },
  { file: "case-ppc.html", viewports: ["1440"] },
  { file: "mobile.html", viewports: ["1440"] },
];

for (const ref of REFERENCES) {
  for (const viewport of VIEWPORTS.filter((v) => ref.viewports.includes(v.name))) {
    test(`${ref.file} @ ${viewport.name}`, async ({ page }) => {
      const url = pathToFileURL(path.resolve("design/reference", ref.file)).href;
      await page.setViewportSize(viewport);
      await page.goto(url);
      // bundles unpack themselves after load
      await page.waitForTimeout(5_000);
      await page.screenshot({
        path: `${OUTPUT_DIR}/reference/${ref.file.replace(".html", "")}-${viewport.name}.png`,
        fullPage: true,
      });
    });
  }
}
