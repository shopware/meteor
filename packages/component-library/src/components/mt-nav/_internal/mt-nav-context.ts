import type { ComputedRef, InjectionKey, Ref } from "vue";
import type { NavItem, NavLinkComponent, NavRoute, NavRouter } from "../mt-nav.types";

/**
 * Shared state of `mt-nav`, provided to the sections and rows slotted into it.
 */
export interface NavContext {
  route: ComputedRef<NavRoute | undefined>;
  router: ComputedRef<NavRouter | undefined>;
  linkComponent: ComputedRef<NavLinkComponent>;
  /** Whether the navigation is expanded. Collapsed, rows show icons only. */
  expanded: ComputedRef<boolean>;
  /** Whether any top-level branch is expanded, in which case the route stops keeping folders open. */
  hasExpandedBranches: ComputedRef<boolean>;
  /** Whether the branch of a top-level item is open. */
  isItemExpanded: (item: NavItem) => boolean;
  /** Whether the collapsed flyout currently shows the children of the item. */
  isFlyoutItemActive: (item: NavItem) => boolean;
  /**
   * Makes the top-level items of a section known to the navigation, which needs the complete
   * list to find the branch owning the current route. Returns the matching unregister function.
   */
  registerItems: (items: Ref<NavItem[]>) => () => void;
  onItemHover: (item: NavItem, target: HTMLElement) => void;
  onBranchToggle: (item: NavItem, open: boolean) => void;
  onFlyoutFocusRequest: () => void;
  onFlyoutCloseRequest: () => void;
  onFlyoutNavigate: (disclosesChildren: boolean) => void;
  onLinkClick: (item: NavItem) => void;
}

export const NAV_CONTEXT: InjectionKey<NavContext> = Symbol("mt-nav");
