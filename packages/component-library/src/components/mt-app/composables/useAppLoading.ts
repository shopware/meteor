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
import { appContextKey } from "../_internal/mt-app-context";

/**
 * Reports loading to the surrounding `mt-app` while `isLoading` is `true`, which shows its loading
 * bar. Outside of a shell, it does nothing.
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

  if (getCurrentInstance()) {
    onDeactivated(() => (isActive.value = false));
    onActivated(() => (isActive.value = true));
  }

  onScopeDispose(() => finishLoading?.());
}
