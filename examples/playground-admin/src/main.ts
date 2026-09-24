import { createApp, watch } from "vue";
import { DeviceHelperPlugin } from "@shopware-ag/meteor-component-library";
import "@shopware-ag/meteor-component-library/styles.css";
import "@shopware-ag/meteor-component-library/font.css";
import "./assets/main.css";
import App from "./App.vue";
import { router } from "./router";
import { i18n } from "./i18n";
import { LOCALE_STORAGE_KEY, settings } from "./store/settings";

watch(
  () => settings.locale,
  (locale) => {
    i18n.global.locale.value = locale;
    document.documentElement.lang = locale;
    localStorage.setItem(LOCALE_STORAGE_KEY, locale);
  },
  { immediate: true },
);

const app = createApp(App).use(i18n).use(router).use(DeviceHelperPlugin);

router.isReady().then(() => app.mount("#app"));
