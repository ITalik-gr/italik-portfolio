import type { ReactNode } from "react";
import { CaseSection } from "./CaseSection";

export type CaseBlock = {
  key: string;
  label: string;
  aside?: ReactNode;
  wide?: boolean;
  meta?: string;
  content: ReactNode;
  // full-width content under the section, e.g. the screenshot gallery
  after?: ReactNode;
};

export const sectionNumber = (index: number) => String(index + 1).padStart(2, "0");

export function CaseBlocks({ blocks }: { blocks: CaseBlock[] }) {
  return blocks.map((block, index) => (
    <div key={block.key}>
      <CaseSection
        id={`case-${block.key}`}
        number={sectionNumber(index)}
        label={block.label}
        aside={block.aside}
        wide={block.wide}
        meta={block.meta}
      >
        {block.content}
      </CaseSection>
      {block.after}
    </div>
  ));
}
