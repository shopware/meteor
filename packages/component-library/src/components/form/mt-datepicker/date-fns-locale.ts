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

export async function importDateFnsLocaleModule(path: string): Promise<Locale | null> {
  try {
    const localeModule = (await import(
      /* @vite-ignore */
      `date-fns/locale/${path}`
    )) as DateFnsLocaleModule;

    return resolveDateFnsLocaleModule(path, localeModule);
  } catch {
    return null;
  }
}
