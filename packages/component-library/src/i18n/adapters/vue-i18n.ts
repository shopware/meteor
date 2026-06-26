import type { Ref } from "vue";
import type { MeteorI18nAdapter } from "../types";

/**
 * Minimal shape of a vue-i18n Composer (Composition mode, `legacy: false`) — the object
 * exposed by `useI18n()`, by `@nuxtjs/i18n`'s `$i18n`, and as `i18n.global`. Duck-typed on
 * purpose so this helper introduces **no** dependency on vue-i18n and works with whatever
 * vue-i18n version the host already uses.
 */
export interface VueI18nComposerLike {
  locale: Ref<string>;
  t: (key: string, named?: Record<string, unknown>) => string;
  te: (key: string) => boolean;
}

/**
 * The object returned by `createI18n(...)`, which nests the composer under `global`.
 */
export interface VueI18nLike {
  global: VueI18nComposerLike;
}

/**
 * Build a Meteor i18n adapter from a host's vue-i18n instance.
 *
 * Accepts either the `createI18n(...)` result (`{ global }`) or a composer directly
 * (`useI18n()` / `@nuxtjs/i18n`'s `$i18n`). Uses `te()` to detect a real hit, so on a miss
 * Meteor falls back to its own bundled snippets instead of vue-i18n returning the key string.
 * The reactive `locale` is taken straight from the composer, so host language switches
 * re-render Meteor components.
 *
 * @example
 * // raw vue-i18n
 * const i18n = createI18n({ legacy: false, ... });
 * app.use(createMeteorI18nPlugin({ adapter: createVueI18nAdapter(i18n) }));
 *
 * @example
 * // @nuxtjs/i18n (composer)
 * vueApp.use(createMeteorI18nPlugin({ adapter: createVueI18nAdapter(nuxtApp.$i18n) }));
 */
export function createVueI18nAdapter(i18n: VueI18nLike | VueI18nComposerLike): MeteorI18nAdapter {
  const composer: VueI18nComposerLike = "global" in i18n ? i18n.global : i18n;

  return {
    locale: composer.locale,
    t: (key, values) =>
      composer.te(key) ? composer.t(key, values as Record<string, unknown>) : undefined,
  };
}
