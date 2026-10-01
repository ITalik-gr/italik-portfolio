import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";
import { Contact } from "@/components/sections/Contact";
import { Cta } from "@/components/sections/Cta";
import { HowIWork } from "@/components/sections/HowIWork";
import { ServiceFacts } from "@/components/services/ServiceFacts";
import { ServiceFaq } from "@/components/services/ServiceFaq";
import { ServiceList } from "@/components/services/ServiceList";
import { ServiceProcess } from "@/components/services/ServiceProcess";
import { ServicesHero } from "@/components/services/ServicesHero";
import { servicesJsonLd } from "@/lib/seo";
import { SERVICES_PAGE } from "@/lib/services";

const { title, description } = SERVICES_PAGE.meta;

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/services" },
  openGraph: {
    url: "/services",
    siteName: "italik.dev",
    type: "website",
    locale: "en_US",
    title,
    description,
  },
  twitter: { card: "summary_large_image", title, description },
};

export default function ServicesPage() {
  return (
    <>
      <main id="main">
        <JsonLd data={servicesJsonLd()} />
        <ServicesHero />
        <ServiceList />
        <ServiceFacts />
        <HowIWork />
        <ServiceProcess />
        <ServiceFaq />
        <Cta />
      </main>
      <Contact audience="client" servicesLink={false} />
    </>
  );
}
