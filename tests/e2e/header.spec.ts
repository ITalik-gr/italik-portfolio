import { expect, test, type Page } from "@playwright/test";

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

test("desktop header: Kyiv time for employers, the reply promise for clients", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/ai");
  await expect(page.getByRole("navigation", { name: "Main" })).toBeVisible();
  await expect(page.locator("header time").first()).toHaveText(/^\d{2}:\d{2}$/);

  await page.goto("/");
  await expect(page.locator("header time")).toHaveCount(0);
  await expect(page.locator("header").getByText("Replies the same day").first()).toBeVisible();
});

async function navLabels(page: Page, name: string) {
  const nav = page.getByRole("navigation", { name });
  await expect(nav).toBeVisible();
  return nav.getByRole("link").allTextContents();
}

test("client pages get the client nav, without Open to work or a CV", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  for (const path of ["/", "/services"]) {
    await page.goto(path);
    expect(await navLabels(page, "Main")).toEqual(["Work", "Services", "About", "Contact"]);
    await expect(page.locator("header").getByText("Open to work")).toHaveCount(0);
    await expect(page.locator("header").getByRole("link", { name: "CV" })).toHaveCount(0);
  }

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.getByRole("button", { name: "Open menu" }).click();
  expect(await navLabels(page, "Mobile")).toEqual(["Work", "Services", "About", "Contact"]);
  await expect(page.locator("#mobile-menu").getByText("Open to work")).toHaveCount(0);
});

test("employer pages keep their nav, Open to work and the CV", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  for (const path of ["/ai", "/fullstack", "/frontend"]) {
    await page.goto(path);
    expect(await navLabels(page, "Main")).toEqual(["Work", "Experience", "About", "Ask AI"]);
    // the first copy is the desktop one; the mobile menu has its own
    await expect(page.locator("header").getByText("Open to work").first()).toBeVisible();
    await expect(page.locator("header").getByRole("link", { name: "CV" })).toBeVisible();
  }

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/ai");
  await page.getByRole("button", { name: "Open menu" }).click();
  expect(await navLabels(page, "Mobile")).toEqual(["Work", "Experience", "About", "Ask AI"]);
});

test("a case page follows the home page the visitor came from", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  const status = page.locator("header").getByText("Open to work").first();

  await page.goto("/work/money-track");
  await expect(status).toHaveCount(0);

  await page.goto("/ai");
  await page.goto("/work/money-track");
  await expect(status).toBeVisible();
});
