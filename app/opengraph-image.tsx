import { OgBrain } from "@/components/og/OgBrain";
import { OG_ACCENT, OG_NODE, OG_SIZE, renderOgCard } from "@/components/og/OgCard";
import { HERO, SITE } from "@/lib/site";

export const alt = `${SITE.name}: ${HERO.title}`;
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return renderOgCard({
    kicker: (
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{ width: 12, height: 12, borderRadius: 6, background: OG_ACCENT }} />
        Open to work
      </div>
    ),
    lines: [...HERO.lines],
    titleSize: 108,
    lead: HERO.sub,
    path: "",
    art: <OgBrain width={600} height={470} accent={OG_ACCENT} node={OG_NODE} />,
  });
}
