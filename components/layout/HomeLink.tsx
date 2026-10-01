"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useSyncExternalStore, type ComponentProps } from "react";
import { HOME_KEY, HOMES, isClientPage } from "@/lib/site";

// the home page a visitor last saw ("/", "/ai", "/frontend", "/fullstack"), so links back from a case return to it.
// localStorage, so a case opened in a new tab still knows it; sessionStorage would start empty there
const KEY = HOME_KEY;
// the home section a case was opened from ("work", "lab", "clients", "now"), so "All work" lands back there
const SECTION_KEY = "italik:from-section";
const listeners = new Set<() => void>();

function read(storage: () => Storage, key: string, fallback: string) {
  try {
    return storage().getItem(key) ?? fallback;
  } catch {
    return fallback;
  }
}
const readHome = () => read(() => localStorage, KEY, "/");
const readSection = () => read(() => sessionStorage, SECTION_KEY, "");

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

// rendered by each home page
export function RememberHome({ path }: { path: string }) {
  useEffect(() => {
    try {
      localStorage.setItem(KEY, path);
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

// home pages have the sections an anchor points at; client pages send it to "/", case pages to the last home seen
export function useNavHref(href: string, samePage = false) {
  const pathname = usePathname();
  const home = useSyncExternalStore(subscribe, readHome, () => "/");
  if (!href.startsWith("#") || samePage || pathname in HOMES) return href;
  return `${isClientPage(pathname) ? "/" : home}${href}`;
}

type NavLinkProps = ComponentProps<typeof Link> & { href: string; samePage?: boolean };

export function NavLink({ href, samePage, ...props }: NavLinkProps) {
  return <Link href={useNavHref(href, samePage)} {...props} />;
}

// the home page this page belongs to: itself on a home page, "/" on client pages,
// the last home seen anywhere else (case pages)
export function useHomePath() {
  const pathname = usePathname();
  const home = useSyncExternalStore(subscribe, readHome, () => "/");
  if (pathname in HOMES) return pathname;
  if (isClientPage(pathname)) return "/";
  return home in HOMES ? home : "/";
}

export function useHome() {
  return HOMES[useHomePath()];
}

// the CV of the role the visitor is looking at; none for clients
export function useCv() {
  return useHome().cv;
}
