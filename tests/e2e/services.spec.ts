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

test("client pages end with the CTA: Telegram first, then email", async ({ page }) => {
  for (const path of ["/", "/services"]) {
    await page.goto(path);
    const cta = page.locator("#start");
    await expect(cta.getByRole("heading", { level: 2 })).toHaveText("Have a product in mind?");
    const links = cta.getByRole("link");
    await expect(links.nth(0)).toHaveAttribute("href", /^https:\/\/t\.me\//);
    await expect(links.nth(1)).toHaveAttribute("href", /^mailto:/);
  }
  await page.goto("/ai");
  await expect(page.locator("#start")).toHaveCount(0);
});

test("the client home is short: offers, proof, how I work, no Experience or Skills", async ({
  page,
}) => {
  await page.goto("/");
  const ids = await page.locator("main > section[id]").evaluateAll((els) => els.map((el) => el.id));
  expect(ids.slice(0, 3)).toEqual(["services", "work", "how"]);
  expect(ids).not.toContain("experience");
  expect(ids).not.toContain("skills");
  await expect(page.locator("#how li")).toHaveCount(4);
});

test("a case ends with the client bridge, unless the visitor came from an employer page", async ({
  page,
}) => {
  const bridge = page.getByRole("heading", { name: "Need something like this?" });

  await page.goto("/work/money-track");
  await expect(bridge).toBeAttached();
  await page.goto("/work/ppc-io");
  await expect(bridge).toBeAttached();

  await page.goto("/fullstack");
  await page.goto("/work/money-track");
  await expect(bridge).toHaveCount(0);
});
