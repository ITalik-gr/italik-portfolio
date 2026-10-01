// a tiny highlighter for article snippets (TS, JS, SQL, shell): greys only, as in the blog design.
// it knows comments, strings, keywords and called functions; anything else stays plain text
export type TokenKind = "comment" | "string" | "keyword" | "fn" | "plain";
export type Token = { kind: TokenKind; text: string };

const KEYWORDS = new Set(
  (
    "export import from as const let var function return async await if else for while of in new " +
    "class extends type interface enum public private readonly static default throw try catch finally " +
    "true false null undefined void typeof instanceof switch case break continue yield " +
    "string number boolean unknown any never " +
    "SELECT FROM WHERE AND OR GROUP BY ORDER LIMIT JOIN ON AS INSERT INTO VALUES UPDATE SET DELETE SUM COUNT"
  ).split(" "),
);

const LINE_COMMENT: Record<string, string> = { sql: "--", sh: "#", bash: "#", py: "#" };

export function highlight(code: string, lang: string): Token[][] {
  const comment = LINE_COMMENT[lang] ?? "//";
  // a template string can span lines, so its state carries over
  let openQuote: string | null = null;

  return code.split("\n").map((line) => {
    const tokens: Token[] = [];
    const push = (kind: TokenKind, text: string) => {
      if (!text) return;
      const last = tokens.at(-1);
      if (last?.kind === kind) last.text += text;
      else tokens.push({ kind, text });
    };
    let i = 0;

    while (i < line.length) {
      if (openQuote) {
        const end = line.indexOf(openQuote, i);
        if (end === -1) {
          push("string", line.slice(i));
          i = line.length;
        } else {
          push("string", line.slice(i, end + 1));
          i = end + 1;
          openQuote = null;
        }
        continue;
      }
      const rest = line.slice(i);
      if (rest.startsWith(comment)) {
        push("comment", rest);
        break;
      }
      const ch = line[i];
      if (ch === '"' || ch === "'" || ch === "`") {
        openQuote = ch;
        push("string", ch);
        i++;
        continue;
      }
      const word = rest.match(/^[A-Za-z_$][\w$]*/);
      if (word) {
        const text = word[0];
        const kind = KEYWORDS.has(text) ? "keyword" : /^\s*\(/.test(rest.slice(text.length)) ? "fn" : "plain";
        push(kind, text);
        i += text.length;
        continue;
      }
      push("plain", ch);
      i++;
    }
    // quotes other than the backtick don't cross lines
    if (openQuote && openQuote !== "`") openQuote = null;
    return tokens;
  });
}
