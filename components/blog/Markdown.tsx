import Image from "next/image";
import type { CSSProperties } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { parseMarkdown, type Block, type BoxKind } from "@/lib/markdown";
import { cn } from "@/lib/utils";
import { CodeBlock } from "./CodeBlock";
import { Inline } from "./Inline";

// figures and the key numbers break out of the 700px column by 120px on each side, once there's room for it
export const BREAKOUT = "xl:-mx-[120px] xl:w-[940px] | 2xl:w-[1020px]";

const H2 = "scroll-mt-[120px] text-fl-30/40 leading-[1.05] font-semibold tracking-[-0.035em] text-text";

const BOX_LABELS: Partial<Record<BoxKind, string>> = { fail: "What didn't work", note: "Note" };

// article typography from the blog design: 19/1.6 body, 40px H2 with 88 above, pull quotes, boxes, figures, code
export function Markdown({ source }: { source: string }) {
  return <Blocks blocks={parseMarkdown(source)} />;
}

function Blocks({ blocks }: { blocks: Block[] }) {
  return (
    <div className="text-fl-17/19 leading-[1.6] text-text-2 [&>*:first-child]:mt-0">
      {blocks.map((block, index) => (
        <MarkdownBlock key={index} block={block} />
      ))}
    </div>
  );
}

function MarkdownBlock({ block }: { block: Block }) {
  switch (block.type) {
    case "heading":
      return block.level === 2 ? (
        <h2 id={block.id} data-toc className={cn(H2, "mt-fl-64/88 mb-fl-20/24")}>
          <Inline text={block.text} />
        </h2>
      ) : (
        <h3
          id={block.id}
          className="mt-[48px] mb-[16px] scroll-mt-[120px] text-fl-21/24 leading-[1.2] font-semibold tracking-[-0.02em] text-text"
        >
          <Inline text={block.text} />
        </h3>
      );

    case "list": {
      const Tag = block.ordered ? "ol" : "ul";
      return (
        <Tag className="mb-[28px] flex flex-col gap-[10px]">
          {block.items.map((item, index) => (
            <li key={index} className="grid grid-cols-[28px_1fr]">
              <span aria-hidden className="font-mono text-[0.75em] leading-[2.1] text-muted">
                {block.ordered ? String(index + 1).padStart(2, "0") : "·"}
              </span>
              <span>
                <Inline text={item} />
              </span>
            </li>
          ))}
        </Tag>
      );
    }

    case "code":
      return <CodeBlock lang={block.lang} title={block.title} code={block.code} />;

    case "figure":
      return (
        <Reveal className={cn("mt-fl-28/40 mb-fl-28/40", BREAKOUT)}>
          <figure>
            <div className="relative aspect-[16/9] overflow-hidden border border-line bg-surface">
              <Image
                src={block.src}
                alt={block.alt}
                fill
                sizes="(min-width: 1280px) 940px, 100vw"
                className="object-cover object-top"
              />
            </div>
            {block.caption && (
              <figcaption className="mt-[14px] flex gap-[16px] font-mono text-[12px] leading-[1.6] text-muted">
                <span className="shrink-0 text-text">FIG. {block.n}</span>
                <span>{block.caption}</span>
              </figcaption>
            )}
          </figure>
        </Reveal>
      );

    case "quote":
      return (
        <blockquote className="mt-fl-40/56 mb-fl-40/56 text-fl-28/40 leading-[1.15] font-medium tracking-[-0.025em] text-balance text-text">
          <Inline text={block.text} />
        </blockquote>
      );

    case "table":
      return <Table head={block.head} rows={block.rows} />;

    case "box":
      return <Box kind={block.kind} title={block.title} id={block.id} blocks={block.blocks} />;

    default:
      return (
        <p className="mb-[28px] text-pretty">
          <Inline text={block.text} />
        </p>
      );
  }
}

// first column is the label; the last one is the result, so it's the bright one
function Table({ head, rows }: { head: string[]; rows: string[][] }) {
  // the column count goes through a CSS variable: Tailwind can't see a class built at runtime
  const cols = "grid-cols-[96px_repeat(var(--cols),minmax(0,1fr))] | md:grid-cols-[170px_repeat(var(--cols),minmax(0,1fr))]";
  const last = head.length - 1;
  return (
    <div
      role="table"
      style={{ "--cols": last } as CSSProperties}
      className="mb-[40px] text-fl-15/17 leading-[1.45]"
    >
      <div role="row" className={cn("grid gap-[16px] border-b border-line pb-[12px] font-mono text-[11px] tracking-[0.06em] text-faint uppercase", cols)}>
        {head.map((cell, index) => (
          <span key={index} role="columnheader" className={cn(index === last && "text-text")}>
            {cell}
          </span>
        ))}
      </div>
      {rows.map((row, rowIndex) => (
        <div key={rowIndex} role="row" className={cn("grid gap-[16px] border-b border-zone-line py-[16px]", cols)}>
          {row.map((cell, index) => (
            <span
              key={index}
              role={index === 0 ? "rowheader" : "cell"}
              className={cn(
                index === 0 && "pt-[3px] font-mono text-[11px] tracking-[0.06em] text-muted uppercase",
                index > 0 && index < last && "text-muted",
                index === last && index > 0 && "text-text",
              )}
            >
              <Inline text={cell} />
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}

function Box({ kind, title, id, blocks }: { kind: BoxKind; title?: string; id?: string; blocks: Block[] }) {
  const takeaway = kind === "takeaway";
  const label = BOX_LABELS[kind];
  return (
    <Reveal>
      <aside
        className={cn(
          "flex flex-col gap-[14px] bg-surface px-fl-20/32 py-fl-22/32 [&_p:last-child]:mb-0 [&_ul:last-child]:mb-0",
          takeaway ? "mt-[72px] mb-[48px]" : "mb-[32px]",
        )}
      >
        {label && (
          <span className="flex items-center gap-[10px] font-mono text-[12px] tracking-[0.06em] text-text-3 uppercase">
            {kind === "fail" && <span className="text-text">✕</span>}
            {label}
          </span>
        )}
        {title &&
          (takeaway ? (
            <h2 id={id} data-toc className="mb-[6px] scroll-mt-[120px] text-fl-24/28 leading-[1.1] font-semibold tracking-[-0.03em] text-text">
              {title}
            </h2>
          ) : (
            <p className="font-semibold text-text">{title}</p>
          ))}
        <div className={cn(kind === "fail" && "[&_p]:text-text")}>
          <Blocks blocks={blocks} />
        </div>
      </aside>
    </Reveal>
  );
}
