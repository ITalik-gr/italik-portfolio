import { DraftText } from "@/components/ui/DraftText";

// the first paragraph is the statement, anything after it is supporting detail
export function CaseProblem({ paragraphs }: { paragraphs: string[] }) {
  const [lead, ...rest] = paragraphs;

  return (
    <div className="flex flex-col gap-[20px]">
      <p className="text-fl-24/44 leading-[1.2] tracking-[-0.025em]">
        <DraftText text={lead} />
      </p>
      {rest.map((paragraph) => (
        <p key={paragraph} className="max-w-[760px] text-fl-17/20 leading-[1.5] text-text-3">
          <DraftText text={paragraph} />
        </p>
      ))}
    </div>
  );
}
