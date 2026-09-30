import type { Metadata } from "next";
import { HomePage } from "@/components/home/HomePage";
import { PROFILES } from "@/lib/profiles";

// the home page with the cursor-trail hero, kept to show the design; not a page of its own for search
export const metadata: Metadata = {
  alternates: { canonical: "/" },
  robots: { index: false, follow: true },
};

export default function TrailHome() {
  return <HomePage profile={PROFILES.ai} heroVariant="trail" />;
}
