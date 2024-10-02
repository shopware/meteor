import { provide, inject } from "vue";

function get(obj: Record<string, unknown>, path: string) {
  if (typeof obj !== "object" || obj === null) return undefined;

  const keys = path.split(".");
  let result = obj;

  for (const key of keys) {
    if (result === undefined || result === null) return undefined;

    // @ts-ignore
    result = result[key];
  }

  return result;
}

interface TranslationDictionary {
  [key: string]: string | TranslationDictionary;
}

type Options = { messages: TranslationDictionary };

const defaultI18nState = {
  locale: "en",
  defaultLocale: "en",
};

const i18nInjectionKey = Symbol("mt-i18n");

export function provideI18n(locale: string = "en") {
  const state = {
    ...defaultI18nState,
    locale: locale,
  };

  provide(i18nInjectionKey, state);
}

export function useI18n({ messages }: Options) {
  const i18n = inject(i18nInjectionKey, defaultI18nState);

  function translate(path: string): string {
    const translation = get(messages, `${i18n.locale}.${path}`);
    if (translation) return translation.toString();

    const fallback = get(messages, `${i18n.defaultLocale}.${path}`);
    return fallback ? fallback.toString() : path;
  }

  return { t: translate };
}
