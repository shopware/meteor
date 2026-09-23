import { reactive } from "vue";

export type Locale = "en" | "de";

export interface Settings {
  header: boolean;
  sidebarStart: boolean;
  sidebarEnd: boolean;
  locale: Locale;
  breakpoint: number;
  snackbar: boolean;
  closeOnNavigate: boolean;
  future: boolean;
}

export const LOCALE_STORAGE_KEY = "playground-admin-locale";

// The initial state can be set through the query string (e.g. `?header=0&breakpoint=99999`),
// which lets the browser tests start in a specific configuration without clicking through the UI.
const params = new URLSearchParams(window.location.search);

function flag(key: string, fallback: boolean): boolean {
  return params.has(key) ? params.get(key) !== "0" : fallback;
}

function oneOf<T extends string>(
  key: string,
  values: readonly T[],
  fallback: T,
): T {
  const value = params.get(key);
  return values.includes(value as T) ? (value as T) : fallback;
}

export const settings = reactive<Settings>({
  header: flag("header", true),
  sidebarStart: flag("start", true),
  sidebarEnd: flag("end", true),
  locale: oneOf(
    "locale",
    ["en", "de"],
    localStorage.getItem(LOCALE_STORAGE_KEY) === "de" ? "de" : "en",
  ),
  breakpoint: Number(params.get("breakpoint") ?? 1280),
  snackbar: flag("snackbar", true),
  closeOnNavigate: flag("closeOnNavigate", true),
  future: flag("future", true),
});
