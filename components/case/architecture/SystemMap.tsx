import type { ArchKind, MapArchitecture } from "@/lib/schemas-architecture";
import { cn } from "@/lib/utils";

type Props = { architecture: MapArchitecture; descriptionId: string; className?: string };
type Edge = MapArchitecture["edges"][number];
type Tone = "accent" | "text" | "muted";

const WIDTH = 1360;
const HEIGHT = 640;
const NODE_HEIGHT = 72;

const NODE_SHAPE: Record<ArchKind, string> = {
  input: "fill-surface stroke-line-strong",
  code: "fill-surface stroke-line-strong",
  output: "fill-surface stroke-line-strong",
  llm: "fill-accent-bg stroke-accent",
  check: "fill-surface stroke-text",
  external: "fill-bg stroke-muted",
};

const STROKE: Record<Tone, string> = {
  accent: "stroke-accent",
  text: "stroke-text",
  muted: "stroke-muted",
};
const FILL: Record<Tone, string> = {
  accent: "fill-accent",
  text: "fill-text",
  muted: "fill-muted",
};

// one svg scaled by its viewBox; text sizes are logical px, so they are set a little large for 1280
export function SystemMap({ architecture, descriptionId, className }: Props) {
  const kindOf = new Map(architecture.nodes.map((node) => [node.id, node.kind]));
  const toneOf = (edge: Edge): Tone => {
    if (edge.emphasis) return "text";
    if (kindOf.get(edge.from) === "llm" || kindOf.get(edge.to) === "llm") return "accent";
    return "muted";
  };

  // labels go last, with a black halo, so no line runs through them
  const labels = architecture.edges.map((edge, index) => {
    if (!edge.label || !edge.labelAt) return null;
    return (
      <text
        key={index}
        x={edge.labelAt[0]}
        y={edge.labelAt[1]}
        fontSize="13"
        textAnchor={edge.labelAnchor}
        strokeWidth="6"
        paintOrder="stroke"
        className={cn("stroke-bg font-mono", FILL[toneOf(edge)])}
      >
        {edge.label}
      </text>
    );
  });

  return (
    <svg
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      role="img"
      aria-labelledby={descriptionId}
      className={cn("h-auto w-full", className)}
    >
      <defs>
        {(["accent", "text", "muted"] as const).map((tone) => (
          <marker
            key={tone}
            id={`map-arrow-${tone}`}
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="9"
            markerHeight="9"
            orient="auto-start-reverse"
          >
            <path d="M0 0 L10 5 L0 10 z" className={FILL[tone]} />
          </marker>
        ))}
      </defs>

      {architecture.zones.map((zone) => {
        const llm = zone.kind === "llm";
        return (
          <g key={zone.id}>
            <rect
              x={zone.x + 0.5}
              y={zone.y + 0.5}
              width={zone.w - 1}
              height={zone.h - 1}
              strokeDasharray={llm ? "6 4" : undefined}
              className={llm ? "fill-accent-bg stroke-accent" : "fill-zone stroke-zone-line"}
            />
            <text
              x={zone.x + 16}
              y={zone.y + 28}
              fontSize="12"
              className={cn(
                "font-mono tracking-[0.1em] uppercase",
                llm ? "fill-accent" : "fill-muted",
              )}
            >
              {zone.label}
            </text>
          </g>
        );
      })}

      {architecture.edges.map((edge, index) => {
        const tone = toneOf(edge);
        return (
          <polyline
            key={index}
            points={edge.points.map(([x, y]) => `${x},${y}`).join(" ")}
            fill="none"
            strokeWidth="2"
            strokeDasharray={edge.dashed ? "6 5" : undefined}
            markerEnd={`url(#map-arrow-${tone})`}
            className={STROKE[tone]}
          />
        );
      })}

      {architecture.nodes.map((node) => (
        <g key={node.id}>
          <rect
            x={node.x + 0.5}
            y={node.y + 0.5}
            width={node.w - 1}
            height={NODE_HEIGHT - 1}
            strokeDasharray={node.kind === "llm" || node.kind === "external" ? "6 4" : undefined}
            className={NODE_SHAPE[node.kind]}
          />
          <text
            x={node.x + 16}
            y={node.y + 31}
            fontSize="17"
            className="fill-text font-display font-semibold"
          >
            {node.title}
          </text>
          {node.sub && (
            <text
              x={node.x + 16}
              y={node.y + 54}
              fontSize="12"
              className="fill-text-3 font-mono tracking-[0.06em] uppercase"
            >
              {node.sub}
            </text>
          )}
        </g>
      ))}

      {labels}
    </svg>
  );
}
