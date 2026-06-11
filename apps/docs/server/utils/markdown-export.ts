import componentMeta from "#meteor-component-meta";
import exampleSources from "#meteor-example-sources";

export interface MeteorPageMeta {
  tagName?: string;
  status?: "available" | "experimental" | "deprecated" | "none";
  packageImports?: string | string[];
  packageName?: string;
  sourcePath?: string;
  sourceUrl?: string;
  npmPackage?: string;
}

interface ComponentMeta {
  props: {
    name: string;
    description: string;
    type: string;
    required: boolean;
    default?: string;
    deprecated?: string;
  }[];
  events: { name: string; description: string; type: string }[];
  slots: { name: string; description: string }[];
}

const GITHUB_TREE_URL = "https://github.com/shopware/meteor/tree/main";
const NPM_PACKAGE_URL = "https://www.npmjs.com/package/";
const DEFAULT_COMPONENT_PACKAGE = "@shopware-ag/meteor-component-library";

const VISUAL_REPLACEMENTS: Record<string, string> = {
  "home-hero": [
    "Build Shopware interfaces with Meteor.",
    "",
    "- [Get started](/getting-started/developers)",
    "- [Browse components](/components/button)",
    "- [Tokens](/foundations/tokens/tokens-overview)",
  ].join("\n"),
  "token-browser":
    "The interactive docs include a token browser for semantic color, typography, border radius, and scale tokens. Use the web UI for copyable previews.",
  "color-palette":
    "The interactive docs include copyable primitive color swatches for each palette hue and shade.",
  "typography-scale": [
    "| Token family | Values |",
    "| --- | --- |",
    "| Font sizes | `2xs`, `xs`, `s`, `m`, `l`, `xl`, `2xl`, `3xl` |",
    "| Font weights | `regular`, `medium`, `semibold`, `bold` |",
  ].join("\n"),
  "elevation-surfaces":
    "The interactive docs visualize elevation surface tokens for `sunken`, `default`, and `raised` surfaces in light and dark modes.",
  "interaction-states":
    "The interactive docs show interaction states: resting, hover, focus, pressed, and disabled.",
};

export function flattenMarkdown(markdown: string) {
  return normalizeBlankLines(
    transformOutsideCodeFences(markdown, (section) => {
      let result = section;
      result = removeStyleTags(result);
      result = removePrettierIgnoreComments(result);
      result = transformPageHeaders(result);
      result = transformComponentImports(result);
      result = transformPropsTables(result);
      result = transformComponentExamples(result);
      result = transformDoDontHtml(result);
      result = transformDoDontMdc(result);
      result = transformVisualWidgets(result);
      return result;
    }),
  ).trimEnd();
}

export function getMeteorPageMeta(page: unknown) {
  if (!page || typeof page !== "object" || !("meteor" in page)) {
    return undefined;
  }
  const meta = (page as { meteor?: unknown }).meteor;
  return meta && typeof meta === "object"
    ? (meta as MeteorPageMeta)
    : undefined;
}

export function renderMeteorPageMetaMarkdown(meta?: MeteorPageMeta) {
  const lines: string[] = [];
  const normalized = normalizeMeteorPageMeta(meta);
  if (!normalized) return "";

  if (normalized.tagName) {
    lines.push(`**Component tag:** \`${normalized.tagName}\``);
  }

  if (shouldRenderStatus(normalized.status)) {
    lines.push(`**Status:** ${capitalize(normalized.status)}`);
  }

  if (normalized.importCode) {
    lines.push(fencedCode("ts", normalized.importCode));
  }

  const links = renderMeteorPageMetaLinks(normalized);
  if (links.length > 0) {
    lines.push(
      links.map((link) => `- [${link.label}](${link.href})`).join("\n"),
    );
  }

  return lines.join("\n\n");
}

