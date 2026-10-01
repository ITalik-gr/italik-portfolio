import Image from "next/image";
import type { PostCardData } from "@/lib/schemas";
import { cn } from "@/lib/utils";

type Props = {
  post: Pick<PostCardData, "cover" | "keys" | "tags" | "coverAccent">;
  sizes: string;
  className?: string;
};

// sized to the cover width: short numbers big, "$75-150 → $3-6" smaller, and smaller again under a long caption
function numberSize(value: string, caption: string) {
  const size = Math.min(20, 120 / Math.max(value.length, 1));
  return caption.length > 28 ? size * 0.8 : size;
}

// the post's image when it has one; otherwise its biggest number set large, or its first tag in grey
export function PostCover({ post, sizes, className }: Props) {
  const key = post.keys[0];
  const tag = post.tags[0] ?? "Blog";
  return (
    <div
      className={cn(
        "relative aspect-[16/10] overflow-hidden border border-line bg-bg [container-type:inline-size]",
        className,
      )}
    >
      {post.cover ? (
        <Image src={post.cover} alt="" fill sizes={sizes} className="object-cover object-top" />
      ) : key ? (
        <div className="absolute inset-0 flex flex-col justify-end gap-[3cqi] p-[7cqi]">
          <span
            style={{ fontSize: `${numberSize(key.value, key.caption).toFixed(1)}cqi` }}
            className={cn(
              "leading-[0.9] font-semibold tracking-[-0.045em] whitespace-nowrap",
              post.coverAccent ? "text-accent" : "text-text",
            )}
          >
            {key.value}
          </span>
          <span className="max-w-[80%] font-mono text-[max(11px,2.8cqi)] leading-[1.4] tracking-[0.06em] text-text-3 uppercase">
            {key.caption}
          </span>
        </div>
      ) : (
        <div className="absolute inset-0 flex items-end p-[6cqi]">
          <span
            // long tags ("Architecture") step down so the word stays inside the cover
            style={{ fontSize: `${Math.min(18, 150 / Math.max(tag.length, 1)).toFixed(1)}cqi` }}
            className="leading-[0.9] font-semibold tracking-[-0.05em] whitespace-nowrap text-line"
          >
            {tag}
          </span>
        </div>
      )}
    </div>
  );
}
