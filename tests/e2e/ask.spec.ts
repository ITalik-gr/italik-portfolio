import { expect, test } from "@playwright/test";

test("a suggestion chip asks its question right away", async ({ page }) => {
  let sent = "";
  await page.route("**/api/chat", async (route) => {
    sent = route.request().postDataJSON().messages.at(-1).content;
    await route.fulfill({
      contentType: "application/x-ndjson",
      body: `${JSON.stringify({ type: "text", text: "Mocked answer." })}\n${JSON.stringify({ type: "done", sources: [] })}\n`,
    });
  });
  await page.goto("/ai");

  const section = page.locator("#ask");
  await section.getByRole("button", { name: "What AI agents has he built?" }).click();
  await expect(section.getByText("Mocked answer.")).toBeVisible();
  expect(sent).toBe("What AI agents has he built?");
});

test("the client home asks founder questions, the employer pages recruiter ones", async ({ page }) => {
  await page.goto("/");
  const chips = page.locator("#ask").getByRole("button", { name: "How do we start?" });
  await expect(chips).toBeVisible();
  await expect(page.locator("#ask").getByText("Ask anything about building your product with me.")).toBeVisible();

  await page.goto("/ai");
  await expect(page.locator("#ask").getByRole("button", { name: "How do we start?" })).toHaveCount(0);
  await expect(page.locator("#ask").getByText("Ask it anything a recruiter would.")).toBeVisible();
});
