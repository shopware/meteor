import { addons } from "@storybook/preview-api";
import { GLOBALS_UPDATED, SET_GLOBALS } from "storybook/internal/core-events";

function applyTheme(theme: string) {
  const body = document.querySelector("body");
  if (!body) return;
  body.setAttribute("data-theme", theme);
  body.style.backgroundColor = "var(--color-elevation-surface-default)";
}

/*
 * Channel-based on purpose: a decorator with useGlobals re-renders every
 * story on globals changes, which docs pages do not support (they miss the
 * update entirely). The events cover boot and later switches in every view mode.
 */
const channel = addons.getChannel();
channel.on(SET_GLOBALS, ({ globals }) => applyTheme((globals.theme as string) ?? "light"));
channel.on(GLOBALS_UPDATED, ({ globals }) => applyTheme((globals.theme as string) ?? "light"));
