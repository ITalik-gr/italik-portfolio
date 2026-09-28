import { expect, test } from "@playwright/test";

test("mobile menu opens, locks scroll and closes on Escape", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const toggle = page.getByRole("button", { name: "Open menu" });
  await toggle.click();
  await expect(page.getByRole("navigation", { name: "Mobile" })).toBeVisible();
  await expect(page.locator("html")).toHaveCSS("overflow", "hidden");
  await page.keyboard.press("Escape");
  await expect(page.getByRole("navigation", { name: "Mobile" })).toBeHidden();
});

test("desktop header shows nav and Kyiv time", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await expect(page.getByRole("navigation", { name: "Main" })).toBeVisible();
  await expect(page.locator("header time").first()).toHaveText(/^\d{2}:\d{2}$/);
});
