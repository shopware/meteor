import { reactive, watch } from "vue";

const STORAGE_KEY = "playground-standalone-layout";

/** What the shell's `header` slot holds. */
export type HeaderSetting = "app-header" | "custom" | "off";

/** Whether a panel slot of the shell is filled, and whether its panel closes on desktop. */
export type PanelSetting = "off" | "open" | "closable";

interface LayoutSettings {
  header: HeaderSetting;
  /** Whether the custom header shows the navigation trigger with `mt-app-panel-trigger`. */
  customHeaderNavigationTrigger: boolean;
  /** Whether the custom header shows the sidebar trigger with `mt-app-panel-trigger`. */
  customHeaderSidebarTrigger: boolean;
  /** The navigation panel with `mt-app-sidebar`. */
  navigation: PanelSetting;
  /** The Copilot panel. */
  sidebar: PanelSetting;
  /** Whether the settings view is an `mt-page`. Without one, only the header shows the triggers. */
  settingsInPage: boolean;
  /** Whether the settings view without `mt-page` shows the triggers with `mt-app-panel-trigger`. */
  settingsPanelTriggers: boolean;
  /** Whether the settings view hides the shell's header with `useAppRegions()`. */
  settingsHideHeader: boolean;
}

const defaults: LayoutSettings = {
  header: "app-header",
  customHeaderNavigationTrigger: true,
  customHeaderSidebarTrigger: true,
  navigation: "off",
  sidebar: "closable",
  settingsInPage: true,
  settingsPanelTriggers: false,
  settingsHideHeader: false,
};

const settings = reactive<LayoutSettings>({
  ...defaults,
  ...JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}"),
});

watch(settings, (value) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
});

/**
 * The parts of the shell that the user picks in the settings, kept in the browser, to try where
 * the shell shows the triggers of its panels.
 */
export function useLayoutSettings() {
  return settings;
}
