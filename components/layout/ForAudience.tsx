"use client";

import type { ReactNode } from "react";
import type { Audience } from "@/lib/site";
import { useHome } from "./HomeLink";

// for parts that follow the visitor's home page on pages outside both groups (cases, 404)
export function ForAudience({ audience, children }: { audience: Audience; children: ReactNode }) {
  return useHome().audience === audience ? children : null;
}