export function renderMeteorPageMetaNodes(meta?: MeteorPageMeta) {
  const nodes: unknown[] = [];
  const normalized = normalizeMeteorPageMeta(meta);
  if (!normalized) return nodes;

  if (normalized.tagName) {
    nodes.push([
      "p",
      {},
      ["strong", {}, "Component tag:"],
      " ",
      ["code", {}, normalized.tagName],
    ]);
  }

  if (shouldRenderStatus(normalized.status)) {
    nodes.push([
      "p",
      {},
      ["strong", {}, "Status:"],
      ` ${capitalize(normalized.status)}`,
    ]);
  }

  if (normalized.importCode) {
    nodes.push(["pre", { language: "ts", code: normalized.importCode }]);
  }

  const links = renderMeteorPageMetaLinks(normalized);
  if (links.length > 0) {
    nodes.push([
      "ul",
      {},
      ...links.map((link) => [
        "li",
        {},
        ["a", { href: link.href }, link.label],
      ]),
    ]);
  }

  return nodes;
}

function transformOutsideCodeFences(
  markdown: string,
  transform: (section: string) => string,
) {
  const fencePattern = /(```[\s\S]*?```|~~~[\s\S]*?~~~)/g;
  const parts = markdown.split(fencePattern);
  return parts
    .map((part, index) => (index % 2 === 0 ? transform(part) : part))
    .join("");
}

function removeStyleTags(markdown: string) {
  return markdown.replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, "");
}

function removePrettierIgnoreComments(markdown: string) {
  return markdown.replace(/<!--\s*prettier-ignore-(?:start|end)\s*-->\n?/g, "");
}

function transformPageHeaders(markdown: string) {
  let result = markdown.replace(
    /<page-header\b([^>]*)>([\s\S]*?)<\/page-header>/gi,
    (_match, rawAttrs: string, inner: string) =>
      renderPageHeader(parseAttrs(rawAttrs), inner),
  );

  result = result.replace(
    /::page-header(?:\{([^}]*)\})?\s*\n(?:---\n([\s\S]*?)\n---\n)?([\s\S]*?)\n::/g,
    (
      _match,
      rawAttrs: string | undefined,
      rawFrontmatter: string | undefined,
      inner: string,
    ) =>
      renderPageHeader(
        {
          ...parseAttrs(rawAttrs || ""),
          ...parseFrontmatterAttrs(rawFrontmatter || ""),
        },
        inner,
      ),
  );

  result = result.replace(
    /(^|\n):page-header\{([^}]*)\}/g,
    (_match, prefix: string, rawAttrs: string) =>
      `${prefix}${renderPageHeader(parseAttrs(rawAttrs), "")}`,
  );

  return result;
}

function transformPropsTables(markdown: string) {
  let result = markdown.replace(
    /<props-table\b([^>]*)>[\s\S]*?<\/props-table>/gi,
    (_match, rawAttrs: string) => {
      const component = parseAttrs(rawAttrs).component;
      return renderPropsTable(component);
    },
  );

  result = result.replace(
    /(^|\n):props-table\{([^}]*)\}/g,
    (_match, prefix: string, rawAttrs: string) => {
      const component = parseAttrs(rawAttrs).component;
      return `${prefix}${renderPropsTable(component)}`;
    },
  );

  return result;
}

function transformComponentExamples(markdown: string) {
  let result = markdown.replace(
    /<component-example\b([^>]*)>[\s\S]*?<\/component-example>/gi,
    (_match, rawAttrs: string) => {
      const name = parseAttrs(rawAttrs).name;
      return renderComponentExample(name);
    },
  );

  result = result.replace(
    /(^|\n):component-example\{([^}]*)\}/g,
    (_match, prefix: string, rawAttrs: string) => {
      const name = parseAttrs(rawAttrs).name;
      return `${prefix}${renderComponentExample(name)}`;
    },
  );

  return result;
}

function transformDoDontHtml(markdown: string) {
  return markdown.replace(
    /<do-dont\b([^>]*)>[\s\S]*?<\/do-dont>/gi,
    (_match, rawAttrs: string) => {
      const attrs = parseAttrs(rawAttrs);
      return renderDoDont(attrs["do-text"], attrs.dont);
    },
  );
}

