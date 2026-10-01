import { expect, test } from "@playwright/test";

test("All work returns to the section the case was opened from", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  // Client work and Lab are on the employer pages
  await page.goto("/ai");

  await page.locator("#clients a[href^='/work/']").first().click();
  await expect(page).toHaveURL(/\/work\//);
  await page.getByRole("link", { name: "← All work" }).click();
  await expect(page).toHaveURL(/\/ai#clients$/);
  await expect(page.locator("#clients-title")).toBeInViewport();

  await page.locator("#lab a[href^='/work/']").first().click();
  await expect(page).toHaveURL(/\/work\//);
  await expect(page.getByRole("link", { name: "← All work" })).toHaveAttribute("href", "/ai#lab");
});
