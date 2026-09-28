import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Archivo, JetBrains_Mono } from "next/font/google";
import { AskFab } from "@/components/layout/AskFab";
import { Header } from "@/components/layout/Header";
import { SITE } from "@/lib/site";
import "./globals.css";

// wdth axis is needed: display type in the design is set at font-stretch 88%
const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  axes: ["wdth"],
});

// Google's cut has no "→", so glyphs it lacks must fall back to a monospace font, not Arial
const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  fallback: ["ui-monospace", "Menlo", "monospace"],
  adjustFontFallback: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? SITE.url),
  title: SITE.meta.title,
  description: SITE.meta.description,
  openGraph: { url: "/" },
};

type Props = { children: ReactNode };

export default function RootLayout({ children }: Props) {
  return (
    // browser extensions add attributes to <html> before React hydrates; this only silences that tag
    <html
      lang="en"
      className={`${archivo.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-dvh bg-bg text-text">
        <Header />
        {children}
        <AskFab />
      </body>
    </html>
  );
}
