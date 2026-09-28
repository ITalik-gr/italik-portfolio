import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import type { ReactNode } from "react";
import { SITE } from "@/lib/site";

export const OG_SIZE = { width: 1200, height: 630 };

// satori can't read the @theme variables, so these mirror app/globals.css
const COLORS = {
  bg: "#000000",
  text: "#ffffff",
  text3: "#a8a8a8",
  muted: "#7c7c7c",
  line: "#262626",
  accent: "#7fee64",
};

const FONTS_DIR = path.join(process.cwd(), "assets/fonts");
const fonts = Promise.all([
  readFile(path.join(FONTS_DIR, "Archivo-SemiCondensed-Bold.ttf")),
  readFile(path.join(FONTS_DIR, "Archivo-Regular.ttf")),
  readFile(path.join(FONTS_DIR, "JetBrainsMono-Regular.ttf")),
]);

type Props = {
  kicker: ReactNode;
  // one entry per line of the big title
  lines: string[];
  titleSize: number;
  lead?: string;
  leadAccent?: boolean;
  path: string;
};

// og images take inline styles only (satori), so Tailwind classes can't be used here
export async function renderOgCard({
  kicker,
  lines,
  titleSize,
  lead,
  leadAccent,
  path: url,
}: Props) {
  const [display, body, mono] = await fonts;

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 64,
        background: COLORS.bg,
        color: COLORS.text,
        fontFamily: "Archivo",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 56,
              height: 56,
              border: `2px solid ${COLORS.text}`,
              fontFamily: "Archivo Display",
              fontSize: 24,
              letterSpacing: "-0.02em",
            }}
          >
            {SITE.monogram}
          </div>
          <div style={{ fontFamily: "JetBrains Mono", fontSize: 20, color: COLORS.muted }}>
            italik.dev
          </div>
        </div>
        <div
          style={{
            display: "flex",
            gap: 16,
            fontFamily: "JetBrains Mono",
            fontSize: 20,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          {kicker}
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column" }}>
        {lines.map((line) => (
          <div
            key={line}
            style={{
              fontFamily: "Archivo Display",
              fontSize: titleSize,
              lineHeight: 0.85,
              letterSpacing: "-0.06em",
            }}
          >
            {line}
          </div>
        ))}
        {lead && (
          <div
            style={{
              marginTop: 32,
              maxWidth: 1040,
              fontSize: 32,
              lineHeight: 1.25,
              letterSpacing: "-0.015em",
              color: leadAccent ? COLORS.accent : COLORS.text3,
            }}
          >
            {lead}
          </div>
        )}
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          paddingTop: 24,
          borderTop: `1px solid ${COLORS.line}`,
          fontFamily: "JetBrains Mono",
          fontSize: 20,
          color: COLORS.muted,
        }}
      >
        <div>{`${SITE.name} · Full-stack developer`}</div>
        <div>{`italik.dev${url}`}</div>
      </div>
    </div>,
    {
      ...OG_SIZE,
      fonts: [
        { name: "Archivo Display", data: display, weight: 700, style: "normal" },
        { name: "Archivo", data: body, weight: 400, style: "normal" },
        { name: "JetBrains Mono", data: mono, weight: 400, style: "normal" },
      ],
    },
  );
}

export const OG_ACCENT = COLORS.accent;
export const OG_TEXT = COLORS.text;
