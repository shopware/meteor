import { isRef, toValue, type Ref } from "vue";
import type { MeteorI18nAdapter } from "../types";

/**
 * Minimal shape of a vue-i18n Composer (Composition mode, `legacy: false`) — the object
 * exposed as `i18n.global`, by a root-scope `useI18n()`, and by `@nuxtjs/i18n`'s `$i18n`.
 * Duck-typed on purpose so this helper introduces **no** dependency on vue-i18n and works
 * with whatever vue-i18n version the host already uses.
 *
 * Pass the GLOBAL composer only: a component-local composer (`useI18n({ messages })` /
 * `useScope: 'local'`) is disposed when its component unmounts, which would leave the
 * adapter holding a dead composer.
 */
export interface VueI18nComposerLike {
  locale: Ref<string>;
  /**
   * vue-i18n's `fallbackLocale`. Only the string form (and the first entry of the array
   * form) is consulted; the locale-map form is ignored. Consequence on vue-i18n < 11.3.0:
   * a key that exists only deeper in a multi-level fallback chain is not seen by the
   * existence check, so such an override silently falls through to Meteor's bundled
   * snippet.
   */
  fallbackLocale?: Ref<unknown>;
  // Deliberately method syntax (not property-function syntax): methods are checked
  // bivariantly, so vue-i18n instances with strongly-typed locales/keys (the generics
  // createI18n infers from `messages`) stay assignable to this duck type.
  t(key: string, named?: Record<string, unknown>, options?: { locale?: string }): string;
  te(key: string, locale?: string): boolean;
  /** vue-i18n's number formatter; passed through to Meteor's `n()` when present. */
  n?(value: number): string;
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
  /**
   * Skip the `te()` existence check and detect misses by key equality instead: call `t()`
   * directly and treat a result identical to the key as a miss.
   *
   * Use this when your translations are not statically visible to `te()`:
   * - catalogs registered as FLAT dotted keys on vue-i18n < 11.3.0 without `flatJson`
   *   (its `te()` misses dotted keys there — intlify/vue-i18n#2375), or
   * - translations served at runtime through vue-i18n's `missing` handler
   *   (backend-driven catalogs), which `te()` never consults.
   *
   * Costs: every miss walks vue-i18n's full fallback chain and emits its missing-key
   * warnings, and a translation whose text literally equals its own key reads as a miss.
   */
  skipExistenceCheck?: boolean;
}

const warnedLegacyKeys = new Set<string>();

function isDev(): boolean {
  return process?.env?.NODE_ENV !== "production";
}

/**
 * Build a Meteor i18n adapter from a host's vue-i18n instance.
 *
 * Accepts the `createI18n(...)` result (`{ global }`) or the global composer directly.
 * Uses `te()` to detect a real hit, so on a miss Meteor falls back to its own bundled
 * snippets instead of vue-i18n returning the key string. The reactive `locale` is taken
 * straight from the composer, so host language switches re-render Meteor components —
 * which is why Composition mode (`legacy: false`) is required: a Legacy-mode instance
 * exposes `locale` as a plain string and Meteor's language would silently freeze.
 *
 * Because `te()` only checks the *active* locale on vue-i18n < 11.3.0 (11.3.0+ walks the
 * fallback chain), a miss is re-probed against the composer's primary `fallbackLocale` —
 * otherwise a host key that exists only in the fallback catalog (e.g. only `en-GB`
 * snippets on a `de-DE` UI) would silently lose to Meteor's bundled snippets.
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

  if (isDev() && !isRef(composer.locale)) {
    console.warn(
      "[meteor-i18n] createVueI18nAdapter needs a Composition-mode composer " +
        "(createI18n({ legacy: false })). A Legacy-mode VueI18n instance exposes `locale` " +
        "as a plain string, so Meteor's language would freeze at its initial value.",
    );
  }

  const primaryFallbackLocale = (): string | undefined => {
    const fallback = composer.fallbackLocale ? toValue(composer.fallbackLocale) : undefined;
    if (typeof fallback === "string") return fallback;
    if (Array.isArray(fallback) && typeof fallback[0] === "string") return fallback[0];
    return undefined;
  };

  // Since vue-i18n 11.3.0, message-compiler errors always throw — at t() time, i.e.
  // inside the calling component's render. A host override containing an unescaped
  // special character (`{ } @ $ |`) must degrade to Meteor's bundled snippet instead of
  // crashing the component.
  const translate = (
    key: string,
    named: Record<string, unknown>,
    options?: { locale?: string },
  ): string | undefined => {
    try {
      return composer.t(key, named, options);
    } catch (error) {
      if (isDev()) {
        console.warn(
          `[meteor-i18n] The host translation for "${key}" could not be compiled ` +
            "(vue-i18n message syntax — special characters like { } @ $ | need escaping " +
            "in vue-i18n catalogs). Falling back to Meteor's bundled snippet.",
          error,
        );
      }
      return undefined;
    }
  };

  const probe = (key: string, values?: Record<string, unknown>): string | undefined => {
    // Cloned because vue-i18n's `escapeParameter` mutates the named object in place.
    const named = { ...values };

    if (options.skipExistenceCheck) {
      const result = translate(key, named);
      // vue-i18n returns the key itself when it has no translation anywhere.
      return result === key ? undefined : result;
    }

    if (composer.te(key)) return translate(key, named);

    const fallback = primaryFallbackLocale();
    // The `{ locale }` object form is required: a positional string third argument would
    // bind vue-i18n's `t(key, defaultMsg)` overload instead.
    if (fallback && fallback !== toValue(composer.locale) && composer.te(key, fallback)) {
      return translate(key, named, { locale: fallback });
    }

    return undefined;
  };

  return {
    locale: composer.locale,
    // Wrapped rather than passed by reference: vue-i18n's `n` has overloads and relies on
    // its `this` binding.
    ...(composer.n ? { n: (value: number) => composer.n!(value) } : {}),
    t: (key, values) => {
      const named = values as Record<string, unknown> | undefined;

      const hit = probe(key, named);
      if (hit !== undefined) return hit;

      if (options.legacyKeys && key.startsWith("mt.")) {
        const legacyHit = probe(`mt-${key.slice(3)}`, named);
        if (legacyHit !== undefined) {
          if (isDev() && !warnedLegacyKeys.has(key)) {
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
