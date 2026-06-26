import { ref, type App, type Plugin } from "vue";
import { meteorI18nInjectionKey } from "./injection";
import type { MeteorI18nAdapter, MeteorLocaleMessages } from "./types";

export interface MeteorI18nPluginOptions {
  /**
   * Optional host translation adapter. When omitted, Meteor uses its own bundled
   * English/German snippets.
   */
  adapter?: MeteorI18nAdapter;
  /**
   * Optional overrides / additional languages, keyed by full locale code then by the public
   * `mt.<component>.<key>` snippet key. Resolved before the bundled defaults — use it to override
   * Meteor's wording or add languages it doesn't ship.
   *
   * @example
   * createMeteorI18nPlugin({
   *   messages: {
   *     "en-US": { mt: { pagination: { nextPage: "Next" } } },
   *     fr: { mt: { pagination: { nextPage: "Suivant" } } },
   *   },
   * });
   */
  messages?: MeteorLocaleMessages;
  /**
   * Initial locale, used only when no `adapter` is provided (default `"en"`).
   */
  locale?: string;
}

/**
 * Vue plugin that provides Meteor's i18n service to all components below it.
 *
 * @example
 * // Standalone (uses Meteor's bundled snippets, English by default):
 * app.use(createMeteorI18nPlugin());
 *
 * @example
 * // Connect a host translation solution via an adapter:
 * app.use(createMeteorI18nPlugin({ adapter: createVueI18nAdapter(i18n) }));
 */
export function createMeteorI18nPlugin(options: MeteorI18nPluginOptions = {}): Plugin {
  return {
    install(app: App) {
      app.provide(meteorI18nInjectionKey, {
        adapter: options.adapter,
        messages: options.messages,
        fallbackLocale: ref(options.locale ?? "en"),
      });
    },
  };
}
