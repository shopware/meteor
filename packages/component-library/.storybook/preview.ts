import type { Preview } from "@storybook/vue3";
import "~/src/components/assets/scss/all.scss";
import "~/src/components/assets/scss/font.scss";
import { darkTheme, lightTheme } from "./shopwareTheme";
import { setup } from "@storybook/vue3";
import { createI18n } from "vue-i18n";
import DeviceHelperPlugin from "./../src/plugin/device-helper.plugin";
import MtThemeProvider from "../src/components/theme/mt-theme-provider.vue";
import {
  DARK_THEME_BACKGROUND_VALUE,
  LIGHT_THEME_BACKGROUND_VALUE,
  ThemeProvider,
} from "./ThemeProvider";

// importing meteor tokens
import "@shopware-ag/meteor-tokens/administration/light.css";
import "@shopware-ag/meteor-tokens/administration/dark.css";

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
    backgrounds: {
      default: "light",
      values: [
        { name: "light", value: LIGHT_THEME_BACKGROUND_VALUE },
        { name: "dark", value: DARK_THEME_BACKGROUND_VALUE },
      ],
    },
  },
  decorators: [
    ThemeProvider,
    () => ({
      components: { MtThemeProvider },
      template: `
        <mt-theme-provider>
          <story />
        </mt-theme-provider>
      `,
    }),
  ],
};

export default preview;
