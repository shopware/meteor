import type { Preview } from "@storybook/vue3";
import "~/src/assets/scss/all.scss";
import "~/src/assets/css/fonts/inter.font.css";
import { setup } from "@storybook/vue3";
import { createI18n } from "vue-i18n";
import DeviceHelperPlugin from "../src/plugin/device-helper.plugin";
import MtThemeProvider from "../src/components/mt-theme-provider/mt-theme-provider.vue";

import { ThemeProvider } from "./ThemeProvider";

// importing meteor tokens
import "@shopware-ag/meteor-tokens/primitives.css";
import "@shopware-ag/meteor-tokens/administration/light.css";
import "@shopware-ag/meteor-tokens/administration/dark.css";

const i18n = createI18n({
  // something vue-i18n options here ...
  legacy: false,
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
  globalTypes: {
    theme: {
      name: "Theme",
      defaultValue: "light",
      toolbar: {
        icon: "contrast",
        dynamicTitle: true,
        items: [
          { value: "light", title: "Light" },
          { value: "dark", title: "Dark" },
        ],
      },
    },
  },
  parameters: {
    options: {
      storySort: {
        order: ["Components", "Directives"],
        method: "alphabetical",
      },
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
      expanded: true,
      sort: "requiredFirst",
    },
    backgrounds: { disable: true },
    docs: {
      codePanel: true,
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

  tags: ["autodocs"],
};

export default preview;
