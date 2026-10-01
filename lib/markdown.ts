// the small subset of Markdown the articles use; anything else stays a plain paragraph
export type Block =
  | { type: "heading"; level: 2 | 3; text: string; id: string }
  | { type: "paragraph"; text: string }
  | { type: "list"; ordered: boolean; items: string[] }
  | { type: "code"; lang: string; code: string }
  | { type: "image"; src: string; alt: string; caption?: string }
  | { type: "quote"; text: string };

const BLOCK_START = /^(```|#{2,3}\s|[-*]\s|\d+\.\s|>|!\[)/;
const IMAGE = /^!\[([^\]]*)\]\(([^)\s]+)(?:\s+"([^"]*)")?\)\s*$/;

export const slugify = (text: string) =>
  text
    .toLowerCase()
    .replace(/[`*]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

export function parseMarkdown(source: string): Block[] {
  const lines = source.replace(/\r/g, "").split("\n");
  const blocks: Block[] = [];
  let i = 0;

  // consumes lines while they match, stripping the marker
  const take = (match: RegExp) => {
    const taken: string[] = [];
    while (i < lines.length && match.test(lines[i])) taken.push(lines[i++].replace(match, ""));
    return taken;
  };

  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) {
      i++;
      continue;
    }

    const fence = line.match(/^```(\w*)/);
    if (fence) {
      const code: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith("```")) code.push(lines[i++]);
      i++;
      blocks.push({ type: "code", lang: fence[1], code: code.join("\n") });
      continue;
    }

    const heading = line.match(/^(#{2,3})\s+(.*)/);
    if (heading) {
      const text = heading[2].trim();
      blocks.push({ type: "heading", level: heading[1].length as 2 | 3, text, id: slugify(text) });
      i++;
      continue;
    }

    const image = line.match(IMAGE);
    if (image) {
      blocks.push({ type: "image", alt: image[1], src: image[2], caption: image[3] });
      i++;
      continue;
    }

    if (/^[-*]\s/.test(line)) {
      blocks.push({ type: "list", ordered: false, items: take(/^[-*]\s+/) });
      continue;
    }
    if (/^\d+\.\s/.test(line)) {
      blocks.push({ type: "list", ordered: true, items: take(/^\d+\.\s+/) });
      continue;
    }
    if (line.startsWith(">")) {
      blocks.push({ type: "quote", text: take(/^>\s?/).join(" ") });
      continue;
    }

    const paragraph: string[] = [];
    while (i < lines.length && lines[i].trim() && (paragraph.length === 0 || !BLOCK_START.test(lines[i]))) {
      paragraph.push(lines[i++].trim());
    }
    blocks.push({ type: "paragraph", text: paragraph.join(" ") });
  }
  return blocks;
}

// plain text for summaries, RSS and the chat: Markdown marks stripped
export function toPlainText(source: string) {
  return parseMarkdown(source)
    .flatMap((block) => {
      if (block.type === "code") return [block.code];
      if (block.type === "image") return block.caption ? [block.caption] : [];
      if (block.type === "list") return block.items;
      return [block.text];
    })
    .map((text) => text.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1").replace(/[`*]/g, ""))
    .join("\n\n");
}
