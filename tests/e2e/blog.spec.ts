import { expect, test } from "@playwright/test";

// e2e runs on `pnpm dev`; the only article is a draft, so the blog itself must stay hidden
const DRAFT = "/blog/the-model-never-computes-a-number";

test("with no published article there is no blog: no index, feed, nav link, home block or sitemap entry", async ({
  page,
  request,
}) => {
  expect((await request.get("/blog")).status()).toBe(404);
  expect((await request.get("/blog/rss.xml")).status()).toBe(404);
  expect(await (await request.get("/sitemap.xml")).text()).not.toContain("/blog");

  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await expect(page.getByRole("navigation", { name: "Main" }).getByRole("link", { name: "Blog" })).toHaveCount(0);
  await expect(page.locator("#writing")).toHaveCount(0);
});

test("a draft opens in dev for reading, marked and kept out of search", async ({ page }) => {
  await page.goto(DRAFT);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("The model never computes a number");
  await expect(page.locator("article").getByText("Draft", { exact: true })).toBeVisible();
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", /\/blog\/the-model-never-computes-a-number$/);
});

test("article Markdown renders headings, lists, figures and links", async ({ page }) => {
  await page.goto(DRAFT);
  const article = page.locator("article");
  await expect(article.locator("h2#the-fix-every-number-comes-from-sql")).toBeVisible();
  await expect(article.locator("ul li").first()).toBeVisible();
  await expect(article.locator("ol li")).toHaveCount(3);
  await expect(article.locator("figure figcaption")).toContainText("comes from SQL");
  await expect(article.getByRole("link", { name: "case study" })).toHaveAttribute("href", "/work/money-track");
  await expect(article.getByRole("link", { name: "Money Track demo" })).toHaveAttribute("target", "_blank");
  // the client CTA closes every article
  await expect(page.locator("#start")).toBeVisible();
});
