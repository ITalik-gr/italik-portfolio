import Link from "next/link";
import { Fragment } from "react";

const TOKEN = /(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\([^)\s]+\))/;

// `code`, **bold**, *italic* and [links](…); no nesting, the articles don't need it
export function Inline({ text }: { text: string }) {
  return text.split(TOKEN).map((part, index) => {
    if (part.startsWith("`")) {
      return (
        <code key={index} className="bg-surface-2 px-[6px] py-[2px] font-mono text-[0.84em] text-text">
          {part.slice(1, -1)}
        </code>
      );
    }
    if (part.startsWith("**")) {
      return (
        <strong key={index} className="font-semibold text-text">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith("*") && part.length > 2) {
      return <em key={index}>{part.slice(1, -1)}</em>;
    }
    const link = part.match(/^\[([^\]]+)\]\(([^)\s]+)\)$/);
    if (link) {
      const [, label, href] = link;
      // the one place the accent shows up in running text
      const className = "text-accent underline-offset-[3px] hover:underline";
      return href.startsWith("/") || href.startsWith("#") ? (
        <Link key={index} href={href} className={className}>
          {label}
        </Link>
      ) : (
        <a key={index} href={href} target="_blank" rel="noopener noreferrer" className={className}>
          {label}
        </a>
      );
    }
    return <Fragment key={index}>{part}</Fragment>;
  });
}
