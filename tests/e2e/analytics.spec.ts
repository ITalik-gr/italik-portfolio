import { expect, test, type Page } from "@playwright/test";

type Event = [string, Record<string, unknown>];

// the real Umami script stays blocked; a stub records every event the site sends
async function recordEvents(page: Page) {
  await page.route("https://cloud.umami.is/**", (route) => route.abort());
  await page.addInitScript(() => {
    const events: unknown[] = [];
    Object.assign(window, { __events: events, umami: { track: (e: string, d: unknown) => events.push([e, d]) } });
  });
  return async (name: string) =>
    ((await page.evaluate(() => (window as unknown as { __events: Event[] }).__events)) as Event[]).filter(
      ([event]) => event === name,
    );
}

test("contact clicks carry the channel, the block, the page and the audience", async ({ page }) => {
  const events = await recordEvents(page);
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  const telegram = page.locator("#start").getByRole("link", { name: /Telegram/ });
  await telegram.evaluate((link) => link.addEventListener("click", (e) => e.preventDefault()));
  await telegram.click();

  const [[, data]] = await events("contact_click");
  expect(data).toMatchObject({ channel: "telegram", place: "start", page: "client-home", audience: "client", home: "/" });
  expect(data.label).toContain("Telegram");
});

test("the chat reports where it was opened and how a question was asked, never the typed text", async ({ page }) => {
  const events = await recordEvents(page);
  await page.route("**/api/chat", (route) =>
    route.fulfill({
      contentType: "application/x-ndjson",
      body: `${JSON.stringify({ type: "text", text: "Yes." })}\n${JSON.stringify({ type: "done", sources: [{ label: "about-me.md", href: "/#about" }] })}\n`,
    }),
  );
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/ai");
  await page.locator("#ask").getByRole("button", { name: "What AI agents has he built?" }).click();
  await expect(page.locator("#ask").getByText("Yes.")).toBeVisible();

  const [[, message]] = await events("chat_message");
  expect(message).toMatchObject({ place: "section", source: "chip", chip: "What AI agents has he built?", audience: "employer" });
  const [[, answer]] = await events("chat_answer");
  expect(answer).toMatchObject({ turn: 1, sources: 1, source: "about-me.md" });

  await page.locator("#ask").getByRole("textbox").fill("a private question");
  await page.locator("#ask").getByRole("button", { name: /send/i }).click();
  const typed = (await events("chat_message"))[1][1];
  expect(typed).toMatchObject({ source: "typed", chars: 18 });
  expect(JSON.stringify(typed)).not.toContain("private");
});

test("an article reports contents clicks and copies", async ({ page, context }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  const events = await recordEvents(page);
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/blog/the-model-never-computes-a-number");
  await page.getByRole("navigation", { name: "Contents" }).getByRole("link").nth(1).click();
  const [[, toc]] = await events("toc_click");
  expect(toc).toMatchObject({ via: "rail", number: "2", page: "article", post: "the-model-never-computes-a-number" });

  await page.getByRole("button", { name: "Copy link" }).click();
  const [[, share]] = await events("share");
  expect(share).toMatchObject({ method: "copy_link", post: "the-model-never-computes-a-number" });
});
