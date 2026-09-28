import { expect, test } from "@playwright/test";

test("sections below the fold reveal when scrolled into view", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  const header = page.locator("#experience header").first();
  await expect(header).toHaveCSS("opacity", "0");
  await header.scrollIntoViewIfNeeded();
  await expect(header).toHaveCSS("opacity", "1");
});

test("reduced motion shows every section without a reveal", async ({ browser }) => {
  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 },
    reducedMotion: "reduce",
  });
  await page.goto("/");
  await expect(page.locator("#experience header").first()).toHaveCSS("opacity", "1");
  await page.close();
});

test("a VIEW label follows the mouse over project images", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  const frame = page.locator("#work [data-cursor]").first();
  await frame.scrollIntoViewIfNeeded();
  const box = (await frame.boundingBox())!;
  const label = page.locator("div[data-visible]");
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2, { steps: 3 });
  await expect(label).toHaveAttribute("data-visible", "true");
  await expect(label).toHaveText("View");
  await page.mouse.move(2, box.y + 2, { steps: 3 });
  await expect(label).toHaveAttribute("data-visible", "false");
});
