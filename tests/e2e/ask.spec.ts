import { expect, test } from "@playwright/test";

test("suggestion chips fill the chat input", async ({ page }) => {
  await page.goto("/");
  const input = page.locator("#ask-input");
  await page.getByRole("button", { name: "What AI agents has he built?" }).click();
  await expect(input).toHaveValue("What AI agents has he built?");
});
