import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Umami through this domain: ad blockers drop third-party trackers, not first-party paths
  async rewrites() {
    return [
      { source: "/stats/script.js", destination: "https://cloud.umami.is/script.js" },
      { source: "/stats/api/send", destination: "https://cloud.umami.is/api/send" },
    ];
  },
};

export default nextConfig;
