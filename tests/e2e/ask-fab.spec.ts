import { expect, test } from "@playwright/test";

test("Ask AI button hides over the hero CTA and near the page end", async ({ page }) => {
  // short viewport: the hero CTA starts below the fold
  await page.setViewportSize({ width: 1440, height: 600 });
  await page.goto("/");
  const fab = page.locator('a[href="/#ask"].fixed');
  await expect(fab).toHaveCSS("opacity", "1");

  await page.locator("[data-hides-fab]").scrollIntoViewIfNeeded();
  await expect(fab).toHaveCSS("opacity", "0");

  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  await expect(fab).toHaveCSS("opacity", "0");
  await expect(fab).toHaveAttribute("aria-hidden", "true");
});
