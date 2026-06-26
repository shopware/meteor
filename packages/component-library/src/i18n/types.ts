import type { Ref, ComputedRef } from "vue";

/**
 * Values for named interpolation inside a snippet, e.g. `t("foo", { count: 3 })`.
 * The keys `n` and `count` additionally drive pluralization (see `engine.ts`).
 */
export type MeteorInterpolationValues = Record<string, string | number | boolean>;

/**
 * A (possibly nested) tree of message strings for a single locale.
 */
export interface MeteorMessageTree {
  [key: string]: string | MeteorMessageTree;
}

/**
 * A component's bundled locale catalog: locale code -> messages.
 * `en` is required because it is the guaranteed base fallback locale.
 */
export interface MeteorMessages {
  en: MeteorMessageTree;
  de?: MeteorMessageTree;
  [locale: string]: MeteorMessageTree | undefined;
}

/**
 * App-wide override / additional-language messages: any set of locale codes -> messages.
 * Unlike {@link MeteorMessages}, no locale is required (a consumer may supply only `en-US`,
 * only `fr`, etc.).
 */
export type MeteorLocaleMessages = Record<string, MeteorMessageTree | undefined>;

/**
 * Optional adapter the host application can provide to connect its own translation
 * solution (vue-i18n, i18next, the Shopware Admin SDK, ...).
 *
 * Contract:
 * - `locale` is a reactive source of the host's current locale (e.g. `"en-GB"`).
 *   It may be a `Ref`, `ComputedRef` or a getter function. Meteor normalizes it down
 *   to one of its supported base locales (`"en-GB"` -> `"en"`, `"de-DE"` -> `"de"`).
 * - `t` returns the translated string on a HIT and `undefined`/`null` on a MISS.
 *   It MUST return a nullish value (never the key itself) when it has no translation,
 *   so Meteor can fall back to its own bundled snippets. A vue-i18n host implements
 *   this as `te(key) ? t(key, values) : undefined`.
 */
export interface MeteorI18nAdapter {
  locale: Ref<string> | ComputedRef<string> | (() => string);
  t: (key: string, values?: MeteorInterpolationValues) => string | undefined | null;
}

/**
 * The i18n service instance provided through Vue dependency injection (either by
 * `createMeteorI18nPlugin` or the module-level default).
 */
export interface MeteorI18nInstance {
  /** Optional host translation adapter. */
  adapter?: MeteorI18nAdapter;
  /**
   * App-wide overrides / additional languages, keyed by full locale code (e.g. `en-GB`, `de`,
   * `fr`) then by the public `mt.<component>.<key>` snippet key. Resolved before the components'
   * bundled defaults, so a consumer (or a plugin via the host) can override any Meteor snippet
   * and add languages without touching Meteor internals.
   */
  messages?: MeteorLocaleMessages;
  /** Locale source used only when no adapter is provided. */
  fallbackLocale: Ref<string>;
}
