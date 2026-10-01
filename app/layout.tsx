import type { Metadata } from "next";
import type { ReactNode } from "react";
import { DM_Mono } from "next/font/google";
import localFont from "next/font/local";
import { Analytics } from "@/components/analytics/Analytics";
import { ChatDrawer } from "@/components/chat/ChatDrawer";
import { AskFab } from "@/components/layout/AskFab";
import { CursorLabel } from "@/components/motion/CursorLabel";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { PROFILES } from "@/lib/profiles";
import { siteUrl } from "@/lib/seo";
import { SITE } from "@/lib/site";
import "./globals.css";

// General Sans stands in for Aeonik until the licensed files land in public/fonts/aeonik/; swap the src only
const sans = localFont({
  variable: "--font-aeonik",
  src: "../public/fonts/general-sans/GeneralSans-Variable.woff2",
  weight: "200 700",
  display: "swap",
});

// arrows and other glyphs the cut lacks must fall back to a monospace font, not Arial
const dmMono = DM_Mono({
  variable: "--font-dm-mono",
  weight: ["400", "500"],
  subsets: ["latin"],
  fallback: ["ui-monospace", "Menlo", "monospace"],
  adjustFontFallback: false,
});

// the defaults are the client home's; every other page sets its own
const { title, description } = PROFILES.client.meta;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  authors: [{ name: SITE.name, url: siteUrl }],
  creator: SITE.name,
  alternates: { canonical: "/" },
  openGraph: {
    url: "/",
    siteName: "italik.dev",
    type: "website",
    locale: "en_US",
    title,
    description,
  },
  twitter: { card: "summary_large_image", title, description },
};

type Props = { children: ReactNode };

export default function RootLayout({ children }: Props) {
  // the inline script marks that scripts run, so Reveal blocks can start hidden without a flash
  return (
    // browser extensions add attributes to <html> before React hydrates; this only silences that tag
    <html
      lang="en"
      className={`${sans.variable} ${dmMono.variable}`}
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
