import { expect, test } from "@playwright/test";

test("AI page order puts experience before client work and now-building after Ask AI", async ({
  page,
}) => {
  await page.goto("/ai");
  const ids = await page.locator("main > section[id]").evaluateAll((els) => els.map((el) => el.id));
  expect(ids.indexOf("experience")).toBeLessThan(ids.indexOf("clients"));
  expect(ids.indexOf("now")).toBeGreaterThan(ids.indexOf("ask"));
});

test("the memoji in About jumps to contacts, the one in the footer emails", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  const about = page.locator("#about").getByRole("link", { name: /jump to contacts/ });
  await expect(about).toHaveAttribute("href", "#contact");
  // let smooth scroll settle on About first, so the click starts a clean anchor glide
  await page.locator("#about").scrollIntoViewIfNeeded();
  await expect
    .poll(
      () =>
        page.evaluate(() =>
          Math.round(document.getElementById("about")!.getBoundingClientRect().top),
        ),
      { timeout: 5000 },
    )
    .toBeLessThan(900);
  await page.waitForTimeout(600);
  await about.click();
  await expect(page.locator("#contact-title")).toBeInViewport({ timeout: 10_000 });
  await expect(page.locator("#contact").getByRole("link", { name: /^Email / })).toHaveAttribute(
    "href",
    /^mailto:/,
  );
});
