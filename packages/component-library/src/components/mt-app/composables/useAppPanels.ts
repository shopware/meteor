import { readonly, ref, watch, type Ref } from "vue";
import type { MtAppPanel } from "./useMtApp";

export interface UseAppPanelsOptions {
  isMobile: Readonly<Ref<boolean>>;
  /** Whether the panel's drawer can open: its slot is filled and no view hides it. */
  canOpenDrawer(panel: MtAppPanel): boolean;
  /** The open state of each panel in the desktop layout, which the app can bind with `v-model`. */
  desktopState: Record<MtAppPanel, Ref<boolean>>;
}

/**
 * The open state of the shell's panels. In the desktop layout, each panel has its own state. In
 * the mobile layout, at most one panel is open, as a drawer, and switching layouts closes it.
 * Whether a view hides a panel is a separate state: an open panel that a view hides stays open.
 */
export function useAppPanels({ isMobile, canOpenDrawer, desktopState }: UseAppPanelsOptions) {
  const drawer = ref<MtAppPanel | null>(null);

  /** Whether the panel is open in the current layout. */
  function isOpen(panel: MtAppPanel) {
    return isMobile.value ? drawer.value === panel : desktopState[panel].value;
  }

  function open(panel: MtAppPanel) {
    if (!isMobile.value) {
      desktopState[panel].value = true;
      return;
    }

    if (canOpenDrawer(panel)) drawer.value = panel;
  }

  function close(panel: MtAppPanel) {
    if (!isMobile.value) {
      desktopState[panel].value = false;
      return;
    }

    if (drawer.value === panel) drawer.value = null;
  }

  function toggle(panel: MtAppPanel) {
    if (isOpen(panel)) close(panel);
    else open(panel);
  }

  function closeDrawer() {
    drawer.value = null;
  }

  watch(isMobile, closeDrawer);

  return { isOpen, open, close, toggle, closeDrawer, drawer: readonly(drawer) };
}
