import { onScopeDispose, ref, watch, type WatchSource } from "vue";
import { useAppLoading } from "@shopware-ag/meteor-component-library";

/** How long a page waits for its fake data. */
const FAKE_LOADING_DELAY = 800;

/**
 * Placeholder for loading a page's data: `true` for a moment after the page opens and whenever
 * `key` changes, such as the id of the page. The route changes right away, the content follows,
 * and the shell shows its loading bar meanwhile.
 */
export function useFakeLoading(key?: WatchSource) {
  const isLoading = ref(true);
  let timeout: ReturnType<typeof setTimeout> | undefined;

  function load() {
    clearTimeout(timeout);
    isLoading.value = true;
    timeout = setTimeout(() => (isLoading.value = false), FAKE_LOADING_DELAY);
  }

  load();
  if (key) watch(key, load);
  onScopeDispose(() => clearTimeout(timeout));

  useAppLoading(isLoading);

  return isLoading;
}
