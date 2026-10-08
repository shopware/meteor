import { inject, onScopeDispose, toValue, type MaybeRefOrGetter } from "vue";
import { appContextKey } from "./useAppContext";

/**
 * The regions of the shell that a view can hide with `useMtAppRegions()`. `false` hides a region;
 * any other value leaves it as it is.
 *
 * @experimental Not for public use yet: undocumented, and it may change or be removed without notice.
 */
export interface MtAppRegions {
  header?: boolean;
  navigation?: boolean;
  sidebar?: boolean;
  /** `false` removes the frame around the content while no other region is visible. */
  contentFrame?: boolean;
}

/**
 * Hides regions of the surrounding `<mt-app>` for as long as the calling component (or effect
 * scope) is alive, for example to give a route a full-screen view:
 *
 * ```ts
 * useMtAppRegions({ header: false, navigation: false, sidebar: false });
 * ```
 *
 * Pass a ref or getter to toggle regions while the component stays mounted. When several
 * components hide regions, a region stays hidden until none of them hides it anymore. Hidden
 * regions stay mounted, so their state survives. Outside of a shell, the call does nothing.
 *
 * @experimental Not for public use yet: undocumented, and it may change or be removed without notice.
 */
export function useMtAppRegions(regions: MaybeRefOrGetter<MtAppRegions>): void {
  const context = inject(appContextKey, null);
  if (context === null) return;

  const release = context.requestRegions(() => toValue(regions));
  onScopeDispose(release);
}
