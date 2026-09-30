import { expect, test } from "@playwright/test";

test("only the text of a Lab row switches the preview", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  const rows = page.locator("#lab li");
  const previews = page.locator("[data-lab-preview]");

  // hover scrolls the row into view; let smooth scroll settle first, or the page moves under the mouse
  await rows.nth(1).scrollIntoViewIfNeeded();
  await page.waitForTimeout(600);
  await rows.nth(1).locator("h3").hover();
  await expect(rows.nth(0).locator("h3")).toHaveCSS("color", "rgb(58, 58, 58)");
  await expect(previews.nth(1)).toHaveCSS("opacity", "1");

  // empty space to the right of the first row's text must not steal the preview
  const box = await rows.nth(0).boundingBox();
  await page.mouse.move(box!.x + box!.width - 10, box!.y + box!.height / 2);
  await expect(previews.nth(1)).toHaveCSS("opacity", "1");
  await expect(previews.nth(0)).toHaveCSS("opacity", "0");
});
