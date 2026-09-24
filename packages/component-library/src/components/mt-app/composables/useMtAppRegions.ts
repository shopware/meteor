import { inject, onScopeDispose, toValue, type MaybeRefOrGetter } from "vue";
import { appLayoutKey, type MtAppRegions } from "./useAppLayout";

export type { MtAppRegions };

/**
 * Hides regions of the surrounding `<mt-app>` for as long as the calling component
 * (or effect scope) is alive, for example to give a route a fullscreen view:
 *
 * ```ts
 * useMtAppRegions({ header: false, sidebarStart: false, sidebarEnd: false });
 * ```
 *
 * `false` hides a region; any other value has no effect. Pass a ref or getter to
 * toggle regions while the component stays mounted. When several components hide
 * regions, a region stays hidden until none of them hides it anymore. Hidden regions
 * stay mounted, so their state survives. Outside of a shell the call does nothing.
 */
export function useMtAppRegions(regions: MaybeRefOrGetter<MtAppRegions>): void {
  const layout = inject(appLayoutKey, null);
  if (!layout) return;

  const release = layout.requestRegions(() => toValue(regions));
  onScopeDispose(release);
}
