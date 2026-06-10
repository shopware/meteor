import { addons } from "@storybook/manager-api";
import { shopwareTheme } from "./shopwareTheme";

addons.setConfig({
  theme: shopwareTheme,
  sidebar: {
    collapsedRoots: ["composables", "directives"],
  },
});
