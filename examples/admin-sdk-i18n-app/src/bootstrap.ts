import { createApp, ref } from "vue";
import { context } from "@shopware-ag/meteor-admin-sdk";
import "@shopware-ag/meteor-component-library/styles.css";
import "@shopware-ag/meteor-component-library/font.css";
import { createMeteorI18nPlugin } from "@shopware-ag/meteor-component-library";
import App from "./App.vue";

// This app has no translations of its own, so it needs no i18n framework. All it has
// to do is tell Meteor which language the host admin is on — the Admin SDK is the only
// place that answer can come from inside an iframe.

// Await the initial locale BEFORE mounting — a .then() wiring would flash English.
const { locale: initialLocale } = await context.getLocale();
const locale = ref(initialLocale);

// Keep following the admin's language switches.
void context.subscribeLocale(({ locale: nextLocale }) => {
  locale.value = nextLocale;
});

const app = createApp(App);

app.use(
  createMeteorI18nPlugin({
    adapter: {
      locale,
      // Never translates anything itself (always returns undefined), so Meteor falls
      // back to its own bundled en/de texts — this adapter only tells Meteor which
      // language the admin is on. When your app grows its own texts, keep this
      // `locale` ref and hand it to vue-i18n (then switch to `createVueI18nAdapter`)
      // or to your own small dictionary — nothing gets thrown away.
      t: () => undefined,
    },
  }),
);

app.mount("#app");
