import { ChatPanel } from "@/components/chat/ChatPanel";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { DEMO_MESSAGES } from "@/lib/chat/demo";
import { ASK, SECTIONS } from "@/lib/site";
import { HowItWorks } from "./HowItWorks";

export function AskAI() {
  const { number, label, meta } = SECTIONS.ask;

  return (
    <Section id="ask" labelledBy="ask-title">
      <SectionHeader id="ask-header" number={number} label={label} meta={meta} />
      <div className="mt-fl-24/40 grid gap-[40px] | lg:grid-cols-12 lg:gap-[24px]">
        <div className="flex flex-col gap-[20px] | md:gap-[28px] | lg:col-span-6">
          <h2
            id="ask-title"
            className="text-fl-56/121 leading-[0.85] font-bold tracking-[-0.055em] font-stretch-[88%]"
          >
            {ASK.lines.map((line) => (
              <span key={line} className="block">
                {line}{" "}
              </span>
            ))}
          </h2>
          <p className="max-w-[460px] text-fl-17/20 leading-[1.45] text-text-3">{ASK.sub}</p>
          <HowItWorks className="| lg:mt-auto" />
        </div>
        <ChatPanel initialMessages={DEMO_MESSAGES} className="| lg:col-span-6 lg:col-start-7" />
      </div>
    </Section>
  );
}
