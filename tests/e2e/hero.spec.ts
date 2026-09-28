import { expect, test } from "@playwright/test";

test("split hero title reads as one heading and letters react to the mouse", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await expect(
    page.getByRole("heading", { level: 1, name: "I build AI agents that ship" }),
  ).toBeVisible();

  const letter = page.locator("[data-letter]").nth(9);
  const box = (await letter.boundingBox())!;
  await page.mouse.move(box.x - 40, box.y + box.height / 2);
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2, { steps: 5 });
  await expect
    .poll(async () => Number(await letter.evaluate((el) => el.style.fontWeight)))
    .toBeGreaterThan(760);
});

test("reduced motion keeps the hero title static", async ({ browser }) => {
  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 },
    reducedMotion: "reduce",
  });
  await page.goto("/");
  const letter = page.locator("[data-letter]").first();
  await expect(letter).toHaveCSS("animation-name", "none");
  await page.mouse.move(200, 300);
  await page.mouse.move(220, 320);
  await expect(letter).not.toHaveAttribute("style", /font-weight/);
  await page.close();
});

test("the working-brain canvas is decorative and pauses off screen", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  const canvas = page.locator("section[aria-labelledby=hero-title] canvas");
  await expect(canvas).toHaveAttribute("aria-hidden", "true");
  await expect.poll(() => canvas.evaluate((c: HTMLCanvasElement) => c.width)).toBeGreaterThan(300);
});
