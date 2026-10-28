import type { Preview } from "@storybook/vue3";
import "~/src/assets/css/all.css";
import "~/src/assets/css/fonts/inter.font.css";
import { setup } from "@storybook/vue3";
import { ref } from "vue";
import { createMeteorI18nPlugin } from "../src/i18n/plugin";
import DeviceHelperPlugin from "../src/plugin/device-helper.plugin";
import MtThemeProvider from "../src/components/mt-theme-provider/mt-theme-provider.vue";

import { ThemeProvider } from "./ThemeProvider";

// importing meteor tokens
import "@shopware-ag/meteor-tokens/primitives.css";
import "@shopware-ag/meteor-tokens/administration/light.css";
import "@shopware-ag/meteor-tokens/administration/dark.css";

// Drive Meteor's locale from the Storybook toolbar; translations come from Meteor's own
// bundled en/de snippets.
const storybookLocale = ref("en");

setup((app) => {
  app.use(createMeteorI18nPlugin({ locale: storybookLocale }));
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
    locale: {
      name: "Locale",
      defaultValue: "en",
      toolbar: {
        icon: "globe",
        dynamicTitle: true,
        items: [
          { value: "en", title: "English" },
          { value: "de", title: "Deutsch" },
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
    (story, context) => {
      storybookLocale.value = context.globals.locale ?? "en";
      return {
        components: { MtThemeProvider },
        template: `
          <mt-theme-provider>
            <story />
          </mt-theme-provider>
        `,
      };
    },
  ],

  tags: ["autodocs"],
};

export default preview;
