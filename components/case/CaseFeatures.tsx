import Image from "next/image";
import { ImageFrame } from "@/components/ui/ImageFrame";
import type { Project } from "@/lib/schemas";

type Props = { features: NonNullable<Project["features"]> };

// a feature without a screenshot shows its number in the image's place
export function CaseFeatures({ features }: Props) {
  return (
    <ol className="grid gap-[40px] | md:grid-cols-3 md:gap-[24px]">
      {features.map((feature, index) => (
        <li key={feature.title}>
          {feature.image ? (
            <ImageFrame ratio="4/3" className="mb-[16px]">
              <Image
                src={feature.image}
                alt={`${feature.title} screenshot`}
                fill
                sizes="(min-width: 1024px) 322px, (min-width: 768px) 33vw, 100vw"
                className="object-cover"
              />
            </ImageFrame>
          ) : (
            <span className="mb-fl-12/20 block font-mono text-[12px] leading-[16px] text-accent | md:text-[13px] md:leading-[17px]">
              {String(index + 1).padStart(2, "0")}
            </span>
          )}
          <h3 className="text-fl-22/26 leading-[1.1] font-semibold tracking-[-0.02em]">
            {feature.title}
          </h3>
          <p className="mt-[12px] text-fl-16/17 leading-[1.5] text-text-3">{feature.text}</p>
        </li>
      ))}
    </ol>
  );
}
