import { createApp, ref } from "vue";
import { context } from "@shopware-ag/meteor-admin-sdk";
import "@shopware-ag/meteor-component-library/styles.css";
import "@shopware-ag/meteor-component-library/font.css";
import { createMeteorI18nPlugin } from "@shopware-ag/meteor-component-library";
import App from "./App.vue";

// This app has no translations of its own, so it needs no i18n framework. All it has
// to do is tell Meteor which language the host admin is on; the Admin SDK is the only
// place that answer can come from inside an iframe.

// Await the initial locale BEFORE mounting; a .then() wiring would flash English.
const { locale: initialLocale } = await context.getLocale();
const locale = ref(initialLocale);

// Keep following the admin's language switches.
void context.subscribeLocale(({ locale: nextLocale }) => {
  locale.value = nextLocale;
});

const app = createApp(App);

// Meteor renders its own bundled en/de texts in the admin's language. When your app
// grows its own texts, hand this same `locale` ref to vue-i18n and switch to
// `createVueI18nAdapter`. Nothing gets thrown away.
app.use(createMeteorI18nPlugin({ locale }));

app.mount("#app");
