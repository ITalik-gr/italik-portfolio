import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { ImageFrame } from "@/components/ui/ImageFrame";
import { MemojiSticker } from "@/components/ui/MemojiSticker";
import { MetaTable } from "@/components/ui/MetaTable";
import { MonoLabel } from "@/components/ui/MonoLabel";
import { Progress } from "@/components/ui/Progress";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Status } from "@/components/ui/Status";
import { TextLink } from "@/components/ui/TextLink";

// temporary component board for phase 2; removed before launch
export const metadata: Metadata = { title: "UI", robots: { index: false } };

function Row({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-[16px]">
      <MonoLabel>{title}</MonoLabel>
      <div className="flex flex-wrap items-center gap-[16px]">{children}</div>
    </div>
  );
}

export default function UiPage() {
  return (
    <main id="main" className="flex flex-col gap-[56px] pb-[72px]">
      <h1 className="sr-only">UI components</h1>
      <Section id="ui" labelledBy="ui-title" className="flex flex-col gap-[56px]">
        <SectionHeader
          id="ui-title"
          number="01"
          label="Featured"
          meta="Live · open source"
          title="Featured"
        />

        <Row title="Button primary · sm / md / lg">
          <Button href="/cv.pdf" size="sm" arrow="↓">
            CV
          </Button>
          <Button href="#" arrow="→">
            Case study
          </Button>
          <Button href="#work" size="lg" arrow="↓">
            View work
          </Button>
        </Row>
        <Row title="Button ghost / disabled">
          <Button href="https://money.italik.dev/demo" variant="ghost" arrow="↗">
            Live
          </Button>
          <Button href="#" variant="disabled" arrow="↗">
            Code
          </Button>
          <Button href="#ask" variant="ghost" size="lg" dot>
            Ask my AI about me
          </Button>
        </Row>
        <Row title="TextLink">
          <TextLink href="#">Case study</TextLink>
          <TextLink href="https://github.com/ITalik-gr" arrow="↗">
            Repo
          </TextLink>
          <TextLink href="/cv.pdf" arrow="↓">
            CV
          </TextLink>
        </Row>
        <Row title="Status · label">
          <Status status="live" />
          <Status status="building" />
          <Status status="v2-in-progress" />
          <Status status="next-up" />
          <Status status="nda" note="details limited" />
          <Status status="offline" note="startup closed" />
          <Status status="archived" note="client migrated" />
        </Row>
        <Row title="MonoLabel">
          <MonoLabel>Phase 2 of 4</MonoLabel>
          <MonoLabel size={13}>Kyiv 19:06</MonoLabel>
        </Row>
        <Row title="Chip · text / mono / source">
          <Chip>What AI agents has he built?</Chip>
          <Chip active>Active chip</Chip>
          <Chip variant="mono">content</Chip>
          <Chip variant="mono" active>
            LLM
          </Chip>
          <Chip variant="source">money-track.md</Chip>
        </Row>
        <Row title="Progress">
          <Progress current={2} total={4} className="w-[380px] max-w-full" />
          <Progress current={0} total={3} className="w-[380px] max-w-full" />
        </Row>
        <Row title="MemojiSticker">
          <MemojiSticker className="size-[150px]" />
          <MemojiSticker className="size-[120px]" />
        </Row>
        <div className="grid gap-[40px] | lg:grid-cols-2">
          <MetaTable
            rows={[
              { key: "Type", value: "Personal · AI product" },
              { key: "Status", value: <Status status="live" note="open source" size="meta" /> },
              { key: "Stack", value: "React · TypeScript · Workers · Durable Objects · D1" },
            ]}
          />
          <ImageFrame url="money.italik.dev/demo" label="Money Track · dashboard" />
        </div>
      </Section>
    </main>
  );
}
