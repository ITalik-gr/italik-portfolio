import { expect, test } from "@playwright/test";

// every image named in JSON-LD must really load; og images in route groups sit at hashed paths
for (const path of ["/services", "/blog/the-model-never-computes-a-number"]) {
  test(`JSON-LD images on ${path} load`, async ({ page, request }) => {
    await page.goto(path);
    const blocks = await page.locator('script[type="application/ld+json"]').allTextContents();
    const images = blocks.flatMap((block) =>
      [...block.matchAll(/"image":"([^"]+)"/g)].map((match) => match[1]),
    );
    expect(images.length).toBeGreaterThan(0);
    for (const image of images) {
      const response = await request.get(new URL(image).pathname);
      expect(response.status(), image).toBe(200);
    }
  });
}

test("a post's publish date carries a time zone", async ({ page }) => {
  await page.goto("/blog/the-model-never-computes-a-number");
  const jsonLd = (await page.locator('script[type="application/ld+json"]').allTextContents()).join();
  expect(jsonLd).toMatch(/"datePublished":"\d{4}-\d{2}-\d{2}T00:00:00[+-]\d{2}:\d{2}"/);
});
