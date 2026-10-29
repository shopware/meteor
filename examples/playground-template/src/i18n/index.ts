import { watch } from "vue";
import { createI18n } from "vue-i18n";
import { de } from "./de";
import { en } from "./en";

const LOCALE_STORAGE_KEY = "playground-template-locale";
const LOCALES = ["en", "de"];

/** The stored language, else the browser's, else English. Meteor components bring both. */
function initialLocale() {
  const preferred =
    localStorage.getItem(LOCALE_STORAGE_KEY) ?? navigator.language.slice(0, 2);

  return LOCALES.includes(preferred) ? preferred : "en";
}

export const i18n = createI18n({
  legacy: false,
  locale: initialLocale(),
  fallbackLocale: "en",
  messages: { en, de },
});

// Remembers the language and sets it on the document, so screen readers pronounce the page in it.
watch(
  i18n.global.locale,
  (locale) => {
    document.documentElement.lang = locale;
    localStorage.setItem(LOCALE_STORAGE_KEY, locale);
  },
  { immediate: true },
);
