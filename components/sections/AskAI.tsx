import { ChatPanel } from "@/components/chat/ChatPanel";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ASK, SECTIONS } from "@/lib/site";
import { HowItWorks } from "./HowItWorks";

// data-hides-fab: the chat itself is on screen here, so the floating Ask AI button steps aside
type Props = { chips: readonly string[]; sub: string };

export function AskAI({ chips, sub }: Props) {
  const { meta } = SECTIONS.ask;

  return (
    <Section id="ask" labelledBy="ask-title">
      <SectionHeader id="ask-header" meta={meta} />
      <div className="mt-fl-24/40 grid grid-cols-[minmax(0,1fr)] gap-[40px] | lg:grid-cols-12 lg:gap-[24px]">
        <div className="flex flex-col gap-[20px] | md:gap-[28px] | lg:col-span-6">
          <h2
            id="ask-title"
            className="text-fl-56/121 leading-[0.85] font-semibold tracking-[-0.045em]"
          >
            {ASK.lines.map((line) => (
              <span key={line} className="block">
                {line}{" "}
              </span>
            ))}
          </h2>
          <p className="max-w-[460px] text-fl-17/20 leading-[1.45] text-text-3">{sub}</p>
          <HowItWorks className="| lg:mt-auto" />
        </div>
        <div data-hides-fab className="min-w-0 | lg:col-span-6 lg:col-start-7">
          <ChatPanel suggestions={chips} />
        </div>
      </div>
    </Section>
  );
}
