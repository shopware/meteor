import { addons } from "@storybook/manager-api";
import { darkTheme, lightTheme } from "./shopwareTheme";

addons.setConfig({
  theme: darkTheme,
});
