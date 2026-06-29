import { computed, inject, toValue, type WritableComputedRef } from "vue";
import { defaultMeteorI18n, meteorI18nInjectionKey } from "@/i18n/injection";
import { languageOf, localeChain } from "@/i18n/locale";
import { render } from "@/i18n/engine";
import { lookupNested } from "@/i18n/lookup";
import type { MeteorInterpolationValues, MeteorMessages } from "@/i18n/types";

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
   *   1. host adapter (if it returns a non-nullish string)
   *   2. app-wide override registry (`createMeteorI18nPlugin({ messages })`), per locale fallback chain
   *   3. the component's bundled snippet, per locale fallback chain
   *   4. the public key itself
   */
  t: (key: string, values?: MeteorInterpolationValues) => string;
  /** The current resolved language (`"en"`, `"de"`, or whatever the host reports). */
  locale: WritableComputedRef<string>;
}

/**
 * Meteor's translation-solution-agnostic i18n composable.
 */
export function useMeteorI18n(options: UseMeteorI18nOptions = {}): MeteorI18nComposer {
  const instance = inject(meteorI18nInjectionKey, defaultMeteorI18n);
  const { namespace, messages } = options;

  const rawLocale = computed(() =>
    instance.adapter ? toValue(instance.adapter.locale) : instance.fallbackLocale.value,
  );
  const chain = computed(() => localeChain(rawLocale.value));

  function t(key: string, values?: MeteorInterpolationValues): string {
    const publicKey = namespace ? `${namespace}.${key}` : key;

    // 1. Host adapter — a true hit only (the adapter returns nullish on a miss).
    if (instance.adapter) {
      const hosted = instance.adapter.t(publicKey, values);
      if (hosted !== undefined && hosted !== null) return hosted;
    }

    // 2./3. Override registry (public key) then the component's bundled snippet (relative key),
    // walking the locale fallback chain (region -> language -> English).
    for (const loc of chain.value) {
      const override = lookupNested(instance.messages?.[loc], publicKey);
      if (override !== undefined) return render(override, values);

      const bundled = messages ? lookupNested(messages[loc], key) : undefined;
      if (bundled !== undefined) return render(bundled, values);
    }

    // 4. Fall back to the public key itself (keeps `t(key) === key` miss detection working).
    return publicKey;
  }

  const locale = computed<string>({
    get: () => languageOf(rawLocale.value),
    set: (value) => {
      if (!instance.adapter) instance.fallbackLocale.value = value;
    },
  });

  return { t, locale };
}
