import { computed, inject, type Ref } from "vue";
import { appContextKey } from "../_internal/mt-app-context";

/**
 * A panel of the shell that can be opened and closed: the navigation or the sidebar.
 *
 * @experimental The API may still change in a future release.
 */
export type MtAppPanel = "navigation" | "sidebar";

/**
 * The shell state and controls that `useApp()` returns.
 *
 * @experimental The API may still change in a future release.
 */
export interface MtAppContext {
  /** Whether the shell uses the mobile layout, in which the panels are drawers. */
  isMobile: Readonly<Ref<boolean>>;
  /**
   * Whether the panel is open: shown in the desktop layout, or open as a drawer in the mobile
   * layout. A view can still hide an open panel with `useAppRegions()`.
   */
  isOpen(panel: MtAppPanel): boolean;
  /** Shows the panel, or opens its drawer in the mobile layout. */
  open(panel: MtAppPanel): void;
  /** Hides the panel, or closes its drawer in the mobile layout. */
  close(panel: MtAppPanel): void;
  /** Opens the panel when it is closed, and closes it when it is open. */
  toggle(panel: MtAppPanel): void;
  /**
   * Asks the user whether to discard the unsaved changes that views report with
   * `useUnsavedChanges()`, for leaving them without a navigation, such as closing an editor.
   * Resolves `true` to leave, right away when there are none.
   */
  confirmLeave(): Promise<boolean>;
}

/**
 * Reads and controls the surrounding `mt-app` from components inside it, such as pages. Outside of
 * a shell, it returns inert defaults.
 *
 * @experimental The API may still change in a future release.
 */
export function useApp(): MtAppContext {
  const context = inject(appContextKey, null);

  if (context === null) {
    return {
      isMobile: computed(() => false),
      isOpen: () => false,
      open: () => undefined,
      close: () => undefined,
      toggle: () => undefined,
      confirmLeave: () => Promise.resolve(true),
    };
  }

  return {
    isMobile: context.isMobile,
    isOpen: context.isOpen,
    open: context.open,
    close: context.close,
    toggle: context.toggle,
    confirmLeave: context.confirmLeave,
  };
}
