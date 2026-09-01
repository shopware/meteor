import { ref } from "vue";
import { getLocale, subscribeLocale } from "@shopware-ag/meteor-admin-sdk/es/context";
import type { MeteorI18nAdapter } from "../types";

/**
 * Build a Meteor i18n adapter for an iframe app (or Shopware service) driven by the
 * Admin SDK: the adapter follows the host admin's UI locale via `context.getLocale()` /
 * `context.subscribeLocale()`, while translating stays with Meteor's bundled snippets
 * (plus any `messages` overrides passed to `createMeteorI18nPlugin`).
 *
 * Use this when the app doesn't need its own i18n framework for Meteor's strings — no
 * vue-i18n required. An app that also translates its own strings through vue-i18n should
 * keep using `createVueI18nAdapter` instead and feed the SDK locale into vue-i18n.
 *
 * The factory is async so the initial locale is known BEFORE the app mounts — awaiting it
 * avoids a flash of English while the first `getLocale()` round-trip is in flight.
 *
 * @example
 * const app = createApp(App);
 * app.use(createMeteorI18nPlugin({ adapter: await createAdminSdkAdapter() }));
 * app.mount("#app");
 */
export async function createAdminSdkAdapter(): Promise<MeteorI18nAdapter> {
  const { locale: initialLocale } = await getLocale();
  const locale = ref(initialLocale);

  void subscribeLocale(({ locale: nextLocale }) => {
    locale.value = nextLocale;
  });

  return {
    locale,
    // Always a miss: Meteor's own resolution (override registry -> bundled snippets)
    // does the translating; this adapter only supplies the reactive host locale.
    t: () => undefined,
  };
}
