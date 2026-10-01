// the subset of Markdown the articles use, plus a few blocks of our own (see content/README.md, "Blog posts")
export type BoxKind = "fail" | "note" | "takeaway";

export type Block =
  | { type: "heading"; level: 2 | 3; text: string; id: string }
  | { type: "paragraph"; text: string }
  | { type: "list"; ordered: boolean; items: string[] }
  | { type: "code"; lang: string; title?: string; code: string }
  | { type: "figure"; src: string; alt: string; caption?: string; n: number }
  | { type: "quote"; text: string }
  | { type: "table"; head: string[]; rows: string[][] }
  | { type: "box"; kind: BoxKind; title?: string; id?: string; blocks: Block[] };

const BOX_KINDS: BoxKind[] = ["fail", "note", "takeaway"];
const BLOCK_START = /^(```|:::|#{2,3}\s|[-*]\s|\d+\.\s|>|!\[|\|)/;
const IMAGE = /^!\[([^\]]*)\]\(([^)\s]+)(?:\s+"([^"]*)")?\)\s*$/;
const TABLE_DIVIDER = /^\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)*\|?\s*$/;

export const slugify = (text: string) =>
  text
    .toLowerCase()
    .replace(/[`*]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const cells = (line: string) =>
  line
    .trim()
    .replace(/^\||\|$/g, "")
    .split("|")
    .map((cell) => cell.trim());

export function parseMarkdown(source: string): Block[] {
  const figures = { n: 0 };
  return parseLines(source.replace(/\r/g, "").split("\n"), figures);
}

function parseLines(lines: string[], figures: { n: number }): Block[] {
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

    // ```ts title="advisor/context.ts"
    const fence = line.match(/^```(\w*)(?:\s+title="([^"]*)")?/);
    if (fence) {
      const code: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith("```")) code.push(lines[i++]);
      i++;
      blocks.push({ type: "code", lang: fence[1], title: fence[2], code: code.join("\n") });
      continue;
    }

    // :::fail / :::note Title / :::takeaway Title ... :::
    const box = line.match(/^:::(\w+)\s*(.*)$/);
    if (box && BOX_KINDS.includes(box[1] as BoxKind)) {
      const inner: string[] = [];
      i++;
      while (i < lines.length && lines[i].trim() !== ":::") inner.push(lines[i++]);
      i++;
      const title = box[2].trim() || undefined;
      blocks.push({
        type: "box",
        kind: box[1] as BoxKind,
        title,
        // a takeaway box ends the article and shows up in the contents
        id: box[1] === "takeaway" && title ? slugify(title) : undefined,
        blocks: parseLines(inner, figures),
      });
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
      blocks.push({ type: "figure", alt: image[1], src: image[2], caption: image[3], n: ++figures.n });
      i++;
      continue;
    }

    if (line.startsWith("|") && TABLE_DIVIDER.test(lines[i + 1] ?? "")) {
      const head = cells(line);
      i += 2;
      const rows = take(/^(?=\|)/).map(cells);
      blocks.push({ type: "table", head, rows });
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
    while (
      i < lines.length &&
      lines[i].trim() &&
      (paragraph.length === 0 || !BLOCK_START.test(lines[i]))
    ) {
      paragraph.push(lines[i++].trim());
    }
    blocks.push({ type: "paragraph", text: paragraph.join(" ") });
  }
  return blocks;
}

// the article's contents: every H2, plus the takeaway box at the end
export function getToc(blocks: Block[]) {
  return blocks.flatMap((block) => {
    if (block.type === "heading" && block.level === 2) return [{ id: block.id, label: block.text }];
    if (block.type === "box" && block.id && block.title) return [{ id: block.id, label: block.title }];
    return [];
  });
}

const stripInline = (text: string) =>
  text.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1").replace(/[`*]/g, "");

function blockText(block: Block): string[] {
  switch (block.type) {
    case "code":
      return [block.code];
    case "figure":
      return block.caption ? [block.caption] : [];
    case "list":
      return block.items;
    case "table":
      return [block.head, ...block.rows].map((row) => row.join(" · "));
    case "box":
      return [...(block.title ? [block.title] : []), ...block.blocks.flatMap(blockText)];
    default:
      return [block.text];
  }
}

// plain text for RSS and the chat: Markdown marks stripped
export function toPlainText(source: string) {
  return parseMarkdown(source).flatMap(blockText).map(stripInline).join("\n\n");
}

// ~220 words a minute; code counts as words too, it takes as long to read
export function readingMinutes(source: string) {
  const words = toPlainText(source).split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}
