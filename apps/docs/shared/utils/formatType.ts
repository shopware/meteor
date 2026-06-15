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
