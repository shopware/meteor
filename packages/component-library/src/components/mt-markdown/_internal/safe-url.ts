/** The schemes a link may use. Links without a scheme, such as `/orders` or `#top`, are allowed too. */
const LINK_PROTOCOLS = new Set(["http:", "https:", "mailto:", "tel:"]);

/** What `remend` puts in place of a link or image whose address is still streaming. */
const INCOMPLETE_LINK = "streamdown:incomplete-link";
export const INCOMPLETE_IMAGE = "streamdown:incomplete-image";

/**
 * The link target if it is safe to render, otherwise `undefined`. Browsers ignore whitespace and
 * control characters in a scheme, so `java\tscript:` is checked as `javascript:`.
 */
export function safeHref(href: string): string | undefined {
  if (href === INCOMPLETE_LINK) return undefined;

  // eslint-disable-next-line no-control-regex -- control characters are what this removes
  const scheme = /^([a-z][a-z\d+.-]*):/i.exec(href.replace(/[\u0000- \u007f]/g, ""));
  if (!scheme) return href;

  return LINK_PROTOCOLS.has(`${scheme[1].toLowerCase()}:`) ? href : undefined;
}

/** Whether a link leaves the app, so it opens in a new tab. */
export function isExternal(href: string) {
  return /^(https?:)?\/\//i.test(href.trim());
}

/** An allowed image prefix in the normalized form of `URL#href`, or `undefined` if it isn't https. */
export function normalizeImagePrefix(prefix: string): string | undefined {
  try {
    const url = new URL(prefix);
    return url.protocol === "https:" ? url.href : undefined;
  } catch {
    return undefined;
  }
}

/**
 * The image address if it may load: an absolute https URL that starts with one of the normalized
 * prefixes. Comparing normalized addresses keeps `https://cdn.example.com.evil.com` from matching
 * the prefix `https://cdn.example.com`, which normalizes to `https://cdn.example.com/`.
 */
export function allowedImageSrc(src: string, prefixes: readonly string[]): string | undefined {
  if (prefixes.length === 0) return undefined;

  let url: URL;
  try {
    url = new URL(src);
  } catch {
    return undefined;
  }

  if (url.protocol !== "https:") return undefined;
  return prefixes.some((prefix) => url.href.startsWith(prefix)) ? url.href : undefined;
}
