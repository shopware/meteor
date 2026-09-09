import { createApp } from "vue";
import { createI18n } from "vue-i18n";
import "@shopware-ag/meteor-component-library/styles.css";
import "@shopware-ag/meteor-component-library/font.css";
import {
  createMeteorI18nPlugin,
  createVueI18nAdapter,
} from "@shopware-ag/meteor-component-library";
import App from "./App.vue";
import { messages } from "./i18n/messages";

const i18n = createI18n({
  legacy: false, // required: the Meteor adapter reads a Composition-mode composer
  locale: "en",
  fallbackLocale: "en",
  messages,
});

const app = createApp(App);

app.use(i18n);
// Meteor follows this app's vue-i18n locale; `mt.*` entries in the catalog override
// Meteor's bundled snippets, everything else falls back to Meteor's bundled en/de.
app.use(createMeteorI18nPlugin({ adapter: createVueI18nAdapter(i18n) }));

app.mount("#app");
