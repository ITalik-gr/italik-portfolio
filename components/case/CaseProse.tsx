import { DraftText } from "@/components/ui/DraftText";

export function CaseProse({ paragraphs }: { paragraphs: string[] }) {
  return (
    <div className="flex max-w-[783px] flex-col gap-[16px] text-fl-18/22 leading-[1.55] text-text-2">
      {paragraphs.map((paragraph) => (
        <p key={paragraph}>
          <DraftText text={paragraph} />
        </p>
      ))}
    </div>
  );
}
