import { computed, ref, watch, type Ref } from "vue";
import type { MtAppSide } from "./useAppLayout";

export interface UseAppDrawerOptions {
  isMobile: Readonly<Ref<boolean>>;
  /** Called with the new active side whenever it changes. */
  onChange?: (side: MtAppSide | null) => void;
}

/**
 * The drawer state of the shell: at most one side is open at a time, only in the
 * mobile layout and only for sides that have a registered sidebar. Leaving the
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
      if (activeSide.value === side) close();
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

/**
 * Whether a click inside `root` is a plain navigation on a link: an unmodified
 * left click on an anchor with a real `href` that opens in the same window.
 * Mirrors the guard of vue-router's RouterLink, which is why `defaultPrevented`
 * is deliberately not checked (RouterLink prevents the default itself).
 */
export function isNavigationClick(event: MouseEvent, root: HTMLElement): boolean {
  if (event.button !== 0) return false;
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return false;
  if (!(event.target instanceof Element)) return false;

  const anchor = event.target.closest("a[href]");
  if (!anchor || !root.contains(anchor)) return false;
  if (anchor.hasAttribute("download")) return false;

  const target = anchor.getAttribute("target");
  if (target && target !== "_self") return false;

  const href = anchor.getAttribute("href") ?? "";
  return href !== "" && href !== "#";
}
