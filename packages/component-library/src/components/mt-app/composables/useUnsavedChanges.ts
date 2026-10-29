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
 * Protects unsaved changes for as long as the calling component (or effect scope) is alive and not
 * deactivated by `<KeepAlive>`. While `hasChanges` is `true`, the surrounding `<mt-app>` asks the
 * user whether to discard them:
 *
 * - before a navigation of Vue Router leaves the route that renders the component or changes its
 *   params, for example to the next product. Changes to the query or the hash and moves between its
 *   child routes keep the changes on the screen, so they don't ask.
 * - before a reload or closing the tab, with the browser's own prompt.
 * - when `useApp().confirmLeave()` is called, for leaving in other ways, such as closing an editor
 *   without a navigation.
 *
 * The app decides what counts as a change, so this works with any form handling:
 *
 * ```ts
 * useUnsavedChanges(() => JSON.stringify(product.value) !== savedProduct.value);
 * ```
 *
 * Outside of a shell, the call does nothing.
 *
 * @experimental The API may still change in a future release.
 */
export function useUnsavedChanges(hasChanges: MaybeRefOrGetter<boolean>): void {
  const context = inject(appContextKey, null);
  if (context === null) return;

  const owner = getCurrentInstance();
  const register = () =>
    context.registerUnsavedChanges({ hasChanges: () => toValue(hasChanges), owner });
  let release: (() => void) | undefined = register();

  // A page that <KeepAlive> caches keeps its changes, but doesn't ask while it isn't shown.
  if (owner) {
    onDeactivated(() => {
      release?.();
      release = undefined;
    });
    onActivated(() => {
      release ??= register();
    });
  }

  onScopeDispose(() => release?.());
}
