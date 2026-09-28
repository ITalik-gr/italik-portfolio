import { Reveal } from "@/components/motion/Reveal";
import { DraftText } from "@/components/ui/DraftText";
import { CaseLabel } from "./CaseSection";

type Column = { id: string; number: string; label: string; paragraphs: string[] };

export function CaseClosing({ columns }: { columns: Column[] }) {
  return (
    <div className="mt-fl-96/160 border-t border-line px-gutter pt-[20px] | md:pt-[24px]">
      <Reveal className="grid gap-[40px] | md:grid-cols-3">
        {columns.map((column) => (
          <section key={column.id} aria-labelledby={column.id}>
            <CaseLabel id={column.id} number={column.number} label={column.label} />
            <div className="mt-[20px] flex flex-col gap-[14px] text-fl-18/20 leading-[1.5] text-text-2">
              {column.paragraphs.map((paragraph) => (
                <p key={paragraph}>
                  <DraftText text={paragraph} />
                </p>
              ))}
            </div>
          </section>
        ))}
      </Reveal>
    </div>
  );
}
