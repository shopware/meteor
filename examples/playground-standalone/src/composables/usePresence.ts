import { onBeforeUnmount, ref, watch, type Ref } from "vue";

/**
 * Keeps a panel rendered after it closes, until its exit transition has played. Bind
 * `isRendered` to whatever mounts the panel and `onTransitionEnd` to the panel's `transitionend`;
 * the panel's own CSS transition on `opacity` decides how long the exit takes.
 */
export function usePresence(isOpen: Ref<boolean>) {
  const isRendered = ref(isOpen.value);
  let fallback: ReturnType<typeof setTimeout> | undefined;

  function unmount() {
    clearTimeout(fallback);
    if (!isOpen.value) isRendered.value = false;
  }

  function onTransitionEnd(event: TransitionEvent) {
    if (
      event.target === event.currentTarget &&
      event.propertyName === "opacity"
    ) {
      unmount();
    }
  }

  watch(isOpen, (open) => {
    clearTimeout(fallback);
    if (open) {
      isRendered.value = true;
      return;
    }
    // Without motion there is no transition to wait for. The timer covers a transition that never
    // ends, such as one cut short by the tab going to the background.
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    fallback = setTimeout(unmount, reduceMotion ? 0 : 300);
  });

  onBeforeUnmount(() => clearTimeout(fallback));

  return { isRendered, onTransitionEnd };
}
