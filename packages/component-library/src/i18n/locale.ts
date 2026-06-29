/**
 * The base locales Meteor ships built-in snippets for.
 */
export const SUPPORTED_LOCALES = ["en", "de"] as const;

export type MeteorLocale = (typeof SUPPORTED_LOCALES)[number];

export const DEFAULT_LOCALE: MeteorLocale = "en";

/**
 * The language part of a locale code, lowercased: `"de-DE"` -> `"de"`, `"en_US"` -> `"en"`.
 */
export function languageOf(raw: string | undefined | null): string {
  if (!raw) return DEFAULT_LOCALE;
  return raw.toLowerCase().split(/[-_]/)[0] || DEFAULT_LOCALE;
}

/**
 * Build the locale fallback chain for a raw host locale, most specific first, always ending
 * at the English base. Examples:
 *   "de-DE" -> ["de-DE", "de", "en"]
 *   "en-US" -> ["en-US", "en"]
 *   "de"    -> ["de", "en"]
 *   undefined -> ["en"]
 *
 * Region variants therefore share the language-level default (Meteor bundles `en`/`de`), while
 * region-specific overrides supplied via the plugin registry can still win at the head of the
 * chain.
 */
export function localeChain(raw: string | undefined | null): string[] {
  const chain: string[] = [];
  const push = (value: string) => {
    if (value && !chain.includes(value)) chain.push(value);
  };

  if (raw) push(raw);
  push(languageOf(raw));
  push(DEFAULT_LOCALE);

  return chain;
}
