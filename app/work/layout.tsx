import type { ReactNode } from "react";
import { Header } from "@/components/layout/Header";
import { SlimFooter } from "@/components/layout/SlimFooter";

export default function WorkLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header variant="case" />
      {children}
      <SlimFooter />
    </>
  );
}
