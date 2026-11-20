import { shallowReactive, type VNodeChild } from "vue";
import {
  readPanelSlot,
  resolvePanelSettings,
  type PanelOptions,
  type PanelPlace,
  type PanelSlot,
} from "@/components/mt-panel/panel-settings";
import { useRenderCache } from "@/utils/slot";

let hasWarnedOnServer = false;

/**
 * The panel slots of a layout, read once per render. Reading a slot shows the options of the
 * `MtPanel` at its top before anything inside renders, so the layout knows its label, icon and
 * closable setting in the same render, also on the server. An `MtPanel` inside another component
 * is only known once it sets up, from the options it registers.
 */
export function usePanelSlots<Place extends PanelPlace>(
  places: readonly Place[],
  renderSlot: (place: Place) => unknown,
  defaultLabel: (place: Place) => string,
) {
  const renderedSlots = useRenderCache(
    () =>
      Object.fromEntries(
        places.map((place) => [place, readPanelSlot(renderSlot(place) as VNodeChild)]),
      ) as Record<Place, PanelSlot>,
  );

  const registeredOptions = shallowReactive(new Map<Place, () => PanelOptions>());

  function panelSlot(place: Place) {
    return renderedSlots()[place];
  }

  function registerPanelOptions(place: Place, options: () => PanelOptions) {
    if (typeof window === "undefined" && !panelSlot(place).options) warnOnServer();

    registeredOptions.set(place, options);

    return () => {
      if (registeredOptions.get(place) === options) registeredOptions.delete(place);
    };
  }

  /** The label, the trigger icon, whether the panel is closable and its appearance. */
  function panelSettings(place: Place) {
    const options = panelSlot(place).options ?? registeredOptions.get(place)?.();

    return resolvePanelSettings(place, options, defaultLabel(place));
  }

  /** Whether an `MtPanel` holds the panel's content: in the slot, or inside another component. */
  function hasPanel(place: Place) {
    return panelSlot(place).options !== undefined || registeredOptions.has(place);
  }

  return { panelSlot, panelSettings, hasPanel, registerPanelOptions };
}

/**
 * On the server, the layout renders the triggers before an `MtPanel` inside another component
 * registers its options, so the server markup lacks them until the app has loaded.
 */
function warnOnServer() {
  if (hasWarnedOnServer) return;

  hasWarnedOnServer = true;
  console.warn(
    "[MtPanel] Put <mt-panel> directly into the panel slot, so its label, icon and closable setting are part of the server-rendered page.",
  );
}
