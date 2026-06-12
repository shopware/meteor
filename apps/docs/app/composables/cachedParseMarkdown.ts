import { markRaw } from "vue";

const cache = new Map<string, unknown>();

export async function cachedParseMarkdown(markdown: string) {
  const cached = cache.get(markdown);
  if (cached) return cached;

  const result = markRaw(await parseMarkdown(markdown));
  cache.set(markdown, result);
  return result;
}
