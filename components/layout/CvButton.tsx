"use client";

import type { ComponentProps } from "react";
import { Button } from "@/components/ui/Button";
import { useCv } from "./HomeLink";

// the CV of the role the visitor is looking at; client pages have none
export function CvButton(props: Omit<ComponentProps<typeof Button>, "href">) {
  const cv = useCv();
  return cv ? <Button href={cv} {...props} /> : null;
}
