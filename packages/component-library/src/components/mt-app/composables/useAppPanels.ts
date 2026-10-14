import { readonly, shallowRef, watch, type Ref } from "vue";

export interface UseAppPanelsOptions<Panel extends string> {
  isMobile: Readonly<Ref<boolean>>;
  /** Whether the panel's drawer can open: its slot is filled and no view hides it. */
  canOpenDrawer(panel: Panel): boolean;
  /** The open state of each panel in the desktop layout, which the app can bind with `v-model`. */
  desktopState: Record<Panel, Ref<boolean>>;
}

/**
 * What a panel region needs from the layout it belongs to, the shell or a page: whether the
 * panels are drawers, their open state, and where the focus goes when a panel disappears.
 */
export interface PanelController {
  /** Whether the panels are drawers: the mobile layout of the shell or a narrow page. */
  isMobile: Readonly<Ref<boolean>>;
  isOpen(panel: string): boolean;
  open(panel: string): void;
  close(panel: string): void;
  focusContent(): void;
}

/**
 * The open state of the shell's panels. In the desktop layout, each panel has its own state. In
 * the mobile layout, at most one panel is open, as a drawer, and switching layouts closes it.
 * Whether a view hides a panel is a separate state: an open panel that a view hides stays open.
 */
export function useAppPanels<Panel extends string>({
  isMobile,
  canOpenDrawer,
  desktopState,
}: UseAppPanelsOptions<Panel>) {
  const drawer = shallowRef<Panel | null>(null);

  /** Whether the panel is open in the current layout. */
  function isOpen(panel: Panel) {
    return isMobile.value ? drawer.value === panel : desktopState[panel].value;
  }

  function open(panel: Panel) {
    if (!isMobile.value) {
      desktopState[panel].value = true;
      return;
    }

    if (canOpenDrawer(panel)) drawer.value = panel;
  }

  function close(panel: Panel) {
    if (!isMobile.value) {
      desktopState[panel].value = false;
      return;
    }

    if (drawer.value === panel) drawer.value = null;
  }

  function toggle(panel: Panel) {
    if (isOpen(panel)) close(panel);
    else open(panel);
  }

  function closeDrawer() {
    drawer.value = null;
  }

  watch(isMobile, closeDrawer);

  return { isOpen, open, close, toggle, closeDrawer, drawer: readonly(drawer) };
}
