import { createI18n } from "vue-i18n";
import {
  createMeteorI18nPlugin,
  createVueI18nAdapter,
} from "@shopware-ag/meteor-component-library";

export default defineNuxtPlugin(({ vueApp }) => {
  const i18n = createI18n({
    legacy: false,
    globalInjection: true,
    locale: "en",
  });

  vueApp.use(i18n);

  // Let Meteor's components follow this app's vue-i18n locale, plus a region-specific
  // override used by the i18n integration test: only `en-GB` customizes the pagination
  // info text. `en` / `en-US` / `de` fall back through the locale chain to Meteor's
  // bundled snippets, and non-overridden keys (e.g. `mt.pagination.firstPage`) still
  // fall back to the bundled `en` text even at `en-GB`.
  vueApp.use(
    createMeteorI18nPlugin({
      adapter: createVueI18nAdapter(i18n),
      messages: {
        "en-GB": {
          mt: {
            pagination: {
              infoText: "GB override: {start}-{end} of {totalItems}",
            },
          },
        },
      },
    }),
  );
});
