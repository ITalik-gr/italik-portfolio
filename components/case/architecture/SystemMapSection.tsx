import { Reveal } from "@/components/motion/Reveal";
import type { MapArchitecture } from "@/lib/schemas-architecture";
import { Guarantees } from "./Guarantees";
import { uniqueKinds } from "./kinds";
import { Legend } from "./Legend";
import { SystemMap } from "./SystemMap";
import { SystemMapMobile } from "./SystemMapMobile";
import { Trace } from "./Trace";

const DESCRIPTION_ID = "system-map-description";

export function SystemMapSection({ architecture }: { architecture: MapArchitecture }) {
  const kinds = uniqueKinds(architecture.nodes.map((node) => node.kind));

  return (
    <div className="flex flex-col gap-[40px] | md:gap-[48px]">
      <Reveal className="grid gap-[20px] | lg:grid-cols-2 lg:items-end lg:gap-[80px]">
        <h3 className="text-fl-34/64 leading-[1] font-bold tracking-[-0.03em]">
          {architecture.title}
        </h3>
        <div className="flex flex-col gap-[24px]">
          <p className="text-fl-17/19 leading-[1.58] text-text-3">{architecture.summary}</p>
          <Legend kinds={kinds} context="map" />
        </div>
      </Reveal>

      <Reveal>
        <p id={DESCRIPTION_ID} className="sr-only">
          {describeMap(architecture)}
        </p>
        <SystemMap
          architecture={architecture}
          descriptionId={DESCRIPTION_ID}
          className="hidden | xl:block"
        />
        <SystemMapMobile architecture={architecture} className="| xl:hidden" />
      </Reveal>

      <Trace trace={architecture.trace} />
      <Guarantees guarantees={architecture.guarantees} />
    </div>
  );
}

// the same map as text, for screen readers at every width
function describeMap({ zones, nodes, edges }: MapArchitecture) {
  const title = (id: string) => nodes.find((node) => node.id === id)?.title ?? id;
  const parts = zones.map(
    (zone) =>
      `${zone.label}: ${nodes
        .filter((node) => node.zone === zone.id)
        .map((node) => node.title)
        .join(", ")}.`,
  );
  const links = edges.map(
    (edge) => `${title(edge.from)} to ${title(edge.to)}${edge.label ? ` (${edge.label})` : ""}`,
  );
  return `System map. ${parts.join(" ")} Connections: ${links.join("; ")}.`;
}
