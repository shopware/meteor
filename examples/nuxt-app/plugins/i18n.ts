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

  // Let Meteor's components follow this app's vue-i18n locale and snippet overrides.
  vueApp.use(createMeteorI18nPlugin({ adapter: createVueI18nAdapter(i18n) }));
});
