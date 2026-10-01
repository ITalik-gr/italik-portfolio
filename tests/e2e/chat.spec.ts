import { expect, test, type Page } from "@playwright/test";

// the real model is not called in e2e: /api/chat is replaced with a canned NDJSON stream
const answer = [
  { type: "text", text: "Vitaliy built Money Track, an AI finance app " },
  { type: "text", text: "where the model never computes a number." },
  {
    type: "done",
    sources: [{ label: "money-track.md", href: "/work/money-track" }],
    link: { label: "Read the case study", href: "/work/money-track" },
  },
];

async function mockChat(page: Page, body: string, status = 200) {
  await page.route("**/api/chat", (route) =>
    route.fulfill({ status, contentType: "application/x-ndjson", body }),
  );
}

test("the FAB opens the chat drawer and an answer streams in with its sources", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await mockChat(page, answer.map((event) => JSON.stringify(event)).join("\n") + "\n");
  await page.goto("/work/money-track");

  await page.getByRole("button", { name: "Ask AI" }).click();
  const drawer = page.getByRole("dialog", { name: "Ask AI about Vitaliy" });
  await expect(drawer).toBeVisible();
  await expect(drawer.getByText("Example answer")).toBeVisible();

  await drawer.getByRole("textbox").fill("What AI agents has he built?");
  await drawer.getByRole("textbox").press("Enter");

  await expect(drawer.getByText("where the model never computes a number.")).toBeVisible();
  await expect(drawer.getByText("Answered · grounded")).toBeVisible();
  await expect(drawer.getByRole("link", { name: "money-track.md" })).toHaveAttribute(
    "href",
    "/work/money-track",
  );
  await expect(drawer.getByText("Example answer")).toBeHidden();

  await page.keyboard.press("Escape");
  await expect(drawer).toBeHidden();
});

test("limits and outages show a friendly message with the email", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await mockChat(page, JSON.stringify({ type: "error", code: "budget" }) + "\n", 503);
  await page.goto("/");

  const section = page.locator("#ask");
  await section.getByRole("textbox").fill("Is he a fit for a full-stack role?");
  await section.getByRole("button", { name: /send/i }).click();
  await expect(section.getByText("The chat is resting for today")).toBeVisible();
  await expect(section.getByText("Something broke")).toBeVisible();
});

test("the drawer suggests the questions of the page's audience", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/blog/the-model-never-computes-a-number");
  await page.getByRole("button", { name: "Ask AI" }).last().click({ force: true });
  const drawer = page.getByRole("dialog", { name: "Ask AI about Vitaliy" });
  await expect(drawer.getByRole("button", { name: "How do we start?" })).toBeVisible();
  await page.keyboard.press("Escape");

  await page.goto("/fullstack");
  await page.evaluate(() => window.scrollTo(0, 2500));
  await page.getByRole("button", { name: "Ask AI" }).last().click({ force: true });
  await expect(drawer.getByRole("button", { name: "How did he build Answerly's payments?" })).toBeVisible();
});
