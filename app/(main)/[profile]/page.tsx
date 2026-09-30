import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HomePage } from "@/components/home/HomePage";
import { ROLE_PROFILES, getRoleProfile } from "@/lib/profiles";

export const dynamicParams = false;

export function generateStaticParams() {
  return ROLE_PROFILES.map((profile) => ({ profile: profile.slug }));
}

// each role page is its own search result, with its own title, description and og image
export async function generateMetadata({ params }: PageProps<"/[profile]">): Promise<Metadata> {
  const profile = getRoleProfile((await params).profile);
  if (!profile) return {};

  const { title, description } = profile.meta;
  return {
    title,
    description,
    alternates: { canonical: profile.path },
    openGraph: {
      url: profile.path,
      siteName: "italik.dev",
      type: "website",
      locale: "en_US",
      title,
      description,
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function RolePage({ params }: PageProps<"/[profile]">) {
  const profile = getRoleProfile((await params).profile);
  if (!profile) notFound();
  return <HomePage profile={profile} />;
}
