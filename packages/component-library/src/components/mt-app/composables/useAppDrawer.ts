import { computed, nextTick, ref, watch, type Ref } from "vue";
import type { MtAppSide } from "./useAppLayout";

export interface UseAppDrawerOptions {
  isMobile: Readonly<Ref<boolean>>;
  /** Whether the sidebar of a side may open as a drawer, for example because it is not hidden. */
  isAvailable?: (side: MtAppSide) => boolean;
  /** Called with the new active side whenever it changes. */
  onChange?: (side: MtAppSide | null) => void;
}

/**
 * The drawer state of the shell: at most one side is open at a time, only in the
 * mobile layout and only for sides that have an available sidebar. Leaving the
 * mobile layout or removing the active sidebar closes the drawer.
 */
export function useAppDrawer(options: UseAppDrawerOptions) {
  const activeSide = ref<MtAppSide | null>(null);
  const registered = new Set<MtAppSide>();

  function set(side: MtAppSide | null) {
    if (activeSide.value === side) return;

    activeSide.value = side;
    options.onChange?.(side);
  }

  function open(side: MtAppSide) {
    if (!options.isMobile.value || !registered.has(side)) return;
    if (options.isAvailable && !options.isAvailable(side)) return;

    set(side);
  }

  function close() {
    set(null);
  }

  function toggle(side: MtAppSide) {
    if (activeSide.value === side) close();
    else open(side);
  }

  function registerSidebar(side: MtAppSide) {
    registered.add(side);

    return () => {
      registered.delete(side);

      nextTick(() => {
        if (activeSide.value === side && !registered.has(side)) close();
      });
    };
  }

  watch(options.isMobile, () => close());

  return {
    activeSide: computed(() => activeSide.value),
    registerSidebar,
    open,
    close,
    toggle,
  };
}
