"use client";

import { useState } from "react";
import type { ProjectStatus } from "@/lib/schemas";
import { LabPreview } from "./LabPreview";
import { LabRow } from "./LabRow";

export type LabItem = {
  slug: string;
  title: string;
  status: ProjectStatus;
  tags: string[];
  summary: string;
  description: string;
  stack: string[];
  frameUrl?: string;
  cover?: string;
  href?: string;
  // false when the same project is already named in Featured
  shareTitle: boolean;
};

// the last hovered or focused row stays active until the pointer leaves the whole block
export function LabList({ items }: { items: LabItem[] }) {
  const [active, setActive] = useState<string | null>(null);

  return (
    <div
      className="mt-fl-16/40 grid | lg:grid-cols-[55fr_45fr] lg:gap-[40px]"
      onMouseLeave={() => setActive(null)}
    >
      <ol>
        {items.map((item) => (
          <LabRow
            key={item.slug}
            item={item}
            dimmed={active !== null && active !== item.slug}
            onActivate={() => setActive(item.slug)}
          />
        ))}
      </ol>
      <LabPreview items={items} active={active} />
    </div>
  );
}
