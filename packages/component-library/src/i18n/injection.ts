import type { InjectionKey } from "vue";
import type { MeteorI18nInstance } from "./types";

// Symbol.for: a registry-wide key, so a second copy of Meteor in the same app (e.g. an
// Admin plugin that bundles its own copy) finds the plugin installed by the host's copy.
export const meteorI18nInjectionKey: InjectionKey<MeteorI18nInstance> = Symbol.for(
  "@shopware-ag/meteor-component-library:i18n",
);

/**
 * Module-level default instance used when no `createMeteorI18nPlugin` was installed.
 *
 * Mirrors the default-instance pattern of `useFutureFlags`, so every component works
 * standalone — rendering Meteor's bundled English snippets — without any host setup.
 * It holds no mutable state, so it is safe to share between apps and SSR requests.
 */
export const defaultMeteorI18n: MeteorI18nInstance = {
  adapter: undefined,
  locale: "en",
};