function transformDoDontMdc(markdown: string) {
  let result = markdown.replace(
    /(^|\n)::do-dont\s*\n([\s\S]*?)\n::/g,
    (match: string, prefix: string, body: string) => {
      const attrs = parseDoDontSlotSections(body);
      if (!attrs["do-text"] && !attrs.dont) return match;
      return `${prefix}${renderDoDont(attrs["do-text"], attrs.dont)}`;
    },
  );

  result = result.replace(
    /(^|\n)::do-dont\{([\s\S]*?)\}\s*::/g,
    (_match, prefix: string, rawAttrs: string) => {
      const attrs = parseAttrs(rawAttrs);
      return `${prefix}${renderDoDont(attrs["do-text"], attrs.dont)}`;
    },
  );

  result = result.replace(
    /(^|\n):do-dont\{([^}]*)\}/g,
    (_match, prefix: string, rawAttrs: string) => {
      const attrs = parseAttrs(rawAttrs);
      return `${prefix}${renderDoDont(attrs["do-text"], attrs.dont)}`;
    },
  );

  return result.replace(
    /::do-dont\{([\s\S]*?)\}\s*::/g,
    (_match, rawAttrs: string) => {
      const attrs = parseDoDontDirectiveAttrs(rawAttrs);
      return renderDoDont(attrs["do-text"], attrs.dont);
    },
  );
}

function transformVisualWidgets(markdown: string) {
  let result = markdown;
  for (const [tag, replacement] of Object.entries(VISUAL_REPLACEMENTS)) {
    result = result.replace(
      new RegExp(`<${tag}\\b[^>]*>[\\s\\S]*?<\\/${tag}>`, "gi"),
      replacement,
    );
    result = result.replace(
      new RegExp(`::${tag}(?:\\{[^}]*\\})?\\s*::`, "g"),
      replacement,
    );
    result = result.replace(
      new RegExp(`(^|\\n):${tag}(?:\\{[^}]*\\})?`, "g"),
      (_match, prefix: string) => `${prefix}${replacement}`,
    );
  }
  return result;
}

function transformComponentImports(markdown: string) {
  let result = markdown.replace(
    /<component-import\b([^>]*)>[\s\S]*?<\/component-import>/gi,
    (_match, rawAttrs: string) => renderComponentImport(parseAttrs(rawAttrs)),
  );

  result = result.replace(
    /(^|\n)::component-import(?:\{([^}]*)\})?\s*::/g,
    (_match, prefix: string, rawAttrs: string | undefined) =>
      `${prefix}${renderComponentImport(parseAttrs(rawAttrs || ""))}`,
  );

  return result.replace(
    /(^|\n):component-import(?:\{([^}]*)\})?/g,
    (_match, prefix: string, rawAttrs: string | undefined) =>
      `${prefix}${renderComponentImport(parseAttrs(rawAttrs || ""))}`,
  );
}

function renderPageHeader(attrs: Record<string, string>, inner: string) {
  const lines: string[] = [];
  const body = inner.trim();
  if (body) lines.push(body);

  const metadata = renderMeteorPageMetaMarkdown({
    tagName: attrs["tag-name"],
    status: attrs.status as MeteorPageMeta["status"],
    packageImports: attrs["package-imports"],
    packageName: attrs["package-name"],
    sourcePath: attrs["source-path"],
    sourceUrl: attrs["source-url"],
    npmPackage: attrs["npm-package"],
  });
  if (metadata) lines.push(metadata);

  return lines.join("\n\n");
}

function renderPropsTable(component?: string) {
  if (!component) return "";
  const meta = (componentMeta as Record<string, ComponentMeta>)[component];
  if (!meta) return `_No API metadata available for \`${component}\`._`;

  const sections: string[] = [];
  if (meta.props.length > 0) {
    sections.push(
      [
        "### Props",
        "",
        "| Name | Type | Default | Required | Description |",
        "| --- | --- | --- | --- | --- |",
        ...meta.props.map((prop) =>
          tableRow([
            inlineCode(prop.name),
            inlineCode(prop.type),
            prop.default ? inlineCode(prop.default) : "-",
            prop.required ? "Yes" : "No",
            [
              prop.description,
              prop.deprecated && `Deprecated: ${prop.deprecated}`,
            ]
              .filter(Boolean)
              .join(" "),
          ]),
        ),
      ].join("\n"),
    );
  }

  if (meta.events.length > 0) {
    sections.push(
      [
        "### Events",
        "",
        "| Name | Payload | Description |",
        "| --- | --- | --- |",
        ...meta.events.map((event) =>
          tableRow([
            inlineCode(event.name),
            inlineCode(event.type),
            event.description,
          ]),
        ),
      ].join("\n"),
    );
  }

  if (meta.slots.length > 0) {
    sections.push(
      [
        "### Slots",
        "",
        "| Name | Description |",
        "| --- | --- |",
        ...meta.slots.map((slot) =>
          tableRow([inlineCode(slot.name), slot.description]),
        ),
      ].join("\n"),
    );
  }

  return sections.join("\n\n");
}

