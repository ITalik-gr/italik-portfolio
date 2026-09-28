import { cn } from "@/lib/utils";

type Props = {
  suggestions: readonly string[];
  active?: string;
  onPick: (text: string) => void;
};

// scrolls sideways on phones instead of wrapping into a tall block
export function SuggestionChips({ suggestions, active, onPick }: Props) {
  return (
    <div className="flex gap-[8px] overflow-x-auto px-[18px] pb-[14px] [scrollbar-width:none] | md:flex-wrap md:overflow-visible">
      {suggestions.map((text) => (
        <button
          key={text}
          type="button"
          onClick={() => onPick(text)}
          className={cn(
            "shrink-0 border border-line-strong px-[12px] py-[9px] text-[14px] leading-[17px] transition-colors hover:border-text",
            text === active && "border-accent text-accent hover:border-accent",
          )}
        >
          {text}
        </button>
      ))}
    </div>
  );
}
