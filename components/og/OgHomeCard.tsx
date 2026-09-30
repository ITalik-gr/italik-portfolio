import { ImageResponse } from "next/og";
import type { Profile } from "@/lib/profiles";
import { SITE } from "@/lib/site";
import { OG_COLORS, OG_SIZE, ogFonts } from "./OgCard";

// home and role pages: the monogram and the profile's title, nothing else
export async function renderHomeOg(profile: Profile) {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "64px 72px 72px",
        background: OG_COLORS.bg,
        color: OG_COLORS.text,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 64,
          height: 64,
          border: `2px solid ${OG_COLORS.text}`,
          fontFamily: "Sans Display",
          fontSize: 27,
        }}
      >
        {SITE.monogram}
      </div>

      <div style={{ display: "flex", flexDirection: "column" }}>
        {profile.hero.lines.map((line) => (
          <div
            key={line}
            style={{
              fontFamily: "Sans Display",
              fontSize: 144,
              lineHeight: 0.86,
              letterSpacing: "-0.06em",
            }}
          >
            {line}
          </div>
        ))}
      </div>
    </div>,
    { ...OG_SIZE, fonts: await ogFonts() },
  );
}
