"use client";

import { ViewTransition, useSyncExternalStore, type ReactNode } from "react";

type Props = {
  slug: string;
  part: "title" | "cover";
  // where this copy lives; a project shown in two blocks on one page has two sources
  source?: string;
  // the copy that morphs until the visitor clicks another one
  primary?: boolean;
  children: ReactNode;
};

// view-transition names must be unique on a page, so a project shown twice (Featured and Lab)
// hands its name to whichever copy was clicked last
const owners = new Map<string, string>();
const listeners = new Set<() => void>();

// title and cover are claimed separately: in Lab the cover lives in the side preview on desktop
// and in the row itself on mobile, and only the visible one may carry the name
export function claimMorph(slug: string, source: string, coverSource = source) {
  owners.set(`title:${slug}`, source);
  owners.set(`cover:${slug}`, coverSource);
  listeners.forEach((listener) => listener());
}

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

// wraps a block whose links should make it the morph source; display: contents keeps the layout
export function MorphSource({
  slug,
  source,
  children,
}: {
  slug: string;
  source: string;
  children: ReactNode;
}) {
  return (
    <div className="contents" onClickCapture={() => claimMorph(slug, source)}>
      {children}
    </div>
  );
}

// a project's title and cover carry the same names on the home page and its case page, so navigation morphs one into the other
export function ProjectMorph({ slug, part, source = "main", primary = true, children }: Props) {
  const owner = useSyncExternalStore(
    subscribe,
    () => owners.get(`${part}:${slug}`),
    () => undefined,
  );
  // a copy with no rival on its page ("main", e.g. the case hero) always carries the name
  const active = source === "main" || (owner ? owner === source : primary);
  if (!active) return children;

  return (
    <ViewTransition name={`project-${part}-${slug}`} share="morph" default="none">
      {children}
    </ViewTransition>
  );
}
