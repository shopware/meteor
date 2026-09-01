import { createApp } from "vue";
import "@shopware-ag/meteor-component-library/styles.css";
import "@shopware-ag/meteor-component-library/font.css";
import {
  createMeteorI18nPlugin,
  createAdminSdkAdapter,
} from "@shopware-ag/meteor-component-library";
import App from "./App.vue";

// This app has no translations of its own, so it needs no i18n framework.
// The Admin SDK adapter carries the host admin's language to Meteor's components:
// it awaits the initial locale (no language flash on load) and subscribes to
// changes, so switching the admin language re-renders the components below.
const app = createApp(App);

app.use(createMeteorI18nPlugin({ adapter: await createAdminSdkAdapter() }));

app.mount("#app");
