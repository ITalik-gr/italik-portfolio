"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useSyncExternalStore, type ComponentProps } from "react";
import { CV_BY_HOME, SITE } from "@/lib/site";

// the home page a visitor last saw ("/", "/frontend", "/fullstack"), so links back from a case return to it
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

// a home page knows its role from the URL (already on the server); anywhere else, the last home seen decides
export function useCv() {
  const pathname = usePathname();
  const home = useSyncExternalStore(subscribe, readHome, () => "/");
  return CV_BY_HOME[pathname] ?? CV_BY_HOME[home] ?? SITE.cv;
}
