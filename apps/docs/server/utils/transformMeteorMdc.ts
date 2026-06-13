import { camelCase, kebabCase, pascalCase, upperFirst } from "scule";
import { formatType } from "#shared/utils/formatType";
import { stripExampleCode } from "#shared/utils/stripExampleCode";
import componentMeta from "#nuxt-component-meta";
// @ts-expect-error virtual module provided by modules/component-examples.ts
import { getComponentExample } from "#component-example/nitro";

type MinimarkNode = [string, Record<string, unknown>, ...unknown[]];

interface PropMeta {
  name: string;
  type?: string;
  default?: string;
  description?: string;
  required?: boolean;
}

interface EventMeta {
  name: string;
  type?: string;
  description?: string;
}

interface SlotMeta {
  name: string;
  type?: string;
  description?: string;
}

interface ExposedMeta {
  name: string;
  type?: string;
  description?: string;
}

interface PageDocument {
  path?: string;
  title?: string;
  description?: string;
  body: { type?: string; value: MinimarkNode[] };
}

type MetaField = "props" | "events" | "slots" | "exposed";

function getMeta<T>(componentName: string, field: MetaField): T[] | null {
  const entry = (
    componentMeta as Record<string, { meta?: Record<string, unknown> }>
  )[componentName];
  const items = entry?.meta?.[field];
  if (!items) return null;
  return Object.values(items) as T[];
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
 * A single table cell, expressed independently of the output format. `code`
 * wraps the value in a code span; `raw` is inserted verbatim (already safe).
 */
type CellPart = { code: string } | { text: string } | { raw: string };

interface Column<T> {
  header: string;
  cell: (item: T) => CellPart[];
}

const PROP_COLUMNS: Column<PropMeta>[] = [
  {
    header: "Prop",
    cell: (p) => [
      { code: kebabCase(p.name) },
      ...(p.required ? [{ raw: " *" } as CellPart] : []),
    ],
  },
  { header: "Type", cell: (p) => [{ code: formatType(p.type) ?? "" }] },
  { header: "Default", cell: (p) => [{ code: p.default ?? "" }] },
  { header: "Description", cell: (p) => [{ text: p.description ?? "" }] },
];

const EVENT_COLUMNS: Column<EventMeta>[] = [
  { header: "Event", cell: (e) => [{ code: e.name }] },
  { header: "Payload", cell: (e) => [{ code: formatType(e.type) ?? "" }] },
  { header: "Description", cell: (e) => [{ text: e.description ?? "" }] },
];

const SLOT_COLUMNS: Column<SlotMeta>[] = [
  { header: "Slot", cell: (s) => [{ code: s.name }] },
  { header: "Bindings", cell: (s) => [{ code: formatType(s.type) ?? "" }] },
  { header: "Description", cell: (s) => [{ text: s.description ?? "" }] },
];

const EXPOSED_COLUMNS: Column<ExposedMeta>[] = [
  { header: "Name", cell: (e) => [{ code: e.name }] },
  { header: "Type", cell: (e) => [{ code: formatType(e.type) ?? "" }] },
  { header: "Description", cell: (e) => [{ text: e.description ?? "" }] },
];

interface Section<T = unknown> {
  title: string;
  field: MetaField;
  columns: Column<T>[];
}

const SECTIONS: Section[] = [
  {
    title: "Props",
    field: "props",
    columns: PROP_COLUMNS as Column<unknown>[],
  },
  {
    title: "Events",
    field: "events",
    columns: EVENT_COLUMNS as Column<unknown>[],
  },
  {
    title: "Slots",
    field: "slots",
    columns: SLOT_COLUMNS as Column<unknown>[],
  },
  {
    title: "Exposed",
    field: "exposed",
    columns: EXPOSED_COLUMNS as Column<unknown>[],
  },
];

/** The non-empty API sections for a component, in display order. */
function apiSections(componentName: string) {
  return SECTIONS.map((section) => ({
    ...section,
    rows: getMeta(componentName, section.field) ?? [],
  })).filter((section) => section.rows.length > 0);
}

/**
 * Renders a table as a plain GFM markdown string. Used for the /raw/*.md
 * route: minimark/stringify passes raw strings through verbatim, while table
 * AST nodes would be serialized to HTML there.
 */
function tableString<T>(columns: Column<T>[], rows: T[]): string {
  const renderPart = (part: CellPart) =>
    "code" in part
      ? codeCell(part.code)
      : "raw" in part
        ? part.raw
        : cell(part.text);

  const body = rows.map(
    (row) =>
      `| ${columns
        .map((column) => column.cell(row).map(renderPart).join(""))
        .join(" | ")} |`,
  );

  return (
    [
      `| ${columns.map((column) => column.header).join(" | ")} |`,
      `| ${columns.map(() => "---").join(" | ")} |`,
      ...body,
    ].join("\n") + "\n\n"
  );
}

/**
 * Renders a table as minimark table nodes. Used for the llms exports:
 * @nuxt/content's stringifier escapes raw strings but serializes table nodes
 * as GFM pipe tables (the inverse of minimark/stringify).
 */
function tableNode<T>(columns: Column<T>[], rows: T[]): MinimarkNode {
  // @nuxt/content's table serializer does not escape pipes in cell content,
  // so escape them here to keep the GFM columns intact.
  const code = (text: string): MinimarkNode => ["code", {}, cell(text)];

  const cellNode = (parts: CellPart[]): MinimarkNode => {
    const contents: unknown[] = [];
    for (const part of parts) {
      if ("code" in part) {
        if (part.code) contents.push(code(part.code));
      } else if ("raw" in part) {
        contents.push(part.raw);
      } else if (part.text) {
        contents.push(cell(part.text));
      }
    }
    return ["td", {}, ...contents] as MinimarkNode;
  };

  const headerRow: MinimarkNode = [
    "tr",
    {},
    ...columns.map((column) => ["th", {}, column.header] as MinimarkNode),
  ];
  const bodyRows: MinimarkNode[] = rows.map(
    (row) =>
      [
        "tr",
        {},
        ...columns.map((column) => cellNode(column.cell(row))),
      ] as MinimarkNode,
  );

  return ["table", {}, ["thead", {}, headerRow], ["tbody", {}, ...bodyRows]];
}

function componentNameFrom(
  attributes: Record<string, unknown> | undefined,
  page: PageDocument,
): string {
  return (
    ((attributes || {}) as Record<string, string>).name ??
    `Mt${upperFirst(camelCase(page.path?.split("/").pop() ?? ""))}`
  );
}

function findPre(children: unknown[]): MinimarkNode | null {
  for (const child of children) {
    if (!Array.isArray(child)) continue;
    if (child[0] === "pre") return child as MinimarkNode;
    const nested = findPre(child.slice(2));
    if (nested) return nested;
  }
  return null;
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
  walkInPlace(page.body.value, (node) => {
    const [tag, attributes, ...children] = node;

    if (tag === "component-api") {
      const componentName = componentNameFrom(attributes, page);
      const sections = apiSections(componentName);
      if (!sections.length) return [];

      if (tableAs === "string") {
        return [
          sections
            .map(
              (section) =>
                `### ${section.title}\n\n${tableString(section.columns, section.rows)}`,
            )
            .join(""),
        ];
      }

      return sections.flatMap((section) => [
        ["h3", {}, section.title] as MinimarkNode,
        tableNode(section.columns, section.rows),
      ]);
    }

    if (tag === "component-example") {
      // A manual #code slot already contains a code block: export that block
      // instead of the auto-generated source.
      const manualCode = findPre(children);
      if (manualCode) return [manualCode];

      const name = ((attributes || {}) as Record<string, string>).name;
      const example = name ? getComponentExample(pascalCase(name)) : null;
      if (!example) return [];

      return [
        [
          "pre",
          { language: "vue", code: stripExampleCode(example.code) },
        ] as MinimarkNode,
      ];
    }

    return undefined;
  });
}

/**
 * Recurses in place so that splice-based replacements at every depth mutate
 * the real node arrays (not a slice copy).
 */
function walkInPlace(
  nodes: unknown[],
  produce: (node: MinimarkNode) => (string | MinimarkNode)[] | undefined,
) {
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    if (!Array.isArray(node) || typeof node[0] !== "string") continue;

    const replacement = produce(node as MinimarkNode);
    if (replacement) {
      nodes.splice(i, 1, ...replacement);
      i += replacement.length - 1;
      continue;
    }

    // Recurse into this node's children (indices 2..end) by reference.
    walkChildren(node as MinimarkNode, produce);
  }
}

function walkChildren(
  node: MinimarkNode,
  produce: (node: MinimarkNode) => (string | MinimarkNode)[] | undefined,
) {
  for (let i = 2; i < node.length; i++) {
    const child = node[i];
    if (!Array.isArray(child) || typeof child[0] !== "string") continue;

    const replacement = produce(child as MinimarkNode);
    if (replacement) {
      node.splice(i, 1, ...replacement);
      i += replacement.length - 1;
      continue;
    }

    walkChildren(child as MinimarkNode, produce);
  }
}
