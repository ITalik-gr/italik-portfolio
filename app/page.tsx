import { Marquee } from "@/components/motion/Marquee";
import { ClientWork } from "@/components/sections/ClientWork";
import { Contact } from "@/components/sections/Contact";
import { Featured } from "@/components/sections/Featured";
import { Hero } from "@/components/sections/Hero";
import { Lab } from "@/components/sections/Lab";
import { NowBuilding } from "@/components/sections/NowBuilding";
import { HERO } from "@/lib/site";

export default function Home() {
  return (
    <>
      <main id="main">
        <Hero />
        <Marquee items={HERO.stack} />
        <Featured />
        <Lab />
        <NowBuilding />
        <ClientWork />
        {/* TODO: sections 05–08 land here one by one (phase 3) */}
      </main>
      <Contact />
    </>
  );
}
