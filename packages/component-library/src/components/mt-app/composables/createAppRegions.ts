import { computed, shallowReactive } from "vue";
import type { MtAppRegions } from "./useAppRegions";

const REGIONS = ["header", "navigation", "sidebar", "contentFrame"] as const;

/**
 * The regions that views hide with `useAppRegions()` and routes with their meta. A region stays
 * hidden while any registration hides it.
 */
export function createAppRegions() {
  const registrations = shallowReactive(new Map<symbol, () => MtAppRegions>());

  /** `true` for every region that is hidden. Stays the same object while nothing changes. */
  const hidden = computed<Required<MtAppRegions>>((previous) => {
    const requested = Array.from(registrations.values(), (regions) => regions());
    const next = Object.fromEntries(
      REGIONS.map((region) => [region, requested.some((regions) => regions[region] === false)]),
    ) as Required<MtAppRegions>;

    const isUnchanged = previous && REGIONS.every((region) => previous[region] === next[region]);
    return isUnchanged ? previous : next;
  });

  function registerRegions(regions: () => MtAppRegions) {
    const id = Symbol("mt-app-regions");
    registrations.set(id, regions);

    return () => {
      registrations.delete(id);
    };
  }

  return { hidden, registerRegions };
}
