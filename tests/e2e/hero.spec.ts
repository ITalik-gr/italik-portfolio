import { expect, test } from "@playwright/test";

test("split hero title reads as one heading", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await expect(
    page.getByRole("heading", { level: 1, name: "I build AI agents that ship" }),
  ).toBeVisible();
});

test("hero fits the first screen with its buttons", async ({ page }) => {
  for (const size of [
    { width: 1440, height: 900 },
    { width: 390, height: 844 },
  ]) {
    await page.setViewportSize(size);
    await page.goto("/");
    const button = page.locator("section[aria-labelledby=hero-title]").getByRole("link", { name: "View work" });
    const box = (await button.boundingBox())!;
    expect(box.y + box.height).toBeLessThanOrEqual(size.height);
  }
});

test("reduced motion keeps the hero title static", async ({ browser }) => {
  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 },
    reducedMotion: "reduce",
  });
  await page.goto("/");
  const letter = page.locator("[data-letter]").first();
  await expect(letter).toHaveCSS("animation-name", "none");
  await page.close();
});
