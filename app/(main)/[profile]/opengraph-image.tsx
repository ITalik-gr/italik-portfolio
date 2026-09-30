import { notFound } from "next/navigation";
import { OG_SIZE } from "@/components/og/OgCard";
import { renderHomeOg } from "@/components/og/OgHomeCard";
import { ROLE_PROFILES, getRoleProfile } from "@/lib/profiles";
import { SITE } from "@/lib/site";

export const alt = `${SITE.name}, portfolio`;
export const size = OG_SIZE;
export const contentType = "image/png";

export function generateStaticParams() {
  return ROLE_PROFILES.map((profile) => ({ profile: profile.slug }));
}

export default async function Image({ params }: { params: Promise<{ profile: string }> }) {
  const profile = getRoleProfile((await params).profile);
  if (!profile) notFound();
  return renderHomeOg(profile);
}
