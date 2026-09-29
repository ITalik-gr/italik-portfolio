import { expect, test } from "@playwright/test";

test("Ask AI button stays hidden on the first screen and near the page end", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  const fab = page.locator("button.fixed", { hasText: "Ask AI" });

  // the hero already has its own "Ask my AI about me" button
  await expect(fab).toHaveCSS("opacity", "0");
  await expect(fab).toHaveAttribute("aria-hidden", "true");

  await page.locator("#lab").scrollIntoViewIfNeeded();
  await expect(fab).toHaveCSS("opacity", "1");

  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  await expect(fab).toHaveCSS("opacity", "0");
});

test("Ask AI button hides on the hero after client navigation back home", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  const fab = page.locator("button.fixed", { hasText: "Ask AI" });

  // client-side navigation keeps the layout (and the button) mounted
  await page.locator('a[href^="/work/"]').first().click();
  await page.waitForURL(/\/work\//);
  await page.locator('a[href="/"]').first().click();
  await page.waitForURL(/\/$/);

  await expect(fab).toHaveCSS("opacity", "0");
});
