import { OG_SIZE } from "@/components/og/OgCard";
import { renderHomeOg } from "@/components/og/OgHomeCard";
import { PROFILES } from "@/lib/profiles";
import { SITE } from "@/lib/site";

export const alt = `${SITE.name}: ${PROFILES.ai.hero.title}`;
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return renderHomeOg(PROFILES.ai);
}
