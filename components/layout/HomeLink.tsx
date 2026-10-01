"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useSyncExternalStore, type ComponentProps } from "react";
import { CLIENT_PAGES, HOMES } from "@/lib/site";

// the home page a visitor last saw ("/", "/ai", "/frontend", "/fullstack"), so links back from a case return to it
const KEY = "italik:home";
// the home section a case was opened from ("work", "lab", "clients", "now"), so "All work" lands back there
const SECTION_KEY = "italik:from-section";
const listeners = new Set<() => void>();

function read(key: string, fallback: string) {
  try {
    return sessionStorage.getItem(key) ?? fallback;
  } catch {
    return fallback;
  }
}
const readHome = () => read(KEY, "/");
const readSection = () => read(SECTION_KEY, "");

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

// rendered by each home page
export function RememberHome({ path }: { path: string }) {
  useEffect(() => {
    try {
      sessionStorage.setItem(KEY, path);
    } catch {
      // private mode: links just fall back to "/"
    }
    listeners.forEach((listener) => listener());

    // capture: the click is recorded before the page navigates away
    const onClick = (event: MouseEvent) => {
      const link = (event.target as Element | null)?.closest?.('a[href^="/work/"]');
      const section = link?.closest("main section[id]")?.id;
      if (!section) return;
      try {
        sessionStorage.setItem(SECTION_KEY, section);
      } catch {
        // private mode: "All work" falls back to its default section
      }
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [path]);
  return null;
}

// backToSection: prefer the section the case was opened from over the given hash
type Props = Omit<ComponentProps<typeof Link>, "href"> & { hash?: string; backToSection?: boolean };

export function HomeLink({ hash = "", backToSection, ...props }: Props) {
  const home = useSyncExternalStore(subscribe, readHome, () => "/");
  const section = useSyncExternalStore(subscribe, readSection, () => "");
  const target = backToSection && section ? `#${section}` : hash;
  return <Link href={`${home}${target}`} {...props} />;
}

// home pages have the sections a same-page anchor points at; any other page sends it to the last home seen
export function useNavHref(href: string) {
  const pathname = usePathname();
  const home = useSyncExternalStore(subscribe, readHome, () => "/");
  const onHome = pathname in HOMES;
  return href.startsWith("#") && !onHome ? `${home}${href}` : href;
}

export function NavLink({ href, ...props }: ComponentProps<typeof Link> & { href: string }) {
  return <Link href={useNavHref(href)} {...props} />;
}

// a home page knows its audience from the URL (already on the server); client pages are always client;
// anywhere else (case pages), the last home seen decides
export function useHome() {
  const pathname = usePathname();
  const home = useSyncExternalStore(subscribe, readHome, () => "/");
  if (CLIENT_PAGES.some((page) => pathname === page || pathname.startsWith(`${page}/`))) {
    return HOMES["/"];
  }
  return HOMES[pathname] ?? HOMES[home] ?? HOMES["/"];
}

// the CV of the role the visitor is looking at; none for clients
export function useCv() {
  return useHome().cv;
}
