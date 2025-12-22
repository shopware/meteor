import "@testing-library/jest-dom/vitest";
import { config } from "@vue/test-utils";
import { createI18n } from "vue-i18n";

const i18n = createI18n({
  legacy: false,
  locale: "en",
});

// Install i18n plugin onto VueWrapper
// @ts-expect-error - vue-i18n types don't perfectly match Vue's Plugin type but it works at runtime
config.global.plugins = [...(config.global.plugins || []), i18n];

beforeEach(() => {
  vi.stubEnv("TZ", "UTC");
});

afterEach(() => {
  vi.unstubAllEnvs();
});
