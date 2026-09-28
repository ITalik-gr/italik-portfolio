import { LANES, type Lane, type Project } from "@/lib/schemas";
import { cn } from "@/lib/utils";

type Step = NonNullable<Project["architecture"]>["steps"][number];

// each step owns one row; the svg and the text list share this height so nodes line up with text
const ROW = 62;

const TONES: Record<Lane, { text: string; stroke: string }> = {
  ingest: { text: "text-text-2", stroke: "stroke-text-2" },
  storage: { text: "text-text-2", stroke: "stroke-text-2" },
  core: { text: "text-text", stroke: "stroke-text" },
  llm: { text: "text-accent", stroke: "stroke-accent" },
  ui: { text: "text-text-2", stroke: "stroke-text-2" },
};

type Geometry = { gap: number; head: number; bend: number; radius: number; labels: boolean };

const DESKTOP: Geometry = { gap: 100, head: 48, bend: 40, radius: 9, labels: true };
const MOBILE: Geometry = { gap: 28, head: 16, bend: 28, radius: 7, labels: false };

export function GitGraph({ steps }: { steps: Step[] }) {
  return (
    <div className="grid grid-cols-[152px_1fr] | md:grid-cols-[500px_1fr]">
      <GraphSvg steps={steps} geometry={MOBILE} className="md:hidden" />
      <GraphSvg steps={steps} geometry={DESKTOP} className="hidden | md:block" />
      <ol className="pt-[16px] | md:pt-[48px]">
        {steps.map((step, index) => (
          <li
            key={index}
            style={{ height: ROW }}
            className="flex flex-col justify-center gap-[3px] pl-[12px]"
          >
            <span
              className={cn(
                "font-mono text-[11px] leading-[14px] tracking-[0.09em] uppercase",
                TONES[step.lane].text,
              )}
            >
              {step.lane}
            </span>
            <span className="text-fl-15/19 leading-[1.2]">{step.text}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

function GraphSvg({
  steps,
  geometry,
  className,
}: {
  steps: Step[];
  geometry: Geometry;
  className?: string;
}) {
  const { gap, head, bend, radius, labels } = geometry;
  const width = gap * LANES.length;
  const height = head + steps.length * ROW + 24;
  const x = (lane: Lane) => gap / 2 + LANES.indexOf(lane) * gap;
  const y = (index: number) => head + index * ROW + ROW / 2;

  const edges = steps.flatMap((step, index) => {
    const parents = step.from?.map((n) => n - 1) ?? (index > 0 ? [index - 1] : []);
    return parents.map((parent) => {
      const [x1, y1, x2, y2] = [x(steps[parent].lane), y(parent), x(step.lane), y(index)];
      const d =
        x1 === x2
          ? `M${x1} ${y1} V${y2}`
          : `M${x1} ${y1} C${x1} ${y1 + bend} ${x2} ${y2 - bend} ${x2} ${y2}`;
      return { key: `${parent}-${index}`, d, lane: step.lane };
    });
  });

  return (
    <svg
      aria-hidden
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={cn("overflow-visible", className)}
    >
      {LANES.map((lane) => (
        <g key={lane}>
          <line
            x1={x(lane)}
            x2={x(lane)}
            y1={head + 4}
            y2={height}
            strokeDasharray="3 5"
            className="stroke-surface-2"
          />
          {labels && (
            <text
              x={x(lane)}
              y={28}
              textAnchor="middle"
              className={cn(
                "fill-current font-mono text-[11px] tracking-[1px] uppercase",
                TONES[lane].text,
              )}
            >
              {lane}
            </text>
          )}
        </g>
      ))}
      {steps.map((step, index) => (
        <line
          key={index}
          x1={x(step.lane) + radius + 3}
          x2={width}
          y1={y(index)}
          y2={y(index)}
          className="stroke-surface-2"
        />
      ))}
      {edges.map((edge) => (
        <path
          key={edge.key}
          d={edge.d}
          fill="none"
          strokeWidth={2.5}
          className={TONES[edge.lane].stroke}
        />
      ))}
      {steps.map((step, index) => (
        <circle
          key={index}
          cx={x(step.lane)}
          cy={y(index)}
          r={radius}
          strokeWidth={2.5}
          className={cn(TONES[step.lane].stroke, step.lane === "llm" ? "fill-accent" : "fill-bg")}
        />
      ))}
    </svg>
  );
}
