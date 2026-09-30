import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import { SITE } from "@/lib/site";

const font = readFile(path.join(process.cwd(), "assets/fonts/GeneralSans-Semibold.otf"));

// the header monogram as an icon; a frame is only drawn where the icon is big enough to carry it
export async function renderMonogramIcon(size: number, inset: number, frame = true) {
  const stroke = Math.max(2, Math.round(size / 24));
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        padding: inset,
        background: "#000000",
      }}
    >
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: frame ? `${stroke}px solid #ffffff` : "none",
          color: "#ffffff",
          fontFamily: "Sans",
          fontSize: size * (frame ? 0.42 : 0.5),
          letterSpacing: "-0.02em",
        }}
      >
        {SITE.monogram}
      </div>
    </div>,
    {
      width: size,
      height: size,
      fonts: [{ name: "Sans", data: await font, weight: 700, style: "normal" }],
    },
  );
}
