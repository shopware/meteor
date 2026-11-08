import { computed, onScopeDispose, readonly, ref, watch } from "vue";

/** How long loading has to last before it shows, so quick navigations don't flash the bar. */
const SHOW_DELAY = 200;

/** The minimum time loading stays shown, so loading ending just after the delay doesn't flash. */
const MIN_VISIBLE = 500;

/**
 * Whether the app is loading: while any loading that `startLoading()` reported is not done yet.
 * `isLoading` turns on after a short delay, and once on, it stays on for a minimum time.
 */
export function createAppLoading() {
  const pendingCount = ref(0);
  const isPending = computed(() => pendingCount.value > 0);
  const isLoading = ref(false);
  let showTimer: ReturnType<typeof setTimeout> | undefined;
  let hideTimer: ReturnType<typeof setTimeout> | undefined;
  let shownAt = 0;

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

  watch(isPending, (pending) => {
    clearTimeout(showTimer);
    clearTimeout(hideTimer);

    if (pending) {
      if (isLoading.value) return;

      showTimer = setTimeout(() => {
        isLoading.value = true;
        shownAt = Date.now();
      }, SHOW_DELAY);

      return;
    }

    const remaining = MIN_VISIBLE - (Date.now() - shownAt);

    if (isLoading.value && remaining > 0) {
      hideTimer = setTimeout(() => (isLoading.value = false), remaining);
    } else {
      isLoading.value = false;
    }
  });

  onScopeDispose(() => {
    clearTimeout(showTimer);
    clearTimeout(hideTimer);
  });

  return {
    isLoading: readonly(isLoading),
    /** Whether loading is pending right now, without the delay and minimum time of `isLoading`. */
    isPending,
    startLoading,
  };
}
