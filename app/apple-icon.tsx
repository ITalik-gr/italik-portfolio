import { renderMonogramIcon } from "@/components/og/MonogramIcon";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

// iOS rounds the corners itself, so the frame sits inset to survive the mask
export default function AppleIcon() {
  return renderMonogramIcon(180, 28);
}
