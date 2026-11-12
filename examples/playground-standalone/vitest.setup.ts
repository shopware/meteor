import "@testing-library/jest-dom/vitest";
import { afterEach } from "vitest";
import { cleanup } from "@testing-library/vue";
import { config } from "@vue/test-utils";
import { i18n } from "./src/i18n";

// Meteor components call `useI18n()`, so every mounted component gets the app's i18n.
config.global.plugins = [...config.global.plugins, i18n];

// Without Vitest's globals, Testing Library can't unmount after each test on its own.
afterEach(cleanup);
