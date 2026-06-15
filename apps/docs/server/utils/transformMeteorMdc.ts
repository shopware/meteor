import { camelCase, kebabCase, upperFirst } from "scule";
import { exampleKey } from "#shared/utils/exampleKey";
import { formatType } from "#shared/utils/formatType";
import { DESCRIPTIONS, tokenGroups } from "#shared/data/tokens";
import { iconCommonUsages } from "#shared/data/iconCommonUsages";
import primitives from "@tokens-dict/foundation/primitives.tokens.json";
import lightTokens from "@tokens-dict/administration/light.tokens.json";
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

// --- Foundations token-reference components -------------------------------
// These dynamic components resolve their visuals from CSS variables in the
// browser. For the static markdown export we emit the underlying token data
// (names, values, descriptions) as tables so the raw/llms output stays useful.

interface TokenRow {
  label: string;
  token: string;
  value: string;
  description?: string;
}

/**
 * Formats a token's `$value` for display. Literal values (e.g. `#fafbfe`) pass
 * through; a token reference like `{scale.size.18}` becomes the CSS variable it
 * points at (`var(--scale-size-18)`), which is more useful than an empty cell.
 */
function displayValue(raw: unknown): string {
  if (typeof raw === "number") return String(raw);
  if (typeof raw !== "string") return "";
  if (raw.startsWith("{") && raw.endsWith("}")) {
    return `var(--${raw.slice(1, -1).replace(/\./g, "-")})`;
  }
  return raw;
}

const VALUE_COLUMNS: Column<TokenRow>[] = [
  { header: "Name", cell: (r) => [{ text: r.label }] },
  { header: "Token", cell: (r) => [{ code: r.token }] },
  { header: "Value", cell: (r) => [{ code: r.value }] },
];

const TOKEN_DESC_COLUMNS: Column<TokenRow>[] = [
  { header: "Token", cell: (r) => [{ code: r.token }] },
  { header: "Description", cell: (r) => [{ text: r.description ?? "" }] },
];

function labelTokenDescColumns(first: string): Column<TokenRow>[] {
  return [
    { header: first, cell: (r) => [{ text: r.label }] },
    { header: "Token", cell: (r) => [{ code: r.token }] },
    { header: "Description", cell: (r) => [{ text: r.description ?? "" }] },
  ];
}

const ELEVATION_ROWS: TokenRow[] = [
  {
    label: "Sunken",
    token: "--color-elevation-surface-sunken",
    value: "",
    description:
      "Recessed areas such as wells and inset panels that sit below the base surface.",
  },
  {
    label: "Default",
    token: "--color-elevation-surface-default",
    value: "",
    description: "The base surface for page and panel backgrounds.",
  },
  {
    label: "Raised",
    token: "--color-elevation-surface-raised",
    value: "",
    description:
      "Elements lifted above the base, such as cards, popovers, and dropdowns.",
  },
];

const INTERACTION_ROWS: TokenRow[] = [
  {
    label: "Resting",
    token: "--color-interaction-primary-default",
    value: "",
    description: "The default, idle state.",
  },
  {
    label: "Hover",
    token: "--color-interaction-primary-hover",
    value: "",
    description: "The pointer is over the element.",
  },
  {
    label: "Focus",
    token: "--color-border-brand-default",
    value: "",
    description: "Keyboard focus outline.",
  },
  {
    label: "Pressed",
    token: "--color-interaction-primary-pressed",
    value: "",
    description: "The element is being activated.",
  },
  {
    label: "Disabled",
    token: "--color-interaction-primary-disabled",
    value: "",
    description: "The element is non-interactive.",
  },
];

/** A single table, formatted for the requested stringifier (no heading). */
function table<T>(
  tableAs: "string" | "node",
  columns: Column<T>[],
  rows: T[],
): (string | MinimarkNode)[] {
  if (!rows.length) return [];
  return tableAs === "string"
    ? [tableString(columns, rows)]
    : [tableNode(columns, rows)];
}

