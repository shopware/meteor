import { ref, type InjectionKey } from "vue";
import type { MeteorI18nInstance } from "./types";

export const meteorI18nInjectionKey: InjectionKey<MeteorI18nInstance> = Symbol("mt-i18n");

/**
 * Module-level default instance used when no `createMeteorI18nPlugin` was installed.
 *
 * Mirrors the default-instance pattern of `useFutureFlags`, so every component works
 * standalone — rendering Meteor's bundled English snippets — without any host setup.
 */
export const defaultMeteorI18n: MeteorI18nInstance = {
  adapter: undefined,
  fallbackLocale: ref("en"),
};
