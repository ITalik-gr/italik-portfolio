import type { ChatSource } from "./types";

const MARKER = "[[";

// the model ends with "[[sources: a.md, b.md]]"; visitors must never see that line, even half-streamed
export function createSourcesFilter() {
  let buffer = "";
  let hidden = false;

  return {
    // returns the text that is safe to show now
    push(chunk: string) {
      buffer += chunk;
      if (hidden) return "";
      const at = buffer.indexOf(MARKER);
      if (at !== -1) {
        hidden = true;
        return buffer.slice(0, at).trimEnd();
      }
      // hold back a trailing "[" in case it is the start of the marker
      const safe = buffer.endsWith("[") ? buffer.slice(0, -1) : buffer;
      buffer = buffer.slice(safe.length);
      return safe;
    },
    // the whole trailer once the stream has ended
    trailer() {
      return hidden ? buffer.slice(buffer.indexOf(MARKER)) : "";
    },
  };
}

// only files that exist in the knowledge base become source chips; the first case study becomes the link
export function resolveSources(trailer: string, known: Map<string, ChatSource>) {
  const list = trailer.match(/\[\[sources:([^\]]*)\]\]/i)?.[1] ?? "";
  const ids = [
    ...new Set(
      list
        .split(",")
        .map((id) => id.trim())
        .filter(Boolean),
    ),
  ].slice(0, 3);
  const sources = ids.flatMap((id) => {
    const source = known.get(id);
    return source ? [source] : [];
  });
  const caseSource = sources.find((source) => source.href?.startsWith("/work/"));
  const link = caseSource?.href
    ? { label: "Read the case study", href: caseSource.href }
    : undefined;
  return { sources, link };
}
