import { reactive } from "vue";

export type Locale = "en" | "de";

export interface Settings {
  header: boolean;
  sidebarStart: boolean;
  sidebarEnd: boolean;
  locale: Locale;
}

export const LOCALE_STORAGE_KEY = "playground-admin-locale";

export const settings = reactive<Settings>({
  header: true,
  sidebarStart: true,
  sidebarEnd: true,
  locale: localStorage.getItem(LOCALE_STORAGE_KEY) === "de" ? "de" : "en",
});
