import { onScopeDispose, readonly, ref, watch } from "vue";

/** How long loading has to last before it shows, so quick navigations don't flash the bar. */
const SHOW_DELAY = 200;

/**
 * Whether the app is loading: while any loading that `startLoading()` reported is not done yet.
 * `isLoading` turns on after a short delay and off right away.
 */
export function useAppLoading() {
  const pendingCount = ref(0);
  const isLoading = ref(false);
  let showTimer: ReturnType<typeof setTimeout> | undefined;

  /** Reports loading until the returned function is called. */
  function startLoading(): () => void {
    let isDone = false;
    pendingCount.value += 1;

    return () => {
      if (isDone) return;

      isDone = true;
      pendingCount.value -= 1;
    };
  }

  watch(
    () => pendingCount.value > 0,
    (isPending) => {
      clearTimeout(showTimer);

      if (isPending) showTimer = setTimeout(() => (isLoading.value = true), SHOW_DELAY);
      else isLoading.value = false;
    },
  );

  onScopeDispose(() => clearTimeout(showTimer));

  return { isLoading: readonly(isLoading), startLoading };
}
