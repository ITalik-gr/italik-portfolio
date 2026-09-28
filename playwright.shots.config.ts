import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "tests/shots",
  outputDir: "test-results/shots",
  timeout: 120_000,
  use: { baseURL: "http://localhost:3000", browserName: "chromium" },
  projects: [
    { name: "site", testMatch: "site.spec.ts" },
    { name: "reference", testMatch: "reference.spec.ts" },
  ],
  webServer: {
    command: "pnpm dev",
    url: "http://localhost:3000",
    reuseExistingServer: true,
  },
});
