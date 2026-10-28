import { computed, hasInjectionContext, inject, toValue, type ComputedRef } from "vue";
import { defaultMeteorI18n, meteorI18nInjectionKey } from "@/i18n/injection";
import { DEFAULT_LOCALE, languageOf, localeChain } from "@/i18n/locale";
import { render } from "@/i18n/engine";
import { lookupNested } from "@/i18n/lookup";
import type { MeteorInterpolationValues, MeteorMessages } from "@/i18n/types";

// Intl.NumberFormat construction is expensive; one formatter per locale, shared by all
// composable instances.
const numberFormatters = new Map<string, Intl.NumberFormat>();

function numberFormatterFor(locale: string): Intl.NumberFormat {
  let formatter = numberFormatters.get(locale);

  if (!formatter) {
    try {
      formatter = new Intl.NumberFormat(locale);
    } catch {
      // The host reported an invalid locale tag: format with the runtime default instead.
      formatter = new Intl.NumberFormat();
    }
    numberFormatters.set(locale, formatter);
  }

  return formatter;
}

export interface UseMeteorI18nOptions {
  /**
   * Public namespace for this component's snippets, e.g. `"mt.pagination"`. When set, the keys
   * passed to `t()` are relative to it: a `t("nextPage")` resolves the public key
   * `"mt.pagination.nextPage"` against the host/overrides, and the short key `"nextPage"` against
   * the component's own bundled `messages`. Omit it for components that address fully-qualified
   * keys directly (e.g. host passthrough like `global.error-codes.*`).
   */
  namespace?: string;
  /**
   * Component-local bundled snippets, keyed by locale. With a `namespace`, these use the short
   * (relative) keys; without one, they use fully-qualified keys.
   */
  messages?: MeteorMessages;
}

export interface MeteorI18nComposer {
  /**
   * Translate a snippet key (relative to `namespace` if one was given).
   *
   * Resolution order for the resulting public key:
   *   1. host adapter, in the active locale only
   *   2. app-wide override registry (`createMeteorI18nPlugin({ messages })`), then the
   *      component's bundled snippet, for the active language (e.g. `de-DE` -> `de`)
   *   3. host adapter, including its fallback locale
   *   4. override registry, then bundled snippet, in English
   *   5. the public key itself
   */
  t: (key: string, values?: MeteorInterpolationValues) => string;
  /**
   * Like {@link t}, but returns `undefined` on a full miss instead of the public key;
   * use it to probe keys (`ti(key) ?? fallback`) instead of comparing `t(key) === key`.
   */
  ti: (key: string, values?: MeteorInterpolationValues) => string | undefined;
  /**
   * Format a number per the current locale: the host adapter's `n` when it provides one,
   * otherwise `Intl.NumberFormat` with the adapter's (or fallback) locale.
   */
  n: (value: number) => string;
  /**
   * The current language (`"en"`, `"de"`, or whatever the host reports). Read-only: change
   * the language through the host adapter or the plugin's `locale` option.
   */
  locale: ComputedRef<string>;
}

/**
 * Meteor's translation-solution-agnostic i18n composable.
 */
export function useMeteorI18n(options: UseMeteorI18nOptions = {}): MeteorI18nComposer {
  if (!hasInjectionContext()) {
    throw new Error("[meteor-i18n] useMeteorI18n() must be called inside a component's setup().");
  }

  const instance = inject(meteorI18nInjectionKey, defaultMeteorI18n);
  const { namespace, messages } = options;

  const rawLocale = computed(() =>
    instance.adapter ? toValue(instance.adapter.locale) : toValue(instance.locale),
  );
  const chain = computed(() => localeChain(rawLocale.value));

  function publicKeyOf(key: string): string {
    return namespace ? `${namespace}.${key}` : key;
  }

  // The override registry (public key) wins over the component's bundled snippet (short key).
  function ownSnippet(loc: string, key: string, publicKey: string): string | undefined {
    return lookupNested(instance.messages?.[loc], publicKey) ?? lookupNested(messages?.[loc], key);
  }

  function resolve(key: string, values?: MeteorInterpolationValues): string | undefined {
    const publicKey = publicKeyOf(key);
    const adapter = instance.adapter;
    // The adapter returns nullish on a miss.
    const hosted = (locale?: string) => adapter?.t(publicKey, values, { locale }) ?? undefined;

    // The same order vue-i18n walks one merged catalog in: the host and Meteor in the
    // active language first, then the host's fallback language, then Meteor's English.
    const hit = hosted(rawLocale.value);
    if (hit !== undefined) return hit;

    const languageChain = chain.value.filter((loc) => loc !== DEFAULT_LOCALE);
    for (const loc of languageChain) {
      const own = ownSnippet(loc, key, publicKey);
      if (own !== undefined) return render(own, values);
    }

    const fallbackHit = hosted();
    if (fallbackHit !== undefined) return fallbackHit;

    const english = ownSnippet(DEFAULT_LOCALE, key, publicKey);
    return english !== undefined ? render(english, values) : undefined;
  }

  function t(key: string, values?: MeteorInterpolationValues): string {
    // Fall back to the public key itself (keeps `t(key) === key` miss detection working).
    return resolve(key, values) ?? publicKeyOf(key);
  }

  function ti(key: string, values?: MeteorInterpolationValues): string | undefined {
    return resolve(key, values);
  }

  function n(value: number): string {
    const hostN = instance.adapter?.n;
    if (hostN) return hostN(value);

    return numberFormatterFor(rawLocale.value).format(value);
  }

  const locale = computed(() => languageOf(rawLocale.value));

  return { t, ti, n, locale };
}
