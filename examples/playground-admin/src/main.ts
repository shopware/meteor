import { createApp } from "vue";
import { DeviceHelperPlugin } from "@shopware-ag/meteor-component-library";
import "@shopware-ag/meteor-component-library/styles.css";
import "@shopware-ag/meteor-component-library/font.css";
import "./assets/main.css";
import App from "./App.vue";
import { router } from "./router";
import { i18n } from "./i18n";

// DeviceHelperPlugin is required by mt-tabs.
const app = createApp(App).use(i18n).use(router).use(DeviceHelperPlugin);

// Mounting after the first route resolves lets the shell apply the route's regions from the first render.
router.isReady().then(() => app.mount("#app"));
