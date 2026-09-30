import { Fragment, type ReactNode } from "react";
import { Marquee } from "@/components/motion/Marquee";
import { About } from "@/components/sections/About";
import { AskAI } from "@/components/sections/AskAI";
import { ClientWork } from "@/components/sections/ClientWork";
import { Contact } from "@/components/sections/Contact";
import { Experience } from "@/components/sections/Experience";
import { Featured } from "@/components/sections/Featured";
import { RememberHome } from "@/components/layout/HomeLink";
import { Hero } from "@/components/sections/Hero";
import { Lab } from "@/components/sections/Lab";
import { NowBuilding } from "@/components/sections/NowBuilding";
import { Skills } from "@/components/sections/Skills";
import { JsonLd } from "@/components/seo/JsonLd";
import { getFeaturedProjects, getNowBuilding, getProject } from "@/lib/content";
import type { HomeSectionKey, Profile } from "@/lib/profiles";
import type { Project } from "@/lib/schemas";
import { homeJsonLd } from "@/lib/seo";
import type { HeroVariant } from "@/lib/site";

type Props = { profile: Profile; heroVariant?: HeroVariant };

export function HomePage({ profile, heroVariant }: Props) {
  const featured = getFeatured(profile);
  // a project featured on this page lets its other copies step aside in page transitions
  const featuredSlugs = new Set(featured.map((project) => project.slug));
  // sections with nothing to show drop out
  const shown = profile.sections.filter((key) => {
    if (key === "featured") return featured.length > 0;
    if (key === "nowBuilding") return getNowBuilding().length > 0;
    return true;
  });
  
  const render: Record<HomeSectionKey, () => ReactNode> = {
    featured: () => <Featured projects={featured} />,
    lab: () => <Lab featured={featuredSlugs} />,
    nowBuilding: () => <NowBuilding />,
    clientWork: () => <ClientWork featured={featuredSlugs} />,
    experience: () => <Experience />,
    about: () => <About paragraphs={profile.about} />,
    ask: () => <AskAI chips={profile.askChips} />,
    skills: () => <Skills order={profile.skillsOrder} />,
  };

  return (
    <>
      <main id="main">
        <JsonLd data={homeJsonLd(profile)} />
        <RememberHome path={profile.path} />
        <Hero hero={profile.hero} variant={heroVariant} />
        <Marquee items={profile.stack} />
        {shown.map((key) => (
          <Fragment key={key}>{render[key]()}</Fragment>
        ))}
      </main>
      <Contact />
    </>
  );
}

// a profile's own list, with its key ideas filling in where a project has none; otherwise the content's featured list
function getFeatured(profile: Profile): Project[] {
  if (!profile.featured) return getFeaturedProjects();
  return profile.featured.flatMap((item) => {
    const project = getProject(item.slug);
    if (!project) return [];
    return [{ ...project, keyIdea: project.keyIdea ?? item.keyIdea }];
  });
}
