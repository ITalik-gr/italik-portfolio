import { renderMonogramIcon } from "@/components/og/MonogramIcon";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

// at tab size a white frame reads as a stray border, so the favicon is just the letters on black
export default function Icon() {
  return renderMonogramIcon(64, 0, false);
}
