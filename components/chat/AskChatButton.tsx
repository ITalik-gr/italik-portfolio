"use client";

import type { ReactNode } from "react";
import { buttonClasses } from "@/components/ui/Button";
import { openChatDrawer } from "@/lib/chat/store";

// pages without the Ask AI section open the chat drawer straight away
export function AskChatButton({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <button type="button" onClick={() => openChatDrawer("button")} className={buttonClasses("ghost", "lg", className)}>
      {children}
    </button>
  );
}
