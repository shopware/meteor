import { toValue, type Ref } from "vue";
import type { MeteorI18nAdapter } from "../types";

/**
 * Minimal shape of a vue-i18n Composer (Composition mode, `legacy: false`) — the object
 * exposed by `useI18n()`, by `@nuxtjs/i18n`'s `$i18n`, and as `i18n.global`. Duck-typed on
 * purpose so this helper introduces **no** dependency on vue-i18n and works with whatever
 * vue-i18n version the host already uses.
 */
export interface VueI18nComposerLike {
  locale: Ref<string>;
  /**
   * vue-i18n's `fallbackLocale`. Only the string form (and the first entry of the array
   * form) is consulted; the locale-map form is ignored.
   */
  fallbackLocale?: Ref<unknown>;
  t: (key: string, named?: Record<string, unknown>, options?: { locale?: string }) => string;
  te: (key: string, locale?: string) => boolean;
}

/**
 * The object returned by `createI18n(...)`, which nests the composer under `global`.
 */
export interface VueI18nLike {
  global: VueI18nComposerLike;
}

export interface VueI18nAdapterOptions {
  /**
   * Also probe the pre-6.0 key names on a miss: `mt.<component>.<rest>` retries as
   * `mt-<component>.<rest>`. Lets hosts (e.g. the Shopware Admin) keep serving snippet
   * overrides and language-pack entries that still use the old global-scope key names
   * (`mt-field-error.*`, `mt-text-editor*.*`, `mt-action-menu-item.*`) without any change
   * on their side. A development-mode warning marks each legacy hit so the entries can be
   * migrated to the `mt.*` names on their own schedule.
   */
  legacyKeys?: boolean;
}

const warnedLegacyKeys = new Set<string>();

/**
 * Build a Meteor i18n adapter from a host's vue-i18n instance.
 *
 * Accepts either the `createI18n(...)` result (`{ global }`) or a composer directly
 * (`useI18n()` / `@nuxtjs/i18n`'s `$i18n`). Uses `te()` to detect a real hit, so on a miss
 * Meteor falls back to its own bundled snippets instead of vue-i18n returning the key string.
 * The reactive `locale` is taken straight from the composer, so host language switches
 * re-render Meteor components.
 *
 * Because `te()` only checks the *active* locale on vue-i18n v9/v10 (v11 walks the fallback
 * chain), a miss is re-probed against the composer's primary `fallbackLocale` — otherwise a
 * host key that exists only in the fallback catalog (e.g. only `en-GB` snippets on a `de-DE`
 * UI) would silently lose to Meteor's bundled snippets.
 *
 * @example
 * // raw vue-i18n
 * const i18n = createI18n({ legacy: false, ... });
 * app.use(createMeteorI18nPlugin({ adapter: createVueI18nAdapter(i18n) }));
 *
 * @example
 * // @nuxtjs/i18n (composer)
 * vueApp.use(createMeteorI18nPlugin({ adapter: createVueI18nAdapter(nuxtApp.$i18n) }));
 *
 * @example
 * // Shopware Admin: keep resolving pre-6.0 snippet key names from plugins/language packs
 * app.use(createMeteorI18nPlugin({ adapter: createVueI18nAdapter(i18n, { legacyKeys: true }) }));
 */
export function createVueI18nAdapter(
  i18n: VueI18nLike | VueI18nComposerLike,
  options: VueI18nAdapterOptions = {},
): MeteorI18nAdapter {
  const composer: VueI18nComposerLike = "global" in i18n ? i18n.global : i18n;

  const primaryFallbackLocale = (): string | undefined => {
    const fallback = composer.fallbackLocale ? toValue(composer.fallbackLocale) : undefined;
    if (typeof fallback === "string") return fallback;
    if (Array.isArray(fallback) && typeof fallback[0] === "string") return fallback[0];
    return undefined;
  };

  const probe = (key: string, named?: Record<string, unknown>): string | undefined => {
    if (composer.te(key)) return composer.t(key, named ?? {});

    const fallback = primaryFallbackLocale();
    // The `{ locale }` object form is required: a positional string third argument would
    // bind vue-i18n's `t(key, defaultMsg)` overload instead.
    if (fallback && fallback !== toValue(composer.locale) && composer.te(key, fallback)) {
      return composer.t(key, named ?? {}, { locale: fallback });
    }

    return undefined;
  };

  return {
    locale: composer.locale,
    t: (key, values) => {
      const named = values as Record<string, unknown> | undefined;

      const hit = probe(key, named);
      if (hit !== undefined) return hit;

      if (options.legacyKeys && key.startsWith("mt.")) {
        const legacyHit = probe(`mt-${key.slice(3)}`, named);
        if (legacyHit !== undefined) {
          if (process?.env?.NODE_ENV !== "production" && !warnedLegacyKeys.has(key)) {
            warnedLegacyKeys.add(key);
            console.warn(
              `[meteor-i18n] "${key}" resolved through its deprecated key name "mt-${key.slice(3)}". ` +
                `Rename the snippet entry to "${key}".`,
            );
          }
          return legacyHit;
        }
      }

      return undefined;
    },
  };
}
