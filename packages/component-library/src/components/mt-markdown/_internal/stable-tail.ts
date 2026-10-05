import { Lexer, type Token, type Tokens } from "marked";

/**
 * The end of the text: whitespace and ASCII punctuation, the only characters that CommonMark lets
 * carry syntax. While they end the text, they may still be the start of syntax, such as `**`, `#`
 * or `- `, with nothing to format yet.
 */
const TRAILING_SYNTAX = /[\s!-/:-@[-`{-~]+$/;

/** A character reference that is still being written, such as `&am`. */
const PARTIAL_REFERENCE = /&#?[a-z\d]*$/i;

/** A last line of only digits may still become the marker of an ordered list, such as `1.`. */
const PARTIAL_LIST_NUMBER = /(^|\n)[ \t]*\d{1,9}$/;

/** The marker of a task list item without its text yet, such as `- [x]`. */
const PARTIAL_TASK_MARKER = /(^|\n)[ \t]*(?:[-+*]|\d{1,9}[.)])[ \t]+\[[ xX]?\]?$/;

/** A line that starts with a pipe is a table row, or the header of a table that is coming. */
const TABLE_ROW = /^[ \t]{0,3}\|/;

function withoutTrailingSyntax(text: string) {
  let result = text;
  let previous: string;

  do {
    previous = result;
    result = result
      .replace(TRAILING_SYNTAX, "")
      .replace(PARTIAL_REFERENCE, "")
      .replace(PARTIAL_LIST_NUMBER, "$1")
      .replace(PARTIAL_TASK_MARKER, "$1");
  } while (result !== previous);

  return result;
}

// Block tokens only: the inline content doesn't matter here.
function lastBlock(text: string): Token | undefined {
  return new Lexer({ gfm: true })
    .blockTokens(text)
    .filter((token) => token.type !== "space")
    .at(-1);
}

/**
 * The part of a streaming text that renders as it will in the finished text, so no Markdown shows
 * unrendered or half rendered:
 *
 * - The end of the text waits until it is content, so syntax without content yet never shows.
 * - The block being written appears once its type can't change anymore. Only a paragraph can
 *   still change: lines that start with a pipe wait until the delimiter row makes them a table.
 *   In a table, the row being written waits until its line is complete.
 */
export function stableTail(text: string): string {
  let stable = withoutTrailingSyntax(text);

  for (;;) {
    const block = lastBlock(stable);
    const lineStart = stable.lastIndexOf("\n") + 1;
    const lastLine = stable.slice(lineStart);

    const pendingTable = block?.type === "paragraph" && TABLE_ROW.test(lastLine);
    const pendingRow =
      block?.type === "table" &&
      (block as Tokens.Table).rows.length > 0 &&
      !text.includes("\n", lineStart);

    if (!pendingTable && !pendingRow) return stable;

    stable = withoutTrailingSyntax(stable.slice(0, lineStart));
  }
}
