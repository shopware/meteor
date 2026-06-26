import type { MeteorMessageTree } from "./types";

/**
 * Resolve a (possibly dotted) key against a nested message tree.
 *
 * `lookupNested(tree, "filter.numberOfResults")` walks `filter` -> `numberOfResults`.
 * A flat key that literally contains dots is matched first as a fast path.
 * Returns the string leaf, or `undefined` if the path is missing or not a string.
 */
export function lookupNested(tree: MeteorMessageTree | undefined, key: string): string | undefined {
  if (!tree) return undefined;

  const direct = tree[key];
  if (typeof direct === "string") return direct;

  let current: string | MeteorMessageTree | undefined = tree;
  for (const segment of key.split(".")) {
    if (typeof current !== "object" || current === null) return undefined;
    current = current[segment];
  }

  return typeof current === "string" ? current : undefined;
}
