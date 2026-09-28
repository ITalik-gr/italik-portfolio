import Image from "next/image";
import { ImageFrame } from "@/components/ui/ImageFrame";
import { PhoneFrame } from "@/components/ui/PhoneFrame";
import type { Project } from "@/lib/schemas";
import { cn } from "@/lib/utils";

type Shot = NonNullable<Project["gallery"]>[number];

// a desktop screen takes the row, and the phone screens that follow it stand beside it
function toRows(shots: Shot[]) {
  const rows: { desktop?: Shot; phones: Shot[] }[] = [];
  for (const shot of shots) {
    const last = rows.at(-1);
    if (shot.kind === "mobile" && last && last.phones.length < 2) last.phones.push(shot);
    else if (shot.kind === "mobile") rows.push({ phones: [shot] });
    else rows.push({ desktop: shot, phones: [] });
  }
  return rows;
}

export function CaseGallery({ shots, title }: { shots: Shot[]; title: string }) {
  return (
    <div className="mt-fl-48/96 flex flex-col gap-[24px] px-gutter">
      {toRows(shots).map((row, index) => (
        <div
          key={index}
          className="flex flex-col gap-[16px] | md:flex-row md:items-start md:gap-[24px]"
        >
          {row.desktop && (
            <ImageFrame
              url={row.desktop.url}
              label={`${title} · ${row.desktop.label}`}
              className="min-w-0 | md:flex-1"
            >
              {row.desktop.src && (
                <Image
                  src={row.desktop.src}
                  alt={`${title}: ${row.desktop.label}`}
                  fill
                  sizes="(min-width: 768px) 66vw, 100vw"
                  className="object-cover object-top"
                />
              )}
            </ImageFrame>
          )}
          {row.phones.length > 0 && (
            <div className="grid grid-cols-2 gap-[16px] | md:flex md:gap-[24px]">
              {row.phones.map((phone, phoneIndex) => (
                <PhoneFrame
                  key={phone.label}
                  label={`Mobile · ${phone.label}`}
                  className={cn(
                    "| md:w-[150px] | lg:w-[209px]",
                    phoneIndex === 1 && "mt-[32px] | md:mt-[64px]",
                  )}
                >
                  {phone.src && (
                    <Image
                      src={phone.src}
                      alt={`${title} on mobile: ${phone.label}`}
                      fill
                      sizes="209px"
                      className="object-cover object-top"
                    />
                  )}
                </PhoneFrame>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
