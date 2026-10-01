import { expect, test } from "@playwright/test";

for (const path of ["/", "/ai", "/fullstack", "/frontend", "/services"]) {
  test(`${path} renders without console errors`, async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });
    await page.goto(path);
    await expect(page.locator("h1")).toHaveCount(1);
    expect(errors).toEqual([]);
  });
}
