import { computed, inject, type Ref } from "vue";
import { appContextKey } from "./useAppContext";

/**
 * A panel of the shell that can be opened and closed: the navigation or the sidebar.
 *
 * @experimental Not for public use yet: undocumented, and it may change or be removed without notice.
 */
export type MtAppPanel = "navigation" | "sidebar";

/**
 * The shell state and controls that `useMtApp()` returns.
 *
 * @experimental Not for public use yet: undocumented, and it may change or be removed without notice.
 */
export interface MtAppContext {
  /** Whether the shell uses the mobile layout, in which the panels are drawers. */
  isMobile: Readonly<Ref<boolean>>;
  /**
   * Whether the panel is open: shown in the desktop layout, or open as a drawer in the mobile
   * layout. A view can still hide an open panel with `useMtAppRegions()`.
   */
  isOpen(panel: MtAppPanel): boolean;
  /** Shows the panel, or opens its drawer in the mobile layout. */
  open(panel: MtAppPanel): void;
  /** Hides the panel, or closes its drawer in the mobile layout. */
  close(panel: MtAppPanel): void;
  /** Opens the panel when it is closed, and closes it when it is open. */
  toggle(panel: MtAppPanel): void;
}

/**
 * Reads and controls the surrounding `<mt-app>` from any component inside of it. The component
 * that renders `<mt-app>` itself uses the `header` slot props or a template ref instead, because
 * it is not inside the shell. Outside of a shell, it returns inert defaults, so components that
 * use it keep working on their own.
 *
 * @experimental Not for public use yet: undocumented, and it may change or be removed without notice.
 */
export function useMtApp(): MtAppContext {
  const context = inject(appContextKey, null);

  if (context === null) {
    return {
      isMobile: computed(() => false),
      isOpen: () => false,
      open: () => undefined,
      close: () => undefined,
      toggle: () => undefined,
    };
  }

  return {
    isMobile: context.isMobile,
    isOpen: context.isOpen,
    open: context.open,
    close: context.close,
    toggle: context.toggle,
  };
}
