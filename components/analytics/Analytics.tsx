"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { UMAMI_DOMAINS, UMAMI_WEBSITE_ID, flushAnalytics, track } from "@/lib/analytics";
import { HOMES } from "@/lib/site";

type Data = Record<string, string | number | boolean>;

// Umami (~2 KB) loads when the browser is idle and counts page views itself, client navigation included.
// On top of that: every link and every [data-track] button becomes a named event, plus how far each page
// is read, which sections were seen and how long the visit lasted. Every event also carries the page context
// (see track in lib/analytics.ts). Chat questions are never sent, only their length.
export function Analytics() {
  const pathname = usePathname();

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const target = event.target as Element | null;
      // a button or link that names its own event wins over the link rules below
      const marked = target?.closest?.<HTMLElement>("[data-track]");
      if (marked) {
        track(marked.dataset.track!, { ...trackData(marked), place: place(marked) });
        return;
      }
      const link = target?.closest?.("a[href]");
      if (!(link instanceof HTMLAnchorElement)) return;
      const named = classify(new URL(link.href, window.location.href));
      // extra data-track-* on a link (a card's position) rides along with its usual event
      if (named) track(named.event, { ...named.data, ...trackData(link), label: label(link), place: place(link) });
    };
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);

  // per page: scroll depth milestones, sections seen, time and depth on leaving
  useEffect(() => {
    const started = Date.now();
    const sent = new Set<number>();
    let maxDepth = 0;
    let frame = 0;

    const measure = () => {
      frame = 0;
      const { scrollHeight, clientHeight } = document.documentElement;
      const depth = scrollHeight > clientHeight ? (window.scrollY + clientHeight) / scrollHeight : 1;
      maxDepth = Math.max(maxDepth, depth);
      for (const milestone of [25, 50, 75, 100]) {
        if (depth * 100 >= milestone - 2 && !sent.has(milestone)) {
          sent.add(milestone);
          track("scroll_depth", { depth: milestone, seconds: Math.round((Date.now() - started) / 1000) });
        }
      }
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };
    // the first measure waits a moment, so a short page doesn't report 100% before anyone read it
    const firstMeasure = window.setTimeout(measure, 3000);
    window.addEventListener("scroll", onScroll, { passive: true });

    const seen = new Set<string>();
    const sections = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          const id = entry.target.id;
          if (!entry.isIntersecting || seen.has(id)) return;
          seen.add(id);
          track("section_view", { section: id, order: seen.size });
        }),
      { threshold: 0.35 },
    );
    document.querySelectorAll("main section[id], main aside[id], footer[id]").forEach((el) => sections.observe(el));

    let left = false;
    const leave = () => {
      if (left) return;
      left = true;
      track("page_leave", {
        seconds: Math.round((Date.now() - started) / 1000),
        depth: Math.round(maxDepth * 100),
        sections: seen.size,
      });
    };
    const onHide = () => document.visibilityState === "hidden" && leave();
    document.addEventListener("visibilitychange", onHide);
    window.addEventListener("pagehide", leave);

    return () => {
      // client navigation to another page counts as leaving this one
      leave();
      cancelAnimationFrame(frame);
      window.clearTimeout(firstMeasure);
      window.removeEventListener("scroll", onScroll);
      sections.disconnect();
      document.removeEventListener("visibilitychange", onHide);
      window.removeEventListener("pagehide", leave);
    };
  }, [pathname]);

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

// data-track-post="x" data-track-file="y" → { post: "x", file: "y" }
function trackData(el: HTMLElement): Data {
  const data: Data = {};
  for (const [key, value] of Object.entries(el.dataset)) {
    if (key === "track" || !key.startsWith("track") || value === undefined) continue;
    data[key[5].toLowerCase() + key.slice(6)] = value;
  }
  return data;
}

// the block the element sits in: start = the CTA, contact = the footer, case-cta = the case bridge, hero, nav…
function place(el: Element) {
  const holder = el.closest("[data-place], nav[aria-label], section[id], aside[id], footer[id], header");
  if (!holder) return "page";
  if (holder instanceof HTMLElement && holder.dataset.place) return holder.dataset.place;
  if (holder.tagName === "NAV") return `nav-${holder.getAttribute("aria-label")?.toLowerCase()}`;
  return holder.id || holder.tagName.toLowerCase();
}

// what the visitor saw on the link, trimmed; enough to tell "Telegram" in the CTA from the footer one
function label(link: HTMLAnchorElement) {
  const text = (link.getAttribute("aria-label") ?? link.textContent ?? "").replace(/\s+/g, " ").trim();
  return text.slice(0, 80);
}

const CONTACT_HOSTS: Record<string, string> = {
  "t.me": "telegram",
  "x.com": "x",
  "twitter.com": "x",
  "linkedin.com": "linkedin",
  "www.linkedin.com": "linkedin",
};

function classify(url: URL): { event: string; data: Data } | null {
  const here = window.location.origin;
  if (url.pathname.endsWith(".pdf")) {
    return { event: "cv_download", data: { cv: url.pathname.split("/").pop() ?? "" } };
  }
  if (url.protocol === "mailto:") {
    return { event: "contact_click", data: { channel: "email", subject: url.searchParams.get("subject") ?? "" } };
  }
  // a share link is not a way to reach me
  if ((url.host === "x.com" || url.host === "twitter.com") && url.pathname.startsWith("/intent")) {
    return { event: "share", data: { method: "x" } };
  }
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
    const path = url.pathname;
    if (path === window.location.pathname && url.hash) {
      return { event: "anchor_click", data: { target: url.hash.slice(1) } };
    }
    const work = path.match(/^\/work\/([\w-]+)/)?.[1];
    if (work) return { event: "project_open", data: { project: work } };
    const post = path.match(/^\/blog\/([\w-]+)$/)?.[1];
    if (post && post !== "rss") return { event: "post_open", data: { to: post } };
    if (path === "/blog/rss.xml") return { event: "rss_open", data: {} };
    if (path === "/blog") {
      const tag = url.searchParams.get("tag");
      const page = url.searchParams.get("page");
      return tag || page
        ? { event: "blog_filter", data: { tag: tag ?? "", pageNumber: Number(page ?? 1) } }
        : { event: "blog_open", data: {} };
    }
    if (path === "/services") return { event: "services_open", data: { target: url.hash.slice(1) } };
    if (HOMES[path]) return { event: "home_open", data: { to: path, target: url.hash.slice(1) } };
    return { event: "internal_link", data: { to: path } };
  }

  if (url.protocol.startsWith("http")) {
    return { event: "project_live", data: { host: url.host, url: url.href.slice(0, 120) } };
  }
  return null;
}
