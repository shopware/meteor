import type { Preview } from "@storybook/vue3";
import "~/src/components/assets/scss/all.scss";
import { darkTheme, lightTheme } from "./shopwareTheme";
import { setup } from "@storybook/vue3";
import { createI18n } from "vue-i18n";
import DeviceHelperPlugin from "./../src/plugin/device-helper.plugin";

const i18n = createI18n({
  // something vue-i18n options here ...
  globalInjection: true,
  locale: "en",
  fallbackLocale: "en",
  messages: {
    en: {},
    de: {},
  },
  allowComposition: true,
});

setup((app) => {
  app.use(i18n);
  app.use(DeviceHelperPlugin);
});

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
      expanded: true,
      sort: "requiredFirst",
    },
    darkMode: {
      dark: { ...darkTheme },
      light: { ...lightTheme },
    },
  },
};

export default preview;
