import { expect, test } from "@playwright/test";

// "Case study" must always open a case page and "Live" the running product, never the other way round
for (const path of ["/", "/work/money-track", "/work/ppc-io"]) {
  test(`project links on ${path} lead where their labels say`, async ({ page, request }) => {
    await page.goto(path);
    const links = await page
      .locator("a[href]")
      .evaluateAll((anchors) =>
        anchors.map((a) => ({ text: (a.textContent ?? "").trim(), href: a.getAttribute("href")! })),
      );

    for (const { text, href } of links) {
      if (/case study/i.test(text)) expect(href, text).toMatch(/^\/work\/[a-z0-9-]+$/);
      if (/^live( demo)?\s*↗?$/i.test(text)) expect(href, text).toMatch(/^https?:\/\//);
    }

    const casePages = [
      ...new Set(links.map((l) => l.href).filter((h) => /^\/work\/[a-z0-9-]+$/.test(h))),
    ];
    if (path === "/") expect(casePages.length).toBeGreaterThan(0);
    for (const href of casePages) expect((await request.get(href)).status(), href).toBe(200);
  });
}
