"use client";

import type { ComponentProps } from "react";
import { Button } from "@/components/ui/Button";
import { useCv } from "./HomeLink";

// the CV of the role the visitor is looking at
export function CvButton(props: Omit<ComponentProps<typeof Button>, "href">) {
  return <Button href={useCv()} {...props} />;
}
