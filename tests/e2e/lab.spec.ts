import { expect, test, type Page } from "@playwright/test";

// smooth scroll keeps moving after Playwright scrolls; wait until the page is still before reading positions
async function waitForStillScroll(page: Page) {
  await expect
    .poll(async () => {
      const a = await page.evaluate(() => window.scrollY);
      await page.waitForTimeout(120);
      return a === (await page.evaluate(() => window.scrollY));
    })
    .toBe(true);
}

test("only the text of a Lab row switches the preview", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  // Lab is on the employer pages
  await page.goto("/ai");
  const rows = page.locator("#lab li");
  const previews = page.locator("[data-lab-preview]");

  // hover scrolls the row into view; let smooth scroll settle first, or the page moves under the mouse
  await rows.nth(1).scrollIntoViewIfNeeded();
  await waitForStillScroll(page);
  await rows.nth(1).locator("h3").hover();
  await expect(rows.nth(0).locator("h3")).toHaveCSS("color", "rgb(58, 58, 58)");
  await expect(previews.nth(1)).toHaveCSS("opacity", "1");

  // empty space in the first row, outside its text, must not steal the preview
  await waitForStillScroll(page);
  const box = await rows.nth(0).boundingBox();
  // the row's top padding: empty, whatever width the text block takes
  await page.mouse.move(box!.x + box!.width / 2, box!.y + 8);
  await expect(previews.nth(1)).toHaveCSS("opacity", "1");
  await expect(previews.nth(0)).toHaveCSS("opacity", "0");
});