/** A heading followed by a table, formatted for the requested stringifier. */
function tableSection<T>(
  tableAs: "string" | "node",
  title: string,
  columns: Column<T>[],
  rows: T[],
): (string | MinimarkNode)[] {
  if (!rows.length) return [];
  if (tableAs === "string") {
    return [`### ${title}\n\n${tableString(columns, rows)}`];
  }
  return [["h3", {}, title] as MinimarkNode, tableNode(columns, rows)];
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

    if (tag === "do-dont") {
      // Each card is a `["template", { "v-slot:do" | "v-slot:dont": "" }, ...]`.
      // Flatten into a bold "Do" / "Don't" label followed by the card's
      // content; skip cards whose slot was not provided. The result is plain
      // markdown, serialized identically by both stringifiers.
      const labels: Record<string, string> = { do: "Do", dont: "Don't" };

      return ["do", "dont"].flatMap((slot) => {
        const template = children.find(
          (child) =>
            Array.isArray(child) &&
            child[0] === "template" &&
            `v-slot:${slot}` in (child[1] as Record<string, unknown>),
        ) as MinimarkNode | undefined;
        if (!template) return [];

        const content = template.slice(2) as MinimarkNode[];
        if (!content.length) return [];

        // MDC emits the second slot's list as bare <li>; wrap them back into a
        // <ul> so the export is a valid markdown list.
        const normalized = content.every((child) => child[0] === "li")
          ? [["ul", {}, ...content] as MinimarkNode]
          : content;

        return [
          ["p", {}, ["strong", {}, labels[slot]!]] as MinimarkNode,
          ...normalized,
        ];
      });
    }

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
      const example = name ? getComponentExample(exampleKey(name)) : null;
      if (!example) return [];

      return [
        ["pre", { language: "vue", code: example.code.trim() }] as MinimarkNode,
      ];
    }

    if (tag === "color-palette") {
      const colors =
        (
          primitives as {
            color?: Record<string, Record<string, { $value?: unknown }>>;
          }
        ).color ?? {};
      return Object.entries(colors).flatMap(([name, steps]) =>
        tableSection(
          tableAs,
          upperFirst(name),
          VALUE_COLUMNS,
          Object.entries(steps).map(([step, def]) => ({
            label: step,
            token: `--color-${name}-${step}`,
            value: displayValue(def?.$value),
          })),
        ),
      );
    }

    if (tag === "typography-scale") {
      const font =
        (
          lightTokens as {
            font?: {
              size?: Record<string, { $value?: unknown }>;
              weight?: Record<string, { $value?: unknown }>;
            };
          }
        ).font ?? {};
      const rows = (
        group: Record<string, { $value?: unknown }> | undefined,
        prefix: string,
      ): TokenRow[] =>
        Object.entries(group ?? {}).map(([label, def]) => ({
          label: upperFirst(label),
          token: `${prefix}-${label}`,
          value: displayValue(def?.$value),
        }));
      return [
        ...tableSection(
          tableAs,
          "Size scale",
          VALUE_COLUMNS,
          rows(font.size, "--font-size"),
        ),
        ...tableSection(
          tableAs,
          "Weights",
          VALUE_COLUMNS,
          rows(font.weight, "--font-weight"),
        ),
      ];
    }

    if (tag === "token-browser") {
      return tokenGroups.flatMap((group) =>
        tableSection(
          tableAs,
          group.name,
          TOKEN_DESC_COLUMNS,
          group.tokens.map((token) => ({
            label: token,
            token,
            value: "",
            description: DESCRIPTIONS[token] || "",
          })),
        ),
      );
    }

    if (tag === "elevation-surfaces") {
      return table(tableAs, labelTokenDescColumns("Surface"), ELEVATION_ROWS);
    }

    if (tag === "interaction-states") {
      return table(tableAs, labelTokenDescColumns("State"), INTERACTION_ROWS);
    }

    if (tag === "icon-common-usages") {
      const columns: Column<{ icon: string; label: string }>[] = [
        { header: "Icon", cell: (r) => [{ code: r.icon }] },
        { header: "Usage", cell: (r) => [{ text: r.label }] },
      ];
      return table(tableAs, columns, iconCommonUsages);
    }

    if (tag === "icon-browser") {
      return [
        [
          "p",
          {},
          "Meteor ships a full set of UI icons in regular and solid styles, each available through the MtIcon component. Use the interactive browser on this page to search icons by name and copy their token.",
        ] as MinimarkNode,
      ];
    }

    if (tag === "contributing-guide") {
      return [
        [
          "p",
          {},
          "The contributing guide is maintained in ",
          [
            "a",
            {
              href: "https://github.com/shopware/meteor/blob/main/CONTRIBUTING.md",
            },
            "CONTRIBUTING.md",
          ],
          " in the repository.",
        ] as MinimarkNode,
      ];
    }

    return undefined;
  });
}

/**
 * Recurses in place so that splice-based replacements at every depth mutate the
 * real node arrays (not a slice copy). `start` is the first index to visit: 0
 * for a top-level node list, 2 to skip a node's [tag, attributes] and walk only
 * its children.
 */
function walkInPlace(
  nodes: unknown[],
  produce: (node: MinimarkNode) => (string | MinimarkNode)[] | undefined,
  start = 0,
) {
  for (let i = start; i < nodes.length; i++) {
    const node = nodes[i];
    if (!Array.isArray(node) || typeof node[0] !== "string") continue;

    const replacement = produce(node as MinimarkNode);
    if (replacement) {
      nodes.splice(i, 1, ...replacement);
      i += replacement.length - 1;
      continue;
    }

    // Recurse into this node's children (indices 2..end) by reference.
    walkInPlace(node as MinimarkNode, produce, 2);
  }
}
