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
 * scope) is alive and not deactivated by `<KeepAlive>`, for example for a focus mode inside a page:
 *
 * ```ts
 * useMtAppRegions(() => ({ header: !focusMode.value, navigation: !focusMode.value }));
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
 * @experimental Not for public use yet: undocumented, and it may change or be removed without notice.
 */
export function useMtAppRegions(regions: MaybeRefOrGetter<MtAppRegions>): void {
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
