import { computed, inject, type Ref } from "vue";
import { pageContextKey } from "../_internal/mt-page-context";

/**
 * A panel of the page that can be opened and closed: the start or the end panel.
 *
 * @experimental The API may still change in a future release.
 */
export type MtPagePanel = "start" | "end";

/**
 * The page state and controls that `usePage()` returns.
 *
 * @experimental The API may still change in a future release.
 */
export interface MtPageContext {
  /** Whether the page uses the mobile layout, in which the panels are drawers. */
  isMobile: Readonly<Ref<boolean>>;
  /**
   * Whether the panel is open: shown in the desktop layout, or open as a drawer in the mobile
   * layout.
   */
  isOpen(panel: MtPagePanel): boolean;
  /** Shows the panel, or opens its drawer in the mobile layout. */
  open(panel: MtPagePanel): void;
  /** Hides the panel, or closes its drawer in the mobile layout. */
  close(panel: MtPagePanel): void;
  /** Opens the panel when it is closed, and closes it when it is open. */
  toggle(panel: MtPagePanel): void;
}

/**
 * Reads and controls the surrounding `mt-page` from components inside it. Outside of a page, it
 * returns inert defaults.
 *
 * @experimental The API may still change in a future release.
 */
export function usePage(): MtPageContext {
  const context = inject(pageContextKey, null);

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
