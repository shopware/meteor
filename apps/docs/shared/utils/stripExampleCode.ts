/**
 * Reduces an example SFC source to the markup users actually write: drops
 * the script block and unwraps the template, so the displayed snippet shows
 * only the component usage.
 */
export function stripExampleCode(source: string): string {
  let code = source.replace(/<script[\s\S]*?<\/script>\s*/g, "");

  const template = code.match(/<template>\n?([\s\S]*?)\n?<\/template>/);
  if (template?.[1] !== undefined) {
    const lines = template[1].split("\n");
    const indents = lines
      .filter((line) => line.trim())
      .map((line) => line.match(/^\s*/)?.[0].length ?? 0);
    const minIndent = indents.length ? Math.min(...indents) : 0;
    code = lines.map((line) => line.slice(minIndent)).join("\n");
  }

  return code.trim();
}
