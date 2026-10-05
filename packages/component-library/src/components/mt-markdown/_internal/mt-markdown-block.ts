import { defineComponent, h, type PropType, type VNodeChild } from "vue";
import type { MarkedToken, Token, Tokens } from "marked";
import MtCodeBlock from "@/components/_internal/mt-code-block.vue";
import { INCOMPLETE_IMAGE, allowedImageSrc, isExternal, safeHref } from "./safe-url";

interface RenderContext {
  imagePrefixes: readonly string[];
  /** Whether the block is still being written. */
  incomplete: boolean;
}

/** Named character references that models write. marked decodes only the numeric ones. */
const ENTITIES: Record<string, string> = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: " ",
  copy: "©",
  reg: "®",
  trade: "™",
  hellip: "…",
  mdash: "—",
  ndash: "–",
  laquo: "«",
  raquo: "»",
  euro: "€",
  times: "×",
  deg: "°",
  middot: "·",
  bull: "•",
  rarr: "→",
  larr: "←",
};

function decodeEntities(text: string) {
  return text.replace(/&([a-z]+);/gi, (match, name: string) => ENTITIES[name] ?? match);
}

function externalAttrs(href: string) {
  return isExternal(href) ? { target: "_blank", rel: "noopener noreferrer" } : {};
}

function renderBlocks(tokens: Token[], context: RenderContext): VNodeChild[] {
  return tokens.map((token) => renderBlock(token, context));
}

function renderBlock(token: Token, context: RenderContext): VNodeChild {
  const block = token as MarkedToken;

  switch (block.type) {
    case "heading":
      return h(`h${block.depth}`, renderInline(block.tokens, context));
    case "paragraph":
      return h("p", renderInline(block.tokens, context));
    // The text of an item in a tight list, which has no paragraph.
    case "text":
      return block.tokens ? renderInline(block.tokens, context) : decodeEntities(block.text);
    case "list":
      return renderList(block, context);
    case "blockquote":
      return h("blockquote", renderBlocks(block.tokens, context));
    case "hr":
      return h("hr");
    case "code":
      return h(MtCodeBlock, {
        code: block.text,
        // The info string may hold more than the language, as in "ts title=example.ts".
        language: block.lang?.split(/\s/)[0] || undefined,
        incomplete: context.incomplete,
      });
    case "table":
      return renderTable(block, context);
    // In a tight list, the checkbox of a task is a block of its own.
    case "checkbox":
      return renderCheckbox(block);
    // Raw HTML stays text: the content is not trusted.
    case "html":
      return h("p", block.text.trim());
    case "space":
    case "def":
      return null;
    default:
      return renderInline([token], context);
  }
}

function renderList(list: Tokens.List, context: RenderContext) {
  const start = list.ordered && typeof list.start === "number" && list.start !== 1;

  return h(
    list.ordered ? "ol" : "ul",
    { start: start ? list.start : undefined },
    list.items.map((item) => h("li", renderBlocks(item.tokens, context))),
  );
}

function renderTable(table: Tokens.Table, context: RenderContext) {
  const style = (align: Tokens.TableCell["align"]) => (align ? { textAlign: align } : undefined);

  // The wrapper scrolls a wide table. A scrolling table itself (`display: block`) would lose its
  // table semantics in Safari.
  return h(
    "div",
    { class: "mt-markdown__table" },
    h("table", [
      h(
        "thead",
        h(
          "tr",
          table.header.map((cell) =>
            h("th", { scope: "col", style: style(cell.align) }, renderInline(cell.tokens, context)),
          ),
        ),
      ),
      table.rows.length > 0
        ? h(
            "tbody",
            table.rows.map((row) =>
              h(
                "tr",
                row.map((cell) =>
                  h("td", { style: style(cell.align) }, renderInline(cell.tokens, context)),
                ),
              ),
            ),
          )
        : null,
    ]),
  );
}

function renderCheckbox(checkbox: Tokens.Checkbox) {
  return h("input", { type: "checkbox", checked: checkbox.checked, disabled: true });
}

function renderInline(tokens: Token[] | undefined, context: RenderContext): VNodeChild[] {
  return (tokens ?? []).map((token) => renderInlineToken(token, context));
}

function renderInlineToken(token: Token, context: RenderContext): VNodeChild {
  const inline = token as MarkedToken;

  switch (inline.type) {
    case "text":
      return inline.tokens ? renderInline(inline.tokens, context) : decodeEntities(inline.text);
    case "escape":
      return inline.text;
    case "strong":
      return h("strong", renderInline(inline.tokens, context));
    case "em":
      return h("em", renderInline(inline.tokens, context));
    case "del":
      return h("del", renderInline(inline.tokens, context));
    case "codespan":
      return h("code", inline.text);
    case "br":
      return h("br");
    case "link":
      return renderLink(inline, context);
    case "image":
      return renderImage(inline, context);
    // In a loose list, the checkbox of a task starts the item's first paragraph.
    case "checkbox":
      return renderCheckbox(inline);
    // Raw HTML stays text, except line breaks, which models often put into table cells.
    case "html":
      return /^<br\s*\/?>$/i.test(inline.text.trim()) ? h("br") : inline.text;
    default:
      return "text" in inline && typeof inline.text === "string" ? inline.text : null;
  }
}

function renderLink(link: Tokens.Link, context: RenderContext) {
  const children = renderInline(link.tokens, context);
  const href = safeHref(link.href);

  // A link with an unsafe target, or one that is still streaming, shows its text only.
  if (href === undefined) return children;

  return h("a", { href, title: link.title || undefined, ...externalAttrs(href) }, children);
}

function renderImage(image: Tokens.Image, context: RenderContext) {
  if (image.href === INCOMPLETE_IMAGE) return null;

  const src = allowedImageSrc(image.href, context.imagePrefixes);
  if (src) {
    return h("img", { src, alt: image.text, title: image.title || undefined, loading: "lazy" });
  }

  // An image that may not load becomes a link to it, so nothing loads without a click.
  const label = image.text || image.href;
  const href = safeHref(image.href);

  return href ? h("a", { href, ...externalAttrs(href) }, label) : label;
}

/**
 * One top-level block of `mt-markdown`. `mt-markdown` passes the same token object as long as the
 * block's Markdown doesn't change, so Vue skips rendering the finished blocks of a streaming answer.
 */
export default defineComponent({
  name: "MtMarkdownBlock",

  props: {
    token: {
      type: Object as PropType<Token>,
      required: true,
    },
    imagePrefixes: {
      type: Array as PropType<readonly string[]>,
      required: true,
    },
    incomplete: {
      type: Boolean,
      default: false,
    },
  },

  setup(props) {
    return () =>
      renderBlock(props.token, {
        imagePrefixes: props.imagePrefixes,
        incomplete: props.incomplete,
      });
  },
});
