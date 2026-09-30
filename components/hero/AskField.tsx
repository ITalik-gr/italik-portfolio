"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { openChatDrawer, sendQuestion, useChat } from "@/lib/chat/store";
import { cn } from "@/lib/utils";

type Props = {
  questions: readonly string[];
  className?: string;
};

const TYPE_MS = 55;
const ERASE_MS = 25;
const HOLD_MS = 1800;

// a real input; the typed-out recruiter questions are a separate layer that screen readers skip
export function AskField({ questions, className }: Props) {
  const [value, setValue] = useState("");
  const [focused, setFocused] = useState(false);
  const { busy } = useChat();
  const form = useRef<HTMLFormElement>(null);
  const ghost = useRef<HTMLSpanElement>(null);
  // the question currently on screen, sent when the field is empty
  const current = useRef(0);

  useEffect(() => {
    const el = ghost.current;
    const root = form.current;
    if (!el || !root || focused || value) return;
    const box = el.parentElement!;
    // a long question on a phone scrolls to its end, like a real input while typing
    const show = (text: string) => {
      el.textContent = text;
      box.scrollLeft = box.scrollWidth;
    };
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      show(questions[current.current]);
      return;
    }

    let timer = 0;
    let chars = el.textContent?.length ?? 0;
    let erasing = false;

    // text goes straight into the span: a re-render every 55ms would be wasted work
    const step = () => {
      const text = questions[current.current];
      if (!erasing && chars < text.length) {
        chars++;
        show(text.slice(0, chars));
        timer = window.setTimeout(step, TYPE_MS);
      } else if (!erasing) {
        erasing = true;
        timer = window.setTimeout(step, HOLD_MS);
      } else if (chars > 0) {
        chars--;
        show(text.slice(0, chars));
        timer = window.setTimeout(step, ERASE_MS);
      } else {
        erasing = false;
        current.current = (current.current + 1) % questions.length;
        timer = window.setTimeout(step, TYPE_MS * 4);
      }
    };

    const observer = new IntersectionObserver(([entry]) => {
      window.clearTimeout(timer);
      if (entry.isIntersecting) step();
    });
    observer.observe(root);

    return () => {
      window.clearTimeout(timer);
      observer.disconnect();
    };
  }, [questions, focused, value]);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    openChatDrawer();
    // while an answer is still streaming the chat drops new questions, so keep the text for a second try
    if (busy) return;
    void sendQuestion(value.trim() || questions[current.current]);
    setValue("");
  };

  return (
    <form
      ref={form}
      onSubmit={submit}
      className={cn(
        "flex items-center gap-[12px] border-b border-line pb-[12px] | md:gap-[24px] md:pb-[16px]",
        className,
      )}
    >
      <label htmlFor="hero-ask" className="sr-only">
        Ask my AI about me
      </label>
      <div className="relative min-w-0 flex-1">
        <input
          id="hero-ask"
          type="text"
          autoComplete="off"
          maxLength={500}
          value={value}
          placeholder={questions[0]}
          onChange={(event) => setValue(event.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="block w-full bg-transparent text-fl-22/40 leading-[1.3] tracking-[-0.02em] text-text outline-none placeholder:text-transparent"
        />
        <span
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-y-0 left-0 flex max-w-full items-center overflow-hidden text-fl-22/40 leading-[1.3] tracking-[-0.02em] whitespace-nowrap text-muted",
            value && "hidden",
          )}
        >
          <span ref={ghost} />
          {/* a steady caret, no blink; the real one takes over on focus */}
          {!focused && <span className="ml-[2px] h-[1.1em] w-[2px] shrink-0 bg-text" />}
        </span>
      </div>
      <button
        type="submit"
        aria-label="Ask"
        className="group flex size-[44px] shrink-0 items-center justify-center border border-line-strong text-[20px] text-text transition-colors duration-150 hover:border-accent focus-visible:outline-accent | md:size-[52px] md:text-[22px]"
      >
        <span aria-hidden className="transition-colors duration-150 group-hover:text-accent">
          →
        </span>
      </button>
    </form>
  );
}
