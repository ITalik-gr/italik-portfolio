import { expect, test } from "@playwright/test";

test("Ask AI button stays hidden on the first screen and near the page end", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  const fab = page.locator("button.fixed", { hasText: "Ask AI" });

  // the hero already has its own "Ask my AI about me" button
  await expect(fab).toHaveCSS("opacity", "0");
  await expect(fab).toHaveAttribute("aria-hidden", "true");

  await page.locator("#services").scrollIntoViewIfNeeded();
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

test("the chat drawer takes keyboard focus and keeps Tab inside", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/work/money-track");
  await page.evaluate(() => window.scrollTo(0, 2500));
  const fab = page.locator("button.fixed", { hasText: "Ask AI" });
  await expect(fab).toHaveCSS("opacity", "1");

  await fab.focus();
  await page.keyboard.press("Enter");
  const dialog = page.getByRole("dialog");
  await expect(dialog.getByRole("textbox")).toBeFocused();

  for (let i = 0; i < 12; i++) {
    await page.keyboard.press("Tab");
    expect(await dialog.evaluate((el) => el.contains(document.activeElement))).toBe(true);
  }

  await page.keyboard.press("Escape");
  await expect(fab).toBeFocused();
});
