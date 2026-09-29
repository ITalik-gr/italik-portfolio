import { Reveal } from "@/components/motion/Reveal";
import type { ArchKind, FlowArchitecture } from "@/lib/schemas-architecture";
import { cn } from "@/lib/utils";
import { FlowStep } from "./FlowStep";
import { KIND_LABELS, kindBox, kindLabelColor, uniqueKinds } from "./kinds";
import { Legend } from "./Legend";

type Props = { architecture: FlowArchitecture };

export function Flow({ architecture }: Props) {
  const { summary, highlight, steps, background, notes } = architecture;
  // up to five blocks fit one row on xl; longer chains wrap into two rows
  const twoRows = steps.length > 5;
  const columns = twoRows ? Math.ceil(steps.length / 2) : steps.length;
  const kinds = uniqueKinds([
    ...steps.map((step) => step.kind),
    ...(background ? [background.kind] : []),
  ]);

  return (
    <div className="flex flex-col gap-[32px] | md:gap-[40px]">
      <Reveal className="grid gap-[24px] | lg:grid-cols-2 lg:items-end lg:gap-[80px]">
        <p className="max-w-[640px] text-fl-17/22 leading-[1.5] tracking-[-0.01em] text-text-2">
          {summary}
          {highlight && <span className="text-text"> {highlight}</span>}
        </p>
        <Legend kinds={kinds} context="flow" className="| lg:justify-end" />
      </Reveal>

      <Reveal
        as="ol"
        y={12}
        stagger={0.06}
        duration={0.5}
        style={twoRows ? { gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` } : undefined}
        className={cn(
          "flex flex-col gap-[32px] | md:gap-[40px]",
          twoRows ? "xl:grid xl:gap-x-[40px] xl:gap-y-0" : "xl:flex-row xl:items-stretch",
        )}
      >
        {steps.flatMap((step, index) => {
          const next = steps[index + 1];
          const tone = next ? arrowTone(step.kind, next.kind) : undefined;
          const wraps = twoRows && index === columns - 1;
          const item = (
            <FlowStep key={index} step={step} index={index} arrow={tone} wraps={wraps} />
          );
          if (!wraps || !tone) return [item];
          return [item, <WrapLine key="wrap" columns={columns} tone={tone} />];
        })}
      </Reveal>

      {background && (
        <Reveal>
          <div
            className={cn(
              "flex flex-col gap-[8px] px-[16px] py-[14px] font-mono | md:flex-row md:items-baseline md:gap-[24px] md:px-[20px] md:py-[16px]",
              kindBox(background.kind, "flow"),
            )}
          >
            <p
              className={cn(
                "shrink-0 text-[11px] leading-[14px] tracking-[0.12em] uppercase",
                kindLabelColor(background.kind, "flow"),
              )}
            >
              {background.label} · {KIND_LABELS[background.kind]}
            </p>
            <p className="text-[13px] leading-[20px] text-text-2">{background.text}</p>
          </div>
        </Reveal>
      )}

      {notes && notes.length > 0 && (
        <Reveal
          as="ul"
          className="flex flex-col gap-[8px] font-mono text-[13px] leading-[20px] text-text-3 | md:flex-row md:gap-[48px]"
        >
          {notes.map((note) => (
            <li key={note}>
              <span aria-hidden className="text-accent">
                ↳{" "}
              </span>
              {note}
            </li>
          ))}
        </Reveal>
      )}
    </div>
  );
}

type Tone = "accent" | "muted";

function arrowTone(from: ArchKind, to: ArchKind): Tone {
  return from === "llm" || to === "llm" ? "accent" : "muted";
}

// xl only: from the centre of the last block in row one to the centre of the first block in row two
function WrapLine({ columns, tone }: { columns: number; tone: Tone }) {
  const inset = `calc((100% - ${columns - 1} * 40px) / ${columns} / 2)`;
  const line = tone === "accent" ? "border-accent" : "border-muted";
  return (
    <li aria-hidden className="relative hidden h-[64px] | xl:col-span-full xl:block">
      <span
        className={cn("absolute top-0 h-1/2 border-r border-b", line)}
        style={{ left: inset, right: inset }}
      />
      <span
        className={cn("absolute top-1/2 bottom-[14px] border-l", line)}
        style={{ left: inset }}
      />
      <span
        className={cn(
          "absolute bottom-0 -translate-x-1/2 font-mono text-[16px] leading-[16px]",
          tone === "accent" ? "text-accent" : "text-muted",
        )}
        style={{ left: `calc(${inset} + 0.5px)` }}
      >
        ↓
      </span>
    </li>
  );
}
