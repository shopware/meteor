import { provide, inject } from "vue";

function get(obj: Record<string, unknown>, path: string): string | undefined {
  if (typeof obj !== "object" || obj === null) return undefined;

  const keys = path.split(".");
  let result = obj;

  for (const key of keys) {
    if (result === undefined || result === null) return undefined;

    // @ts-ignore
    result = result[key];
  }

  // @ts-ignore
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

function limit(value: number, max: number) {
  return Math.min(value, max);
}

export function provideI18n(locale: string = "en") {
  const state = {
    ...defaultI18nState,
    locale: locale,
  };

  provide(i18nInjectionKey, state);
}

const CUSTOM_VALUE_REGEX = /{([^}]*)}/g;

export function useI18n({ messages }: Options) {
  const i18n = inject(i18nInjectionKey, defaultI18nState);

  function translate(path: string, customValues: Record<string, string | number> = {}): string {
    function resolveCustomKeys(translation: string) {
      return translation.replace(CUSTOM_VALUE_REGEX, (match: string, key: string) => {
        return Object.prototype.hasOwnProperty.call(customValues, key)
          ? customValues[key].toString()
          : match;
      });
    }

    const translation =
      get(messages, `${i18n.locale}.${path}`) || get(messages, `${i18n.defaultLocale}.${path}`);

    if (!translation) return path;

    const canBePluralized = /\|/.test(translation);
    if (canBePluralized) {
      if (typeof customValues.n !== "number")
        throw new Error('The "n" key is required for pluralization');

      const versions = translation.split("|");

      // "no apple | apple | apples"; The first version is the zero form
      const includesZeroForm = versions.length === 3;

      const index = limit(includesZeroForm ? customValues.n : customValues.n - 1, 2);
      const resolvedTranslation = versions.at(index);
      if (!resolvedTranslation) return path;

      return resolveCustomKeys(resolvedTranslation);
    }

    return resolveCustomKeys(translation);
  }

  return { t: translate };
}
