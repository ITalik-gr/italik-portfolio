import { expect, test } from "@playwright/test";

test("services page: one h1, nav anchors lead to the client home, the project CTA mails with a subject", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  // even after an employer page, /services belongs to the client home
  await page.goto("/ai");
  await page.goto("/services");
  await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
  const nav = page.getByRole("navigation", { name: "Main" });
  await expect(nav.getByRole("link", { name: "Work" })).toHaveAttribute("href", "/#work");
  await expect(nav.getByRole("link", { name: "Contact" })).toHaveAttribute("href", "#contact");
  await expect(page.getByRole("link", { name: /Tell me about your project/ })).toHaveAttribute(
    "href",
    /^mailto:.+\?subject=/,
  );
  await page.getByRole("button", { name: "Ask my AI about me" }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
});

test("services are in the client nav, and only in the footer on employer pages", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  const navServices = page
    .getByRole("navigation", { name: "Main" })
    .getByRole("link", { name: "Services" });

  await page.goto("/");
  await expect(navServices).toHaveAttribute("href", "/services");

  await page.goto("/ai");
  await expect(navServices).toHaveCount(0);
  await expect(page.locator("#contact").getByRole("link", { name: /See services/ })).toHaveAttribute(
    "href",
    "/services",
  );
});

test("the client footer has no Open to work and links employers to the portfolio", async ({
  page,
}) => {
  await page.goto("/");
  const footer = page.locator("#contact");
  await expect(footer.getByText("Open to work")).toHaveCount(0);
  await expect(footer.getByRole("link", { name: /Hiring\?/ })).toHaveAttribute("href", "/ai");

  await page.goto("/ai");
  await expect(page.locator("#contact").getByText("Open to work")).toBeVisible();
  await expect(page.locator("#contact").getByRole("link", { name: /Hiring\?/ })).toHaveCount(0);
});
