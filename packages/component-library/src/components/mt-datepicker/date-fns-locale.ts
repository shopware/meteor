import type { Locale } from "date-fns";

type DateFnsLocaleModule = {
  default?: unknown;
  [key: string]: unknown;
};

function isDateFnsLocale(value: unknown): value is Locale {
  return typeof value === "object" && value !== null && "localize" in value;
}

export function resolveDateFnsLocaleModule(
  path: string,
  localeModule: DateFnsLocaleModule,
): Locale | null {
  const localeName = path.replace(/-/g, "");
  const defaultExport = localeModule.default;

  const candidates = [
    localeModule[localeName],
    typeof defaultExport === "object" && defaultExport !== null
      ? (defaultExport as DateFnsLocaleModule)[localeName]
      : undefined,
    typeof defaultExport === "object" && defaultExport !== null
      ? (defaultExport as DateFnsLocaleModule).default
      : undefined,
    defaultExport,
    localeModule,
  ];

  return candidates.find(isDateFnsLocale) ?? null;
}

// Every loader uses a literal import specifier on purpose. A specifier
// constructed at runtime (e.g. `import(`date-fns/locale/${path}`)`) cannot be
// statically analyzed by bundlers, so the import rejects in production builds
// and the datepicker silently falls back to enUS. Keys are lowercase BCP 47
// tags of the locales shipped by date-fns v4; lookup is case-insensitive.
const localeLoaders: Record<string, () => Promise<unknown>> = {
  af: () => import("date-fns/locale/af"),
  ar: () => import("date-fns/locale/ar"),
  "ar-dz": () => import("date-fns/locale/ar-DZ"),
  "ar-eg": () => import("date-fns/locale/ar-EG"),
  "ar-ma": () => import("date-fns/locale/ar-MA"),
  "ar-sa": () => import("date-fns/locale/ar-SA"),
  "ar-tn": () => import("date-fns/locale/ar-TN"),
  az: () => import("date-fns/locale/az"),
  be: () => import("date-fns/locale/be"),
  "be-tarask": () => import("date-fns/locale/be-tarask"),
  bg: () => import("date-fns/locale/bg"),
  bn: () => import("date-fns/locale/bn"),
  bs: () => import("date-fns/locale/bs"),
  ca: () => import("date-fns/locale/ca"),
  ckb: () => import("date-fns/locale/ckb"),
  cs: () => import("date-fns/locale/cs"),
  cy: () => import("date-fns/locale/cy"),
  da: () => import("date-fns/locale/da"),
  de: () => import("date-fns/locale/de"),
  "de-at": () => import("date-fns/locale/de-AT"),
  el: () => import("date-fns/locale/el"),
  "en-au": () => import("date-fns/locale/en-AU"),
  "en-ca": () => import("date-fns/locale/en-CA"),
  "en-gb": () => import("date-fns/locale/en-GB"),
  "en-ie": () => import("date-fns/locale/en-IE"),
  "en-in": () => import("date-fns/locale/en-IN"),
  "en-nz": () => import("date-fns/locale/en-NZ"),
  "en-us": () => import("date-fns/locale/en-US"),
  "en-za": () => import("date-fns/locale/en-ZA"),
  eo: () => import("date-fns/locale/eo"),
  es: () => import("date-fns/locale/es"),
  et: () => import("date-fns/locale/et"),
  eu: () => import("date-fns/locale/eu"),
  "fa-ir": () => import("date-fns/locale/fa-IR"),
  fi: () => import("date-fns/locale/fi"),
  fr: () => import("date-fns/locale/fr"),
  "fr-ca": () => import("date-fns/locale/fr-CA"),
  "fr-ch": () => import("date-fns/locale/fr-CH"),
  fy: () => import("date-fns/locale/fy"),
  gd: () => import("date-fns/locale/gd"),
  gl: () => import("date-fns/locale/gl"),
  gu: () => import("date-fns/locale/gu"),
  he: () => import("date-fns/locale/he"),
  hi: () => import("date-fns/locale/hi"),
  hr: () => import("date-fns/locale/hr"),
  ht: () => import("date-fns/locale/ht"),
  hu: () => import("date-fns/locale/hu"),
  hy: () => import("date-fns/locale/hy"),
  id: () => import("date-fns/locale/id"),
  is: () => import("date-fns/locale/is"),
  it: () => import("date-fns/locale/it"),
  "it-ch": () => import("date-fns/locale/it-CH"),
  ja: () => import("date-fns/locale/ja"),
  "ja-hira": () => import("date-fns/locale/ja-Hira"),
  ka: () => import("date-fns/locale/ka"),
  kk: () => import("date-fns/locale/kk"),
  km: () => import("date-fns/locale/km"),
  kn: () => import("date-fns/locale/kn"),
  ko: () => import("date-fns/locale/ko"),
  lb: () => import("date-fns/locale/lb"),
  lt: () => import("date-fns/locale/lt"),
  lv: () => import("date-fns/locale/lv"),
  mk: () => import("date-fns/locale/mk"),
  mn: () => import("date-fns/locale/mn"),
  ms: () => import("date-fns/locale/ms"),
  mt: () => import("date-fns/locale/mt"),
  nb: () => import("date-fns/locale/nb"),
  nl: () => import("date-fns/locale/nl"),
  "nl-be": () => import("date-fns/locale/nl-BE"),
  nn: () => import("date-fns/locale/nn"),
  oc: () => import("date-fns/locale/oc"),
  pl: () => import("date-fns/locale/pl"),
  pt: () => import("date-fns/locale/pt"),
  "pt-br": () => import("date-fns/locale/pt-BR"),
  ro: () => import("date-fns/locale/ro"),
  ru: () => import("date-fns/locale/ru"),
  se: () => import("date-fns/locale/se"),
  sk: () => import("date-fns/locale/sk"),
  sl: () => import("date-fns/locale/sl"),
  sq: () => import("date-fns/locale/sq"),
  sr: () => import("date-fns/locale/sr"),
  "sr-latn": () => import("date-fns/locale/sr-Latn"),
  sv: () => import("date-fns/locale/sv"),
  ta: () => import("date-fns/locale/ta"),
  te: () => import("date-fns/locale/te"),
  th: () => import("date-fns/locale/th"),
  tr: () => import("date-fns/locale/tr"),
  ug: () => import("date-fns/locale/ug"),
  uk: () => import("date-fns/locale/uk"),
  uz: () => import("date-fns/locale/uz"),
  "uz-cyrl": () => import("date-fns/locale/uz-Cyrl"),
  vi: () => import("date-fns/locale/vi"),
  "zh-cn": () => import("date-fns/locale/zh-CN"),
  "zh-hk": () => import("date-fns/locale/zh-HK"),
  "zh-tw": () => import("date-fns/locale/zh-TW"),
};

export async function importDateFnsLocaleModule(path: string): Promise<Locale | null> {
  const loader = localeLoaders[path.toLowerCase()];

  if (!loader) {
    return null;
  }

  try {
    const localeModule = (await loader()) as DateFnsLocaleModule;

    return resolveDateFnsLocaleModule(path, localeModule);
  } catch {
    return null;
  }
}
