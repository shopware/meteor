import { camelCase, kebabCase, upperFirst } from "scule";
import { visit } from "@nuxt/content/runtime";
// eslint-disable-next-line import/no-unresolved
import componentMeta from "#nuxt-component-meta";

type MinimarkNode = [string, Record<string, unknown>, ...unknown[]];

interface PropMeta {
  name: string;
  type?: string;
  default?: string;
  description?: string;
  required?: boolean;
}

interface PageDocument {
  path?: string;
  title?: string;
  description?: string;
  body: { type?: string; value: MinimarkNode[] };
}

function getPropsMeta(componentName: string): PropMeta[] | null {
  const entry = (
    componentMeta as Record<string, { meta?: { props?: PropMeta[] } }>
  )[componentName];
  const props = entry?.meta?.props;
  if (!props) return null;
  return Object.values(props);
}

/**
 * Escapes a value for use inside a GFM table cell. Per the GFM spec, `\|`
 * is unescaped at the table level, even inside code spans.
 */
function cell(value: string | undefined): string {
  return (value ?? "").replace(/\n/g, " ").replace(/\|/g, "\\|").trim();
}

function codeCell(value: string | undefined): string {
  const escaped = cell(value);
  return escaped ? `\`${escaped}\`` : "";
}

/**
 * Renders the component's props as a plain GFM markdown table string. Used
 * for the /raw/*.md route: minimark/stringify passes raw strings through
 * verbatim, while table AST nodes would be serialized to HTML there.
 */
function propsTableString(props: PropMeta[]): string {
  const rows = props.map((prop) =>
    [
      `${codeCell(kebabCase(prop.name))}${prop.required ? " *" : ""}`,
      codeCell(prop.type),
      codeCell(prop.default),
      cell(prop.description),
    ].join(" | "),
  );

  return (
    [
      "| Prop | Type | Default | Description |",
      "| --- | --- | --- | --- |",
      ...rows.map((row) => `| ${row} |`),
    ].join("\n") + "\n\n"
  );
}

/**
 * Renders the component's props as minimark table nodes. Used for the llms
 * exports: @nuxt/content's stringifier escapes raw strings but serializes
 * table nodes as GFM pipe tables (the inverse of minimark/stringify).
 */
function propsTableNode(props: PropMeta[]): MinimarkNode {
  // @nuxt/content's table serializer does not escape pipes in cell content,
  // so escape them here to keep the GFM columns intact.
  const code = (text: string): MinimarkNode => ["code", {}, cell(text)];
  const headerRow: MinimarkNode = [
    "tr",
    {},
    ["th", {}, "Prop"],
    ["th", {}, "Type"],
    ["th", {}, "Default"],
    ["th", {}, "Description"],
  ];
  const bodyRows: MinimarkNode[] = props.map((prop) => [
    "tr",
    {},
    [
      "td",
      {},
      code(kebabCase(prop.name)),
      ...(prop.required ? [" *"] : []),
    ] as MinimarkNode,
    ["td", {}, ...(prop.type ? [code(prop.type)] : [])] as MinimarkNode,
    ["td", {}, ...(prop.default ? [code(prop.default)] : [])] as MinimarkNode,
    [
      "td",
      {},
      ...(prop.description ? [cell(prop.description)] : []),
    ] as MinimarkNode,
  ]);

  return ["table", {}, ["thead", {}, headerRow], ["tbody", {}, ...bodyRows]];
}

/**
 * Transforms meteor-specific dynamic MDC components in a parsed content
 * document into plain markdown, for the /raw/*.md and llms exports.
 *
 * `tableAs` must match the stringifier that consumes the document: "string"
 * for minimark/stringify (raw route), "node" for @nuxt/content's markdown
 * generator (llms exports).
 */
export function transformMeteorMdc(
  page: PageDocument,
  { tableAs }: { tableAs: "string" | "node" },
) {
  visit(
    page.body as never,
    (node) => Array.isArray(node) && node[0] === "component-props",
    (node) => {
      const [, attributes] = node as MinimarkNode;
      const componentName =
        ((attributes || {}) as Record<string, string>).name ??
        `Mt${upperFirst(camelCase(page.path?.split("/").pop() ?? ""))}`;

      const props = getPropsMeta(componentName);
      if (!props?.length) {
        // No metadata available: drop the component tag from the export.
        return "";
      }

      return (
        tableAs === "string" ? propsTableString(props) : propsTableNode(props)
      ) as never;
    },
  );
}
