import { Marquee } from "@/components/motion/Marquee";
import { About } from "@/components/sections/About";
import { AskAI } from "@/components/sections/AskAI";
import { ClientWork } from "@/components/sections/ClientWork";
import { Contact } from "@/components/sections/Contact";
import { Experience } from "@/components/sections/Experience";
import { Featured } from "@/components/sections/Featured";
import { Hero } from "@/components/sections/Hero";
import { Lab } from "@/components/sections/Lab";
import { NowBuilding } from "@/components/sections/NowBuilding";
import { Skills } from "@/components/sections/Skills";
import { JsonLd } from "@/components/seo/JsonLd";
import { homeJsonLd } from "@/lib/seo";
import { HERO } from "@/lib/site";

export default function Home() {
  return (
    <>
      <main id="main">
        <JsonLd data={homeJsonLd()} />
        <Hero />
        <Marquee items={HERO.stack} />
        <Featured />
        <Lab />
        <NowBuilding />
        <ClientWork />
        <Experience />
        <About />
        <AskAI />
        <Skills />
      </main>
      <Contact />
    </>
  );
}
