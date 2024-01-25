export function kebabCase(input: string) {
  return input.toLowerCase().replace(/\//g, ".").replace(/ /g, "");
}
