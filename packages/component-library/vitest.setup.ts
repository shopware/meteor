import "@testing-library/jest-dom/vitest";
import { config } from "@vue/test-utils";
import { createI18n } from "vue-i18n";
import { resetWarnings } from "@/utils/log";

const i18n = createI18n({
  legacy: false,
  locale: "en",
});

// Install a plugin onto VueWrapper
config.global.plugins = [...(config.global.plugins || []), i18n];

// jsdom has no layout, so `checkVisibility()` is missing; without it, tabbable treats every element
// as hidden
Element.prototype.checkVisibility ??= () => true;

beforeEach(() => {
  vi.stubEnv("TZ", "UTC");
});

afterEach(() => {
  vi.unstubAllEnvs();
  // Warnings show once per message, so let each test see them again
  resetWarnings();
});
