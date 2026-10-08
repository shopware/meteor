import { computed, shallowReactive } from "vue";
import type { MtAppRegions } from "./useMtAppRegions";

const REGIONS = ["header", "navigation", "sidebar", "contentFrame"] as const;

/**
 * The regions that views hide with `useMtAppRegions()`. Each request lasts until its release
 * function is called, and a region stays hidden while any request hides it.
 */
export function useAppRegions() {
  const requests = shallowReactive(new Map<symbol, () => MtAppRegions>());

  /** `true` for every region that is hidden. Stays the same object while nothing changes. */
  const hidden = computed<Required<MtAppRegions>>((previous) => {
    const requested = Array.from(requests.values(), (regions) => regions());
    const next = Object.fromEntries(
      REGIONS.map((region) => [region, requested.some((regions) => regions[region] === false)]),
    ) as Required<MtAppRegions>;

    const isUnchanged = previous && REGIONS.every((region) => previous[region] === next[region]);
    return isUnchanged ? previous : next;
  });

  function requestRegions(regions: () => MtAppRegions) {
    const id = Symbol("mt-app-regions");
    requests.set(id, regions);

    return () => {
      requests.delete(id);
    };
  }

  return { hidden, requestRegions };
}
