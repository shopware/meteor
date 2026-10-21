import {
  getCurrentInstance,
  inject,
  onActivated,
  onDeactivated,
  onScopeDispose,
  toValue,
  type MaybeRefOrGetter,
} from "vue";
import { appContextKey } from "./useAppContext";

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

/**
 * Hides regions of the surrounding `<mt-app>` for as long as the calling component (or effect
 * scope) is alive and not deactivated by `<KeepAlive>`, for example for a focus mode inside a page:
 *
 * ```ts
 * useAppRegions(() => ({ header: !focusMode.value, navigation: !focusMode.value }));
 * ```
 *
 * Regions that a whole route hides belong in its route meta instead, which the shell reads before
 * the page renders, so they don't flicker during page transitions:
 *
 * ```ts
 * { path: "/editor", component: EditorView, meta: { mtAppRegions: { header: false } } }
 * ```
 *
 * When several components hide regions, a region stays hidden until none of them hides it anymore.
 * Hidden regions stay mounted, so their state survives. Outside of a shell, the call does nothing.
 *
 * @experimental The API may still change in a future release.
 */
export function useAppRegions(regions: MaybeRefOrGetter<MtAppRegions>): void {
  const context = inject(appContextKey, null);
  if (context === null) return;

  const request = () => context.requestRegions(() => toValue(regions));
  let release: (() => void) | undefined = request();

  // A page that <KeepAlive> caches gives the regions back while it isn't shown.
  if (getCurrentInstance()) {
    onDeactivated(() => {
      release?.();
      release = undefined;
    });
    onActivated(() => {
      release ??= request();
    });
  }

  onScopeDispose(() => release?.());
}
