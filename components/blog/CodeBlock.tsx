import { Reveal } from "@/components/motion/Reveal";
import { highlight, type TokenKind } from "@/lib/highlight";
import { CopyButton } from "./CopyButton";

const TOKEN_COLORS: Record<TokenKind, string> = {
  comment: "text-faint",
  keyword: "text-muted",
  string: "text-text-3",
  fn: "text-text",
  plain: "text-text-2",
};

// a file tab, the language and Copy on top; line numbers in the gutter; scrolls sideways on phones
export function CodeBlock({ lang, title, code }: { lang: string; title?: string; code: string }) {
  const lines = highlight(code, lang);

  return (
    <Reveal className="mb-[44px]">
      <figure className="border border-line bg-surface">
        <div className="flex items-stretch justify-between border-b border-line bg-bg font-mono text-[12px]">
          {title ? (
            <span className="-mb-px flex h-[42px] min-w-0 items-center border-r border-line bg-surface px-[12px] text-text | md:px-[16px]">
              {/* a long path is cut on narrow phones so Copy stays on screen */}
              <span className="truncate">{title}</span>
            </span>
          ) : (
            <span />
          )}
          <span className="flex shrink-0 items-center gap-[10px] pr-[6px] pl-[10px] tracking-[0.06em] text-muted uppercase | md:gap-[14px] md:pl-[12px]">
            {lang}
            <CopyButton text={code} event="code_copy" data={{ file: title ?? "", lang }} />
          </span>
        </div>
        <pre className="overflow-x-auto py-[18px] font-mono text-[13px] leading-[1.75] | md:text-[14px]">
          <code>
            {lines.map((tokens, index) => (
              <span key={index} className="flex w-max min-w-full pr-[20px]">
                <span aria-hidden className="w-[36px] shrink-0 pr-[16px] text-right text-line-strong select-none | md:w-[44px]">
                  {index + 1}
                </span>
                <span className="whitespace-pre">
                  {tokens.map((token, tokenIndex) => (
                    <span key={tokenIndex} className={TOKEN_COLORS[token.kind]}>
                      {token.text}
                    </span>
                  ))}
                  {"\n"}
                </span>
              </span>
            ))}
          </code>
        </pre>
      </figure>
    </Reveal>
  );
}
