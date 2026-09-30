import { expect, test } from "@playwright/test";

test("services page: one h1, nav anchors lead home, the project CTA mails with a subject", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/services");
  await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
  await expect(
    page.getByRole("navigation", { name: "Main" }).getByRole("link", { name: "Experience" }),
  ).toHaveAttribute("href", "/#experience");
  await expect(page.getByRole("link", { name: /Tell me about your project/ })).toHaveAttribute(
    "href",
    /^mailto:.+\?subject=/,
  );
  await page.getByRole("button", { name: "Ask my AI about me" }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
});

test("home links to services from the header and the contact footer", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await expect(
    page.getByRole("navigation", { name: "Main" }).getByRole("link", { name: "Services" }),
  ).toHaveAttribute("href", "/services");
  await expect(page.locator("#contact").getByRole("link", { name: /See services/ })).toHaveAttribute(
    "href",
    "/services",
  );
});
