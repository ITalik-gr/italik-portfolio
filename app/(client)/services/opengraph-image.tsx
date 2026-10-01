import { OG_ACCENT, OG_SIZE, renderOgCard } from "@/components/og/OgCard";
import { SERVICES_PAGE } from "@/lib/services";
import { SITE } from "@/lib/site";

export const alt = `${SITE.name}: ${SERVICES_PAGE.title}`;
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return renderOgCard({
    kicker: <div style={{ display: "flex", color: OG_ACCENT }}>Services</div>,
    lines: [...SERVICES_PAGE.og.lines],
    titleSize: 120,
    lead: SERVICES_PAGE.og.lead,
    leadAccent: true,
    path: "/services",
  });
}
