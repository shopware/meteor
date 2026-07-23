/**
 * The resolved type structure vue-component-meta computes alongside the printed
 * `type` string. For enums it carries the fully-expanded members (keyed by
 * index), which is how a named type alias (e.g. `MtColorBadgeVariant`) can be
 * rendered as its literal values instead of the opaque alias name.
 */
export interface PropSchema {
  kind?: string;
  type?: string;
  schema?: Record<string, string | PropSchema> | (string | PropSchema)[];
}

/**
 * A TypeScript literal in the type printer's output: a quoted string, a number,
 * or a boolean/nullish keyword.
 */
function isLiteral(member: string): boolean {
  return (
    /^(['"`]).*\1$/.test(member) ||
    /^-?\d+(\.\d+)?$/.test(member) ||
    ["true", "false", "null", "undefined"].includes(member)
  );
}

/**
 * Expands a prop's resolved `schema` into a literal union string, but only when
 * every member is a literal (ignoring `undefined`). This is what turns a named
 * type alias like `MtColorBadgeVariant` — whose printed `type` is just the
 * opaque alias name — into `"default" | "warning" | ...` for the table.
 *
 * Returns undefined when the schema is not a pure-literal enum (e.g. it mixes in
 * `string`, `number`, or object members), so the caller can fall back to the
 * printed type. vue-component-meta keys enum members by index in an object, so
 * the natural ascending-key order of Object.values preserves declaration order.
 */
export function literalUnion(
  schema: PropSchema | undefined,
): string | undefined {
  if (!schema || schema.kind !== "enum" || !schema.schema) return undefined;

  const rawMembers = Array.isArray(schema.schema)
    ? schema.schema
    : Object.values(schema.schema);

  const members = rawMembers
    .filter((member): member is string => typeof member === "string")
    .map((member) => member.trim())
    .filter((member) => member && member !== "undefined");

  const allLiteral = members.length > 0 && members.every(isLiteral);
  return allLiteral ? members.join(" | ") : undefined;
}

/**
 * Removes the `| undefined` that vue-component-meta appends to every optional
 * prop's type. The table already conveys optionality (required props are
 * marked with `*`), so the marker is redundant noise.
 *
 * Splitting happens on top-level union members only, so an `undefined` nested
 * inside a generic, object, or function type is preserved. If stripping would
 * leave nothing (the type is literally `undefined`), the original is returned.
 */
export function formatType(type: string | undefined): string | undefined {
  if (!type) return type;

  const members: string[] = [];
  let depth = 0;
  let current = "";
  let quote: string | null = null;

  for (let i = 0; i < type.length; i++) {
    const char = type[i];

    if (quote) {
      current += char;
      if (char === quote) {
        // A closing quote is escaped only when preceded by an odd number of
        // backslashes (so `\"` is escaped but `\\"` is a real close).
        let backslashes = 0;
        for (let j = i - 1; j >= 0 && type[j] === "\\"; j--) backslashes++;
        if (backslashes % 2 === 0) quote = null;
      }
      continue;
    }

    if (char === '"' || char === "'" || char === "`") {
      quote = char;
      current += char;
      continue;
    }

    if (char === "<" || char === "(" || char === "[" || char === "{") depth++;
    else if (char === ">" || char === ")" || char === "]" || char === "}")
      depth--;

    if (char === "|" && depth === 0) {
      members.push(current);
      current = "";
      continue;
    }

    current += char;
  }
  members.push(current);

  const kept = members
    .map((member) => member.trim())
    .filter((member) => member && member !== "undefined");

  return kept.length ? kept.join(" | ") : type.trim();
}
