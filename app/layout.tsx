import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Archivo, JetBrains_Mono } from "next/font/google";
import { Analytics } from "@/components/analytics/Analytics";
import { ChatDrawer } from "@/components/chat/ChatDrawer";
import { AskFab } from "@/components/layout/AskFab";
import { CursorLabel } from "@/components/motion/CursorLabel";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { siteUrl } from "@/lib/seo";
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
  metadataBase: new URL(siteUrl),
  title: SITE.meta.title,
  description: SITE.meta.description,
  authors: [{ name: SITE.name, url: siteUrl }],
  creator: SITE.name,
  alternates: { canonical: "/" },
  openGraph: {
    url: "/",
    siteName: "italik.dev",
    type: "website",
    locale: "en_US",
    title: SITE.meta.title,
    description: SITE.meta.description,
  },
  twitter: {
    card: "summary_large_image",
    title: SITE.meta.title,
    description: SITE.meta.description,
  },
};

type Props = { children: ReactNode };

export default function RootLayout({ children }: Props) {
  // the inline script marks that scripts run, so Reveal blocks can start hidden without a flash
  return (
    // browser extensions add attributes to <html> before React hydrates; this only silences that tag
    <html
      lang="en"
      className={`${archivo.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }}
        />
      </head>
      <body className="min-h-dvh bg-bg text-text">
        <SmoothScroll />
        {children}
        <AskFab />
        <ChatDrawer />
        <CursorLabel />
        <Analytics />
      </body>
    </html>
  );
}
