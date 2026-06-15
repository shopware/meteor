import { markRaw } from "vue";

// On the server this Map is shared across all requests for the process
// lifetime, so it must stay bounded or it leaks parsed ASTs unboundedly.
const cache = new Map<string, unknown>();
const MAX_ENTRIES = 200;

export async function cachedParseMarkdown(markdown: string) {
  // Use has(), not truthiness, so a legitimately falsy cached value is a hit.
  if (cache.has(markdown)) return cache.get(markdown);

  const result = markRaw(await parseMarkdown(markdown));

  // Simple FIFO eviction: drop the oldest entry once the cap is reached.
  if (cache.size >= MAX_ENTRIES) {
    cache.delete(cache.keys().next().value!);
  }
  cache.set(markdown, result);
  return result;
}
