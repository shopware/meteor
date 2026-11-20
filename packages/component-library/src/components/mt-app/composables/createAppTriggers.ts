import { computed, shallowReactive } from "vue";
import type { MtAppPanel } from "./useApp";

/** Where a component that shows the panels' triggers sits: in the shell's header, or in a page. */
export type AppTriggerRegion = "header" | "page";

interface PlacedTrigger {
  /** The panel that the trigger stands in for, or `undefined` while it is inside its own panel. */
  panel: () => MtAppPanel | undefined;
  region: AppTriggerRegion;
}

/**
 * Where the shell's own components, such as `mt-page` and `mt-app-header`, show the triggers of its
 * panels. While the header is shown, a component in it shows a panel's trigger instead of the
 * pages. A trigger that the app places itself with `mt-app-panel-trigger` always shows, and the
 * shell's components leave out theirs for that panel, unless it is placed inside that panel. The
 * shell shows no triggers of its own.
 */
export function createAppTriggers(isHeaderShown: () => boolean) {
  const headerTriggers = shallowReactive(new Map<symbol, () => MtAppPanel>());
  const placedTriggers = shallowReactive(new Map<symbol, PlacedTrigger>());

  function isInHeaderClaim(panel: MtAppPanel) {
    return Array.from(headerTriggers.values()).some((claimed) => claimed() === panel);
  }

  // A placed trigger in a hidden header isn't seen, so it doesn't count.
  function isPlacedClaim(panel: MtAppPanel) {
    return Array.from(placedTriggers.values()).some(
      (placed) => placed.panel() === panel && (placed.region === "page" || isHeaderShown()),
    );
  }

  // Computed, so the shell's components only render again when the place of a trigger changes.
  const isPlaced = {
    navigation: computed(() => isPlacedClaim("navigation")),
    sidebar: computed(() => isPlacedClaim("sidebar")),
  };
  const isInHeader = {
    navigation: computed(() => isHeaderShown() && isInHeaderClaim("navigation")),
    sidebar: computed(() => isHeaderShown() && isInHeaderClaim("sidebar")),
  };

  /** Whether the shell's component in the region shows the panel's trigger. */
  function showsTrigger(panel: MtAppPanel, region: AppTriggerRegion) {
    if (isPlaced[panel].value) return false;

    return region === "header" ? isHeaderShown() : !isInHeader[panel].value;
  }

  function register<T>(map: Map<symbol, T>, value: T) {
    const id = Symbol("mt-app-trigger");
    map.set(id, value);

    return () => {
      map.delete(id);
    };
  }

  return {
    showsTrigger,
    registerHeaderTrigger: (panel: () => MtAppPanel) => register(headerTriggers, panel),
    registerPlacedTrigger: (panel: () => MtAppPanel | undefined, region: AppTriggerRegion) =>
      register(placedTriggers, { panel, region }),
  };
}
