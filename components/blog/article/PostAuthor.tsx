import Image from "next/image";
import { siteUrl } from "@/lib/seo";
import { BLOG, SITE } from "@/lib/site";
import { CopyButton } from "../CopyButton";

const LINK = "transition-colors duration-150 hover:text-accent";

// who wrote it, where to find him, and the two ways to pass the article on
export function PostAuthor({ slug }: { slug: string }) {
  const url = `${siteUrl}/blog/${slug}`;
  return (
    <div className="mt-[72px] grid grid-cols-[64px_1fr] items-start gap-x-[24px] gap-y-[20px] border-t border-zone-line pt-[32px] | md:grid-cols-[64px_minmax(0,1fr)_auto]">
      <div className="relative size-[64px] overflow-hidden rounded-full bg-surface">
        <Image src="/about.jpg" alt={SITE.name} fill sizes="64px" className="object-cover" />
      </div>
      <div className="flex flex-col gap-[14px]">
        <p className="text-[18px] leading-[1.5] text-pretty text-text">{BLOG.author}</p>
        <span className="flex gap-[24px] font-mono text-[12px] tracking-[0.06em] text-text-3 uppercase">
          <a href={SITE.socials.telegram} target="_blank" rel="noopener noreferrer" className={LINK}>
            Telegram ↗
          </a>
          <a href={SITE.socials.x} target="_blank" rel="noopener noreferrer" className={LINK}>
            X ↗
          </a>
        </span>
      </div>
      <div className="col-span-2 flex flex-col gap-[10px] font-mono text-[12px] tracking-[0.06em] uppercase | md:col-span-1">
        <span className="text-faint">Share</span>
        <span className="flex flex-wrap gap-[8px]">
          <CopyButton
            text={url}
            label="Copy link"
            event="share"
            data={{ method: "copy_link" }}
            className="h-[40px] px-[12px] text-[12px]"
          />
          <a
            href={`https://x.com/intent/post?url=${encodeURIComponent(url)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-[40px] items-center border border-line-strong px-[12px] text-text transition-colors duration-150 hover:border-accent"
          >
            Share on X ↗
          </a>
        </span>
      </div>
    </div>
  );
}
