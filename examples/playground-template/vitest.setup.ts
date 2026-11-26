import "@testing-library/jest-dom/vitest";
import { config } from "@vue/test-utils";
import { i18n } from "./src/i18n";

// Meteor components call `useI18n()`, so every mounted component gets the app's i18n.
config.global.plugins = [...config.global.plugins, i18n];
