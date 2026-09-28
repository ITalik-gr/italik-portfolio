import { expect, test } from "@playwright/test";

test("anchor links land the section just under the sticky header", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await page
    .getByRole("navigation", { name: "Main" })
    .getByRole("link", { name: "Experience" })
    .click();
  await expect
    .poll(() =>
      page.evaluate(() =>
        Math.round(document.getElementById("experience")!.getBoundingClientRect().top),
      ),
    )
    .toBe(72);
});

test("wheel scroll is smoothed, and instant with reduced motion", async ({ browser }) => {
  for (const reducedMotion of ["no-preference", "reduce"] as const) {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion });
    await page.goto("/");
    await expect(page.locator("html")).toHaveClass(/lenis/);
    await page.mouse.move(700, 500);
    await page.mouse.wheel(0, 800);
    await page.waitForTimeout(60);
    const early = await page.evaluate(() => scrollY);
    if (reducedMotion === "reduce") expect(early).toBeGreaterThan(700);
    else expect(early).toBeLessThan(700);
    await page.close();
  }
});

test("the mobile menu pauses smooth scroll", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.getByRole("button", { name: "Open menu" }).click();
  await expect(page.locator("html")).toHaveClass(/lenis-stopped/);
});
