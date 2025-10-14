/**
 * Normalize HTML strings for whitespace-insensitive comparison.
 *
 * Strategy:
 * - DOM parse (when available) to standardize markup
 * - Collapse whitespace between tags: >   < → ><
 * - Trim leading/trailing whitespace
 * - Lowercase tag/attr names via serialization from DOM when possible
 */
export function normalizeHtmlForCompare(html: string): string {
  const input = (html ?? '').trim();
  if (!input) return '';

  try {
    // Browser environment path
    if (typeof window !== 'undefined' && typeof window.DOMParser !== 'undefined') {
      const parser = new window.DOMParser();
      const doc = parser.parseFromString(input, 'text/html');
      // Use body.innerHTML as normalized serialization
      const serialized = doc.body.innerHTML;
      return serialized
        .replace(/>\s+</g, '><')
        .replace(/\s+/g, ' ')
        .trim();
    }
  } catch {
    // Fallthrough to non-DOM normalization
  }

  // Fallback: basic normalization without DOM
  return input
    .replace(/>\s+</g, '><')
    .replace(/\s+/g, ' ')
    .trim();
}


