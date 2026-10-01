import { expect, test } from "@playwright/test";

test("each employer page hands out its own CV, and a case keeps the one of the page it came from", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  const headerCv = page.locator("header").getByRole("link", { name: "CV" });

  await page.goto("/ai");
  await expect(headerCv).toHaveAttribute("href", "/cv.pdf");

  await page.goto("/frontend");
  await expect(headerCv).toHaveAttribute("href", "/cv/Vitaliy_Hrytsenko_Frontend.pdf");
  await expect(page.locator("footer").getByRole("link", { name: "CV" }).first()).toHaveAttribute(
    "href",
    "/cv/Vitaliy_Hrytsenko_Frontend.pdf",
  );

  await page.goto("/work/money-track");
  await expect(headerCv).toHaveAttribute("href", "/cv/Vitaliy_Hrytsenko_Frontend.pdf");

  await page.goto("/fullstack");
  await expect(headerCv).toHaveAttribute("href", "/cv/Vitaliy_Hrytsenko_Fullstack.pdf");
  const pdf = await page.request.get("/cv/Vitaliy_Hrytsenko_Fullstack.pdf");
  expect(pdf.headers()["content-type"]).toContain("pdf");
});

test("client pages and cases reached from them show no CV", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  const cvLinks = page.getByRole("link", { name: "CV" });

  // a direct visit to a case counts as the client home
  await page.goto("/work/money-track");
  await expect(cvLinks).toHaveCount(0);

  await page.goto("/");
  await expect(page.locator("#main")).toBeVisible();
  await expect(cvLinks).toHaveCount(0);

  await page.goto("/work/money-track");
  await expect(cvLinks).toHaveCount(0);

  // a visitor who saw /ai still gets no CV on the client pages
  await page.goto("/ai");
  await page.goto("/services");
  await expect(cvLinks).toHaveCount(0);
});
