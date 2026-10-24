import {
  getCurrentInstance,
  inject,
  onActivated,
  onDeactivated,
  onScopeDispose,
  ref,
  toValue,
  watch,
  type MaybeRefOrGetter,
} from "vue";
import { appContextKey } from "./useAppContext";

/**
 * Reports loading to the surrounding `<mt-app>` while `isLoading` is `true`, for as long as the
 * calling component (or effect scope) is alive and not deactivated by `<KeepAlive>`. The shell
 * shows its loading bar meanwhile, if `loading-bar` is on, so a page can pass the same state it
 * passes to `mt-page`:
 *
 * ```ts
 * const isLoading = ref(true);
 *
 * useAppLoading(isLoading);
 * ```
 *
 * When several components report loading, the bar runs until none of them is loading anymore.
 * Outside of a shell, the call does nothing.
 *
 * @experimental The API may still change in a future release.
 */
export function useAppLoading(isLoading: MaybeRefOrGetter<boolean>): void {
  const context = inject(appContextKey, null);
  if (context === null) return;

  const isActive = ref(true);
  let finishLoading: (() => void) | undefined;

  watch(
    () => isActive.value && toValue(isLoading),
    (loading) => {
      if (loading) finishLoading ??= context.startLoading();
      else {
        finishLoading?.();
        finishLoading = undefined;
      }
    },
    { immediate: true },
  );

  // A page that <KeepAlive> caches doesn't report loading while it isn't shown.
  if (getCurrentInstance()) {
    onDeactivated(() => (isActive.value = false));
    onActivated(() => (isActive.value = true));
  }

  onScopeDispose(() => finishLoading?.());
}
