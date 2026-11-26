import { customRef, shallowReactive, type Ref, type VNodeChild } from "vue";
import {
  readPanelSlot,
  resolvePanelSettings,
  type PanelOptions,
  type PanelPlace,
  type PanelSlot,
} from "@/components/mt-panel/panel-settings";
import { warn } from "@/utils/log";
import { useRenderCache } from "@/utils/slot";

/**
 * The panel slots of a layout, read once per render. Reading a slot shows the options of the
 * `MtPanel` at its top before anything inside renders, so the layout knows its label, icon,
 * closable setting and whether it starts open in the same render, also on the server. An `MtPanel`
 * inside another component is only known once it sets up, from the options it registers.
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

  const registeredOpen = shallowReactive(new Map<Place, Ref<boolean>>());
  const ownOpen = shallowReactive(new Map<Place, boolean>());

  function registerPanelOpen(place: Place, open: Ref<boolean>) {
    // The `MtPanel` takes over whether the layout opened or closed the panel before it set up.
    const layoutOpen = ownOpen.get(place);

    if (layoutOpen !== undefined) {
      ownOpen.delete(place);
      open.value = layoutOpen;
    }

    registeredOpen.set(place, open);

    return () => {
      if (registeredOpen.get(place) === open) registeredOpen.delete(place);
    };
  }

  /** Whether the panel is open: the `MtPanel`'s state, the layout's own, or its props in the slot. */
  function openState(place: Place) {
    return customRef<boolean>(() => ({
      get() {
        return (
          registeredOpen.get(place)?.value ??
          ownOpen.get(place) ??
          panelSlot(place).options?.open ??
          true
        );
      },
      set(open) {
        const panelOpen = registeredOpen.get(place);

        if (panelOpen) panelOpen.value = open;
        else ownOpen.set(place, open);
      },
    }));
  }

  const inlineOpen = Object.fromEntries(places.map((place) => [place, openState(place)])) as Record<
    Place,
    Ref<boolean>
  >;

  return {
    panelSlot,
    panelSettings,
    hasPanel,
    registerPanelOptions,
    inlineOpen,
    registerPanelOpen,
  };
}

/**
 * On the server, the layout renders the triggers before an `MtPanel` inside another component
 * registers its options, so the server markup lacks them until the app has loaded.
 */
function warnOnServer() {
  warn(
    "mt-panel",
    "Put <mt-panel> directly into the panel slot, so its label, icon, closable setting and whether it starts open are part of the server-rendered page.",
  );
}