function renderComponentImport(attrs: Record<string, string>) {
  const packageImports = attrs["package-imports"] || attrs.imports || "";
  if (!packageImports) return "";

  const importCode = renderImportCode(
    packageImports,
    attrs["package-name"] || DEFAULT_COMPONENT_PACKAGE,
  );

  return importCode ? fencedCode("ts", importCode) : "";
}

function renderComponentExample(name?: string) {
  if (!name) return "";
  const source = exampleSources[name];
  if (!source) return `_Example source unavailable for \`${name}\`._`;
  return fencedCode("vue", cleanExampleSource(source));
}

function cleanExampleSource(code: string) {
  return stripDemoAttributes(stripStyleBlocks(stripScriptImports(code)))
    .replace(/\n[ \t]+\n/g, "\n")
    .replace(/<([A-Za-z][\w:-]*)\s*\n\s*>/g, "<$1>")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function stripStyleBlocks(code: string) {
  return code.replace(/\n?<style\b[^>]*>[\s\S]*?<\/style>\s*/g, "\n");
}

function stripScriptImports(code: string) {
  return code.replace(
    /<script setup([^>]*)>([\s\S]*?)<\/script>/g,
    (_match, attrs: string, script: string) => {
      const cleanedScript = removeMeteorImportStatements(script)
        .replace(/^\s+|\s+$/g, "")
        .trim();

      return cleanedScript
        ? `<script setup${attrs}>\n${cleanedScript}\n</script>`
        : "";
    },
  );
}

function removeMeteorImportStatements(script: string) {
  const lines = script.split("\n");
  const cleanedLines: string[] = [];
  let importLines: string[] | null = null;

  for (const line of lines) {
    const trimmedLine = line.trim();

    if (importLines) {
      importLines.push(line);

      if (/;\s*$/.test(trimmedLine)) {
        if (!isMeteorComponentImport(importLines.join("\n"))) {
          cleanedLines.push(...importLines);
        }
        importLines = null;
      }
      continue;
    }

    if (trimmedLine.startsWith("import ")) {
      importLines = [line];
      if (/;\s*$/.test(trimmedLine)) {
        if (!isMeteorComponentImport(line)) {
          cleanedLines.push(line);
        }
        importLines = null;
      }
      continue;
    }

    cleanedLines.push(line);
  }

  if (importLines && !isMeteorComponentImport(importLines.join("\n"))) {
    cleanedLines.push(...importLines);
  }

  return cleanedLines.join("\n");
}

function isMeteorComponentImport(statement: string) {
  return /from\s+["']@shopware-ag\/meteor-component-library(?:\/[^"']*)?["']/.test(
    statement,
  );
}

function stripDemoAttributes(code: string) {
  return code
    .replace(/\sclass="example-[^"]*"/g, "")
    .replace(/\sstyle="[\s\S]*?"/g, "");
}

function renderDoDont(doText = "", dont = "") {
  return ["| Do | Don't |", "| --- | --- |", tableRow([doText, dont])].join(
    "\n",
  );
}

function renderImportCode(packageImports: string, packageName: string) {
  const imports = packageImports
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  if (imports.length === 0) return "";
  if (imports.length === 1) {
    return `import { ${imports[0]} } from "${packageName}";`;
  }

  return `import {\n  ${imports.join(",\n  ")},\n} from "${packageName}";`;
}

function normalizeMeteorPageMeta(meta?: MeteorPageMeta) {
  if (!meta) return null;
  const sourceUrl =
    meta.sourceUrl ||
    (meta.sourcePath ? `${GITHUB_TREE_URL}/${meta.sourcePath}` : "");
  const npmUrl = meta.npmPackage ? `${NPM_PACKAGE_URL}${meta.npmPackage}` : "";
  const packageImports = Array.isArray(meta.packageImports)
    ? meta.packageImports.join(",")
    : meta.packageImports || "";
  const importCode = packageImports
    ? renderImportCode(
        packageImports,
        meta.packageName || DEFAULT_COMPONENT_PACKAGE,
      )
    : "";

  return {
    ...meta,
    sourceUrl,
    npmUrl,
    importCode,
  };
}

function shouldRenderStatus(
  status?: MeteorPageMeta["status"],
): status is "experimental" | "deprecated" {
  return status === "experimental" || status === "deprecated";
}

function renderMeteorPageMetaLinks(
  meta: NonNullable<ReturnType<typeof normalizeMeteorPageMeta>>,
) {
  return [
    meta.sourceUrl ? { label: "Source", href: meta.sourceUrl } : null,
    meta.npmUrl ? { label: "npm", href: meta.npmUrl } : null,
  ].filter((link): link is { label: string; href: string } => link !== null);
}

function parseAttrs(rawAttrs: string) {
  const attrs: Record<string, string> = {};
  const attrPattern =
    /([:@\w-]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'>]+)))?/g;
  let match: RegExpExecArray | null;

  while ((match = attrPattern.exec(rawAttrs))) {
    const name = match[1];
    const value = match[2] ?? match[3] ?? match[4] ?? "";
    if (name) attrs[name] = decodeAttribute(value);
  }

  return attrs;
}

function parseFrontmatterAttrs(frontmatter: string) {
  const attrs: Record<string, string> = {};
  for (const line of frontmatter.split(/\r?\n/)) {
    const match = line.match(/^([\w-]+):\s*(.*)$/);
    if (match?.[1]) attrs[match[1]] = decodeAttribute(match[2] || "");
  }
  return attrs;
}

function parseDoDontDirectiveAttrs(rawAttrs: string) {
  const attrs: Record<string, string> = {};
  const doMatch = rawAttrs.match(/\bdo-text=([\s\S]*?)(?=\s+dont=|$)/);
  const dontMatch = rawAttrs.match(/\bdont=([\s\S]*)$/);

  if (doMatch?.[1]) attrs["do-text"] = normalizeDirectiveValue(doMatch[1]);
  if (dontMatch?.[1]) attrs.dont = normalizeDirectiveValue(dontMatch[1]);

  return attrs;
}

function parseDoDontSlotSections(body: string) {
  const attrs: Record<string, string> = {};
  const sectionPattern =
    /(?:^|\n)#(do|dont)\s*\n([\s\S]*?)(?=\n#(?:do|dont)\s*\n|$)/g;
  let match: RegExpExecArray | null;

  while ((match = sectionPattern.exec(body))) {
    const [, section, content = ""] = match;
    if (section === "do") attrs["do-text"] = normalizeSlotMarkdown(content);
    if (section === "dont") attrs.dont = normalizeSlotMarkdown(content);
  }

  return attrs;
}

function normalizeSlotMarkdown(value: string) {
  return value
    .split(/\r?\n/)
    .map((line) => line.trimEnd())
    .join("\n")
    .trim();
}

function normalizeDirectiveValue(value: string) {
  const trimmed = value.trim();
  if (trimmed.startsWith('"') && trimmed.endsWith('"')) {
    return decodeAttribute(trimmed.slice(1, -1));
  }
  return decodeAttribute(trimmed);
}

function decodeAttribute(value: string) {
  return value
    .replace(/\\"/g, '"')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .trim();
}

function inlineCode(value: string) {
  const escaped = value.replace(/`/g, "\\`");
  return `\`${escaped}\``;
}

function tableCell(value: string) {
  return value
    .replace(/\r?\n+/g, "<br>")
    .replace(/\|/g, "\\|")
    .trim();
}

function tableRow(cells: string[]) {
  return `| ${cells.map(tableCell).join(" | ")} |`;
}

function fencedCode(language: string, code: string) {
  const fence = code.includes("```") ? "````" : "```";
  return `${fence}${language}\n${code}\n${fence}`;
}

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function normalizeBlankLines(markdown: string) {
  return markdown.replace(/[ \t]+\n/g, "\n").replace(/\n{3,}/g, "\n\n");
}
