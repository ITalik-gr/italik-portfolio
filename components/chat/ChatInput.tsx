"use client";

import { useId, type FormEvent } from "react";
import { ASK } from "@/lib/site";

type Props = {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  disabled?: boolean;
  autoFocus?: boolean;
};

export function ChatInput({ value, onChange, onSubmit, disabled, autoFocus }: Props) {
  // the section and the drawer can both be on the page, so ids must be unique
  const id = useId();
  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (value.trim() && !disabled) onSubmit();
  };

  return (
    <form onSubmit={submit} className="flex border-t border-line">
      <label htmlFor={id} className="sr-only">
        Ask a question about Vitaliy
      </label>
      <input
        id={id}
        autoFocus={autoFocus}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={ASK.placeholder}
        maxLength={1000}
        autoComplete="off"
        className="min-w-0 flex-1 bg-transparent px-[18px] py-[18px] text-[16px] leading-[17px] text-text placeholder:text-muted focus:outline-none"
      />
      <button
        type="submit"
        disabled={disabled}
        className="bg-text px-[18px] font-mono text-[13px] tracking-[0.04em] text-bg uppercase transition-colors hover:bg-accent disabled:bg-line-strong disabled:text-muted | md:px-[22px]"
      >
        <span className="hidden | md:inline">Send </span>↵
      </button>
    </form>
  );
}
