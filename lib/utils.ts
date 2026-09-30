import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

const isFluid = (value: string) => value.startsWith("fl-");
const FLUID_GROUPS = [
  "mt",
  "mb",
  "pt",
  "pb",
  "px",
  "py",
  "gap",
  "gap-x",
  "gap-y",
  "size",
  "w",
  "h",
];
const FLUID_INSET = ["top", "right", "bottom", "left"];

// teach twMerge about our *-fl-<mobile>/<desktop> utilities (see globals.css)
// in Tailwind 4 leading-* wins over any text size, so a later font size must not drop it
// (and the "/<desktop>" in text-fl-* is not a line height)
const twMerge = extendTailwindMerge({
  override: {
    conflictingClassGroups: { "font-size": [] },
    conflictingClassGroupModifiers: { "font-size": [] },
  },
  extend: {
    classGroups: {
      "font-size": [{ text: [isFluid] }],
      ...Object.fromEntries(FLUID_GROUPS.map((group) => [group, [{ [group]: [isFluid] }]])),
      ...Object.fromEntries(FLUID_INSET.map((group) => [group, [{ [group]: [isFluid] }]])),
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
