import { getCurrentInstance, toValue, type MaybeRefOrGetter } from "vue";
import { useAppRegistration } from "../_internal/mt-app-context";

/**
 * Protects unsaved changes: while `hasChanges` is `true`, the surrounding `mt-app` asks before a
 * navigation, a reload or `useApp().confirmLeave()` would lose them. Outside of a shell, it does
 * nothing.
 *
 * @experimental The API may still change in a future release.
 */
export function useUnsavedChanges(hasChanges: MaybeRefOrGetter<boolean>): void {
  const owner = getCurrentInstance();

  useAppRegistration((app) =>
    app.registerUnsavedChanges({ hasChanges: () => toValue(hasChanges), owner }),
  );
}
