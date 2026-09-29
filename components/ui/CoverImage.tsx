import Image from "next/image";

type Props = { src: string; alt: string; sizes: string; priority?: boolean; className?: string };

// fills its 16:10 parent; top-aligned so a taller screenshot keeps its header in view
export function CoverImage({ src, alt, sizes, priority, className }: Props) {
  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      className={className ?? "object-cover object-top"}
    />
  );
}
