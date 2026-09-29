"use client";

import Script from "next/script";
import { useEffect } from "react";
import { UMAMI_DOMAINS, UMAMI_WEBSITE_ID, flushAnalytics, track } from "@/lib/analytics";

// Umami (~2 KB) loads when the browser is idle and counts page views itself, client navigation included;
// the click listener below turns the links that matter into named events
export function Analytics() {
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const link = (event.target as Element | null)?.closest?.("a[href]");
      if (!(link instanceof HTMLAnchorElement)) return;
      const named = classify(new URL(link.href, window.location.href));
      if (named) track(named.event, { ...named.data, from: window.location.pathname });
    };
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);

  return (
    <Script
      // loaded straight from Umami: proxied through this domain, every visit showed the Vercel edge's country
      src="https://cloud.umami.is/script.js"
      strategy="lazyOnload"
      data-website-id={UMAMI_WEBSITE_ID}
      data-domains={UMAMI_DOMAINS}
      onLoad={flushAnalytics}
    />
  );
}

const CONTACT_HOSTS: Record<string, string> = {
  "t.me": "telegram",
  "x.com": "x",
  "twitter.com": "x",
  "linkedin.com": "linkedin",
  "www.linkedin.com": "linkedin",
};

function classify(url: URL): { event: string; data: Record<string, string> } | null {
  const here = window.location.origin;
  if (url.pathname.endsWith(".pdf")) return { event: "cv_download", data: {} };
  if (url.protocol === "mailto:") return { event: "contact_click", data: { channel: "email" } };
  if (CONTACT_HOSTS[url.host]) {
    return { event: "contact_click", data: { channel: CONTACT_HOSTS[url.host] } };
  }

  if (url.host === "github.com") {
    const [owner, repo] = url.pathname.split("/").filter(Boolean);
    // the bare profile is a way to reach me; a repo link is a project's code
    return repo
      ? { event: "project_code", data: { repo: `${owner}/${repo}` } }
      : { event: "contact_click", data: { channel: "github" } };
  }

  if (url.origin === here) {
    const slug = url.pathname.match(/^\/work\/([\w-]+)/)?.[1];
    return slug ? { event: "project_open", data: { project: slug } } : null;
  }

  if (url.protocol.startsWith("http")) {
    return { event: "project_live", data: { host: url.host } };
  }
  return null;
}
