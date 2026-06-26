import "@testing-library/jest-dom/vitest";

// No global i18n plugin is installed: components fall back to Meteor's default i18n
// instance, rendering the bundled English snippets — the same path a zero-config consumer
// hits. Specs that need a host adapter (or German) provide their own plugin via
// `withMeteorI18n` from "@/testing/i18n".

beforeEach(() => {
  vi.stubEnv("TZ", "UTC");
});

afterEach(() => {
  vi.unstubAllEnvs();
});
