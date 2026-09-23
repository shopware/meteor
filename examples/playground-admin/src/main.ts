import { createApp, watch } from "vue";
import { DeviceHelperPlugin } from "@shopware-ag/meteor-component-library";
import "@shopware-ag/meteor-component-library/styles.css";
import "@shopware-ag/meteor-component-library/font.css";
import "./assets/main.css";
import App from "./App.vue";
import { router } from "./router";
import { i18n } from "./i18n";
import { LOCALE_STORAGE_KEY, settings } from "./store/settings";

// the host owns the i18n instance; Meteor components pick the locale up from it
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

// mount after the first route resolved, so the shell renders its final regions right away
router.isReady().then(() => app.mount("#app"));
