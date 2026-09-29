import type { Architecture } from "@/lib/schemas-architecture";
import { Flow } from "./Flow";
import { SystemMapSection } from "./SystemMapSection";

export function ArchitectureSection({ architecture }: { architecture: Architecture }) {
  if (architecture.variant === "map") return <SystemMapSection architecture={architecture} />;
  return <Flow architecture={architecture} />;
}

export function architectureMeta(architecture: Architecture, title: string) {
  return architecture.variant === "map" ? "System map · one request · guarantees" : title;
}
