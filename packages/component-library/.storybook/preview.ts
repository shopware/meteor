import type { Preview } from "@storybook/vue3";
import "~/src/components/assets/scss/all.scss";
import "~/src/components/assets/scss/font.scss";
import { setup } from "@storybook/vue3";
import { createApp } from "vue";
import { createI18n } from "vue-i18n";
import DeviceHelperPlugin from "./../src/plugin/device-helper.plugin";
import MtThemeProvider from "../src/components/theme/mt-theme-provider.vue";
import MtSnackbar from "../src/components/feedback-indicator/mt-snackbar/mt-snackbar.vue";
import { useSnackbar } from "../src/components/feedback-indicator/mt-snackbar/composables/use-snackbar";

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

// Mount MtSnackbar lazily on the first meteor-docs:snackbar event so it is available on
// docs-only MDX pages. Deferring the mount means story tests (which never fire this event)
// never get a second MtSnackbar instance alongside the one rendered by the story itself,
// avoiding the double-render that would otherwise cause snackbar counts to be doubled.
document.addEventListener("meteor-docs:snackbar", (e: Event) => {
  if (!document.getElementById("mt-snackbar-root")) {
    const snackbarEl = document.createElement("div");
    snackbarEl.id = "mt-snackbar-root";
    document.body.appendChild(snackbarEl);
    createApp({ components: { MtSnackbar }, template: "<mt-snackbar />" }).mount(snackbarEl);
  }
  const { addSnackbar } = useSnackbar();
  addSnackbar({
    message: (e as CustomEvent<{ message: string }>).detail.message,
    variant: "success",
  });
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
        order: [
          "Introduction",
          "Get Started",
          ["Designers", "Developers", "Migration", "Contributing"],
          "Foundations",
          [
            "Design Principles",
            "Accessibility",
            "Interactions",
            "Tokens",
            ["Overview", "Color Palette", "Elevation", "Spacing", "Border Radius", "Typography"],
            "Content",
            ["Wording", "Messaging", "Glossary", "AI Interaction"],
            "Icons",
            "Components",
          ],
          "Components",
          ["Overview"],
          "Directives",
          "Composables",
        ],
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
