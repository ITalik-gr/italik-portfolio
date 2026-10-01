import fs from "node:fs";
import path from "node:path";
import { expect, test } from "@playwright/test";
import matter from "gray-matter";

// the blog shows up with its first published article, so the checks follow what content/posts holds
const posts = fs
  .readdirSync(path.join(process.cwd(), "content/posts"))
  .filter((file) => file.endsWith(".md"))
  .map((file) => ({
    slug: file.replace(/\.md$/, ""),
    draft: Boolean(matter.read(path.join("content/posts", file)).data.draft),
  }));
const published = posts.filter((post) => !post.draft);
const drafts = posts.filter((post) => post.draft);

test("the blog exists only with a published article: index, feed, nav link, home block, sitemap", async ({
  page,
  request,
}) => {
  const hasBlog = published.length > 0;
  expect((await request.get("/blog")).status()).toBe(hasBlog ? 200 : 404);
  expect((await request.get("/blog/rss.xml")).status()).toBe(hasBlog ? 200 : 404);
  const sitemap = await (await request.get("/sitemap.xml")).text();
  expect(sitemap.includes("/blog")).toBe(hasBlog);

  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  const navBlog = page.getByRole("navigation", { name: "Main" }).getByRole("link", { name: "Blog" });
  await expect(navBlog).toHaveCount(hasBlog ? 1 : 0);
  await expect(page.locator("#writing")).toHaveCount(hasBlog ? 1 : 0);
});

test("the RSS feed is valid and lists only published articles", async ({ request }) => {
  test.skip(published.length === 0, "no published article yet");
  const response = await request.get("/blog/rss.xml");
  expect(response.headers()["content-type"]).toContain("application/rss+xml");
  const xml = await response.text();
  expect(xml).toMatch(/^<\?xml version="1.0"/);
  expect(xml).toContain('<rss version="2.0"');
  expect(xml.match(/<item>/g)?.length).toBe(published.length);
  for (const post of published) expect(xml).toContain(`/blog/${post.slug}</link>`);
  for (const post of drafts) expect(xml).not.toContain(`/blog/${post.slug}<`);
  // every opened tag closes: a cheap well-formedness check without an XML parser
  for (const tag of ["rss", "channel", "item", "title", "link", "description"]) {
    expect(xml.split(`<${tag}`).length, tag).toBe(xml.split(`</${tag}>`).length);
  }
});

test("an article page: one h1, canonical, Markdown blocks and the client CTA", async ({ page }) => {
  const post = posts[0];
  test.skip(!post, "no articles");
  await page.goto(`/blog/${post.slug}`);
  await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", new RegExp(`/blog/${post.slug}$`));
  const article = page.locator("article");
  await expect(article.locator("h2").first()).toBeVisible();
  await expect(article.locator("p").first()).toBeVisible();
  await expect(page.locator("#start")).toBeVisible();
  if (post.draft) {
    await expect(article.getByText("Draft", { exact: true })).toBeVisible();
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  }
});

test("tag chips filter the list through the URL, and an unknown tag shows the empty state", async ({ page }) => {
  test.skip(published.length === 0, "no published article yet");
  await page.goto("/blog");
  const chip = page.getByRole("link", { name: /^LLM/ }).first();
  await chip.click();
  await expect(page).toHaveURL(/\/blog\?tag=llm$/);
  await expect(chip).toHaveAttribute("aria-current", "page");
  await expect(page.locator(`a[href^="/blog/"]`).first()).toBeVisible();

  await page.goto("/blog?tag=nothing-here");
  await expect(page.getByText(/^Nothing tagged/)).toBeVisible();
  await page.getByRole("link", { name: "← All posts" }).click();
  await expect(page).toHaveURL(/\/blog$/);
});
