"use client";

import Link from "next/link";
import { useEffect, useSyncExternalStore, type ComponentProps } from "react";

// the home page a visitor last saw ("/", "/frontend", "/fullstack"), so links back from a case return to it
const KEY = "italik:home";
const listeners = new Set<() => void>();

function readHome() {
  try {
    return sessionStorage.getItem(KEY) ?? "/";
  } catch {
    return "/";
  }
}

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
  }, [path]);
  return null;
}

type Props = Omit<ComponentProps<typeof Link>, "href"> & { hash?: string };

export function HomeLink({ hash = "", ...props }: Props) {
  const home = useSyncExternalStore(subscribe, readHome, () => "/");
  return <Link href={`${home}${hash}`} {...props} />;
}
