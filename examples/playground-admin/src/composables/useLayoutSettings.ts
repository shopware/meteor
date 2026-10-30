import { reactive, watch } from "vue";

const STORAGE_KEY = "playground-admin-layout";

interface LayoutSettings {
  /** Whether the navigation has a trigger on desktop, which shows and hides it. */
  navigationClosable: boolean;
  /** Whether the sidebar has a trigger on desktop, which shows and hides it. */
  sidebarClosable: boolean;
}

const defaults: LayoutSettings = {
  navigationClosable: false,
  sidebarClosable: false,
};

const settings = reactive<LayoutSettings>({
  ...defaults,
  ...JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}"),
});

watch(settings, (value) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
});

/** The layout of the shell that the user picks in the settings, kept in the browser. */
export function useLayoutSettings() {
  return settings;
}

export function resetLayoutSettings() {
  Object.assign(settings, defaults);
}
