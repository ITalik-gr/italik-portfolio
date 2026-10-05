import type { MapArchitecture } from "@/lib/schemas-architecture";
import { cn } from "@/lib/utils";
import { kindBox } from "./kinds";

type Props = { architecture: MapArchitecture; className?: string };
type Node = MapArchitecture["nodes"][number];
type Edge = MapArchitecture["edges"][number];

// below xl the map becomes a column of zones; links between neighbouring zones sit on the connectors,
// every other link is listed after the zones
export function SystemMapMobile({ architecture, className }: Props) {
  const { zones, nodes, edges } = architecture;
  const top = zones.filter((zone) => !zone.parent);
  const nodeById = new Map(nodes.map((node) => [node.id, node]));
  const topOf = (zoneId: string) => zones.find((zone) => zone.id === zoneId)?.parent ?? zoneId;
  const indexOf = (nodeId: string) => {
    const node = nodeById.get(nodeId);
    return node ? top.findIndex((zone) => zone.id === topOf(node.zone)) : -1;
  };
  const forward = (index: number) =>
    edges.filter((edge) => indexOf(edge.from) === index && indexOf(edge.to) === index + 1);
  const onConnectors = new Set(top.flatMap((_, index) => forward(index)));
  const rest = edges.filter((edge) => !onConnectors.has(edge));
  const isLlm = (edge: Edge) =>
    nodeById.get(edge.from)?.kind === "llm" || nodeById.get(edge.to)?.kind === "llm";
  const title = (id: string) => nodeById.get(id)?.title ?? id;

  return (
    <div aria-hidden className={cn("flex flex-col", className)}>
      {top.map((zone, index) => {
        const own = nodes.filter((node) => node.zone === zone.id);
        const children = zones.filter((child) => child.parent === zone.id);
        const links = forward(index);
        return (
          <div key={zone.id}>
            <div className="border border-zone-line bg-zone p-[12px] | md:p-[16px]">
              <ZoneLabel>{zone.label}</ZoneLabel>
              <NodeGrid nodes={own} columns={index === 0 ? 3 : 2} />
              {children.map((child) => (
                <div
                  key={child.id}
                  className="mt-[10px] border border-dashed border-accent bg-accent-bg p-[12px]"
                >
                  <ZoneLabel accent>{child.label}</ZoneLabel>
                  <NodeGrid nodes={nodes.filter((node) => node.zone === child.id)} columns={2} />
                </div>
              ))}
            </div>
            {index < top.length - 1 && (
              <div
                className={cn(
                  "flex items-center gap-[12px] py-[10px] pl-[20px] font-mono text-[12px] leading-[16px]",
                  links.some(isLlm) ? "text-accent" : "text-muted",
                )}
              >
                <span className="text-[16px]">↓</span>
                {links
                  .map((edge) => edge.label)
                  .filter(Boolean)
                  .join(" · ")}
              </div>
            )}
          </div>
        );
      })}

      {rest.length > 0 && (
        <div className="mt-[16px]">
          <ZoneLabel>Links</ZoneLabel>
          <ul className="mt-[10px] flex flex-col gap-[8px] font-mono text-[12px] leading-[17px]">
            {rest.map((edge, index) => (
              <li key={index} className={linkColor(edge.emphasis, isLlm(edge))}>
                {title(edge.from)}
                <span className="text-muted"> -{edge.label ?? ""}→ </span>
                {title(edge.to)}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function linkColor(emphasis: boolean, llm: boolean) {
  if (emphasis) return "text-text";
  return llm ? "text-accent" : "text-text-3";
}

function ZoneLabel({ children, accent }: { children: string; accent?: boolean }) {
  return (
    <p
      className={cn(
        "font-mono text-[11px] leading-[14px] tracking-[0.1em] uppercase",
        accent ? "text-accent" : "text-muted",
      )}
    >
      {children}
    </p>
  );
}

function NodeGrid({ nodes, columns }: { nodes: Node[]; columns: 2 | 3 }) {
  if (nodes.length === 0) return null;
  return (
    <ul
      className={cn(
        "mt-[10px] grid gap-[8px]",
        // three columns at 320 leave room for "Telegram" only with the tighter gap, padding and title
        columns === 3 ? "grid-cols-3 gap-[6px] | md:gap-[8px]" : "grid-cols-1 | sm:grid-cols-2",
      )}
    >
      {nodes.map((node) => (
        <li
          key={node.id}
          className={cn(
            "flex flex-col gap-[4px] px-[8px] py-[10px] | md:p-[12px]",
            kindBox(node.kind, "map"),
          )}
        >
          <span
            className={cn(
              "text-[15px] leading-[19px] font-semibold text-text",
              columns === 3 && "text-[14px] | md:text-[15px]",
            )}
          >
            {node.title}
          </span>
          {node.sub && (
            <span className="font-mono text-[10px] leading-[14px] tracking-[0.06em] text-text-3 uppercase">
              {node.sub}
            </span>
          )}
        </li>
      ))}
    </ul>
  );
}
