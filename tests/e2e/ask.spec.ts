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
  await page.goto("/");

  const section = page.locator("#ask");
  await section.getByRole("button", { name: "What AI agents has he built?" }).click();
  await expect(section.getByText("Mocked answer.")).toBeVisible();
  expect(sent).toBe("What AI agents has he built?");
});
