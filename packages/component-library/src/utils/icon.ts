export type IconMode = "solid" | "regular";

/**
 * Splits an icon name such as `solid-cog` into its style and the name of the glyph. A name without
 * a style, such as `cog`, gets `fallbackMode`. Size suffixes such as `-s` stay part of the name.
 */
export function parseIconName(
  name: string,
  fallbackMode: IconMode = "regular",
): { mode: IconMode; name: string } {
  const match = /^(solid|regular)-(.+)$/.exec(name);

  return match ? { mode: match[1] as IconMode, name: match[2] } : { mode: fallbackMode, name };
}

/**
 * Gives an icon name the style a component wants, whatever style the name asks for: `regular-cog`
 * becomes `solid-cog` with `mode` set to `solid`.
 */
export function withIconMode(name: string, mode: IconMode): string {
  return `${mode}-${parseIconName(name).name}`;
}
