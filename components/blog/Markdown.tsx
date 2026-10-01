import Image from "next/image";
import { parseMarkdown, type Block } from "@/lib/markdown";
import { Inline } from "./Inline";

// article typography: a readable column, headings with anchors, code and figures in the site's style
export function Markdown({ source }: { source: string }) {
  return (
    <div className="flex max-w-[720px] flex-col gap-[20px] text-fl-17/19 leading-[1.6] text-text-2">
      {parseMarkdown(source).map((block, index) => (
        <MarkdownBlock key={index} block={block} />
      ))}
    </div>
  );
}

function MarkdownBlock({ block }: { block: Block }) {
  switch (block.type) {
    case "heading": {
      const Tag = block.level === 2 ? "h2" : "h3";
      return (
        <Tag
          id={block.id}
          className={
            block.level === 2
              ? "mt-fl-24/40 scroll-mt-[96px] text-fl-28/40 leading-[1.05] font-semibold tracking-[-0.03em] text-text"
              : "mt-[12px] scroll-mt-[96px] text-fl-20/24 leading-[1.2] font-semibold tracking-[-0.02em] text-text"
          }
        >
          <Inline text={block.text} />
        </Tag>
      );
    }
    case "list": {
      const Tag = block.ordered ? "ol" : "ul";
      return (
        <Tag
          className={`flex flex-col gap-[8px] pl-[1.25em] ${block.ordered ? "list-decimal" : "list-disc"} marker:text-muted`}
        >
          {block.items.map((item, index) => (
            <li key={index}>
              <Inline text={item} />
            </li>
          ))}
        </Tag>
      );
    }
    case "code":
      return (
        <pre
          data-lang={block.lang || undefined}
          className="overflow-x-auto border border-line bg-surface px-[20px] py-[18px] font-mono text-[13px] leading-[1.65] text-text | md:text-[14px]"
        >
          <code>{block.code}</code>
        </pre>
      );
    case "image":
      return (
        <figure className="my-[12px] flex flex-col gap-[10px]">
          <div className="relative aspect-[16/10] overflow-hidden border border-line bg-surface">
            <Image src={block.src} alt={block.alt} fill sizes="(min-width: 768px) 720px, 100vw" className="object-cover object-top" />
          </div>
          {block.caption && (
            <figcaption className="font-mono text-[12px] leading-[1.6] text-muted | md:text-[13px]">
              {block.caption}
            </figcaption>
          )}
        </figure>
      );
    case "quote":
      return (
        <blockquote className="border-l-2 border-accent pl-[20px] text-fl-18/22 leading-[1.45] text-text">
          <Inline text={block.text} />
        </blockquote>
      );
    default:
      return (
        <p>
          <Inline text={block.text} />
        </p>
      );
  }
}
