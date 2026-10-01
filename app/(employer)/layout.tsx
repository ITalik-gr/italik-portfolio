import type { ReactNode } from "react";
import { Header } from "@/components/layout/Header";

export default function EmployerLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header audience="employer" />
      {children}
    </>
  );
}
