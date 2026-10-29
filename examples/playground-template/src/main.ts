import { createApp } from "vue";
import { DeviceHelperPlugin } from "@shopware-ag/meteor-component-library";
import "@shopware-ag/meteor-component-library/styles.css";
import "@shopware-ag/meteor-component-library/font.css";
import App from "./App.vue";
import { i18n } from "./i18n";
import { router } from "./router";

// After a deploy, the chunks of the previous build are gone. Reloading loads the new build.
window.addEventListener("vite:preloadError", () => window.location.reload());

// Some Meteor components, such as mt-tabs, need the DeviceHelperPlugin.
const app = createApp(App).use(i18n).use(router).use(DeviceHelperPlugin);

// Mounting after the first route resolves lets the shell apply the route's regions from the first render.
router.isReady().then(() => app.mount("#app"));
