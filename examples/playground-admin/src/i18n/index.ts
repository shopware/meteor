import { createI18n } from "vue-i18n";
import { settings } from "../store/settings";
import { de } from "./de";
import { en } from "./en";

export const i18n = createI18n({
  legacy: false,
  locale: settings.locale,
  fallbackLocale: "en",
  messages: { en, de },
});
