import { toValue, type MaybeRefOrGetter } from "vue";
import { useAppRegistration } from "../_internal/mt-app-context";
// Types `meta.mtAppRegions` for apps that use Vue Router. The generated types drop this import, and
// TypeScript ignores the augmentation where Vue Router is missing.
import type {} from "vue-router";

/**
 * The parts of the shell that a view can hide with `useAppRegions()`: its regions and the frame
 * around the content. `false` hides a part; any other value leaves it as it is.
 *
 * @experimental The API may still change in a future release.
 */
export interface MtAppRegions {
  header?: boolean;
  navigation?: boolean;
  sidebar?: boolean;
  /** `false` removes the frame around the content while no other region is visible. */
  contentFrame?: boolean;
}

declare module "vue-router" {
  interface RouteMeta {
    /**
     * The parts of `mt-app` that the route hides, applied before its page renders. A child route
     * overrides the parts it names and keeps the others of its parents.
     */
    mtAppRegions?: MtAppRegions;
  }
}

/**
 * Hides regions of the surrounding `mt-app` while the calling component is alive, for example for
 * a focus mode. Regions that a whole route hides belong in its meta. Outside of a shell, it does
 * nothing.
 *
 * @experimental The API may still change in a future release.
 */
export function useAppRegions(regions: MaybeRefOrGetter<MtAppRegions>): void {
  useAppRegistration((app) => app.registerRegions(() => toValue(regions)));
}
