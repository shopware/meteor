import { inject, type Component, type ComputedRef, type InjectionKey } from "vue";

/**
 * Component rendering the navigation links, e.g. `router-link`. Receives the target as `to`.
 */
export type NavLinkComponent = string | Component;

/**
 * Route location handed to the link component, e.g. a Vue Router `RouteLocationRaw`.
 */
export type NavLinkTarget = string | Record<string, unknown>;

/**
 * Payload of the `navigate` event of `mt-nav`, describing the clicked item.
 */
export interface NavNavigateEvent {
  label: string;
  to?: NavLinkTarget;
  href?: string;
}

/**
 * What a top-level row tells the navigation about itself, so the navigation can open the branch
 * owning the active item and keep only one branch open.
 */
export interface NavBranchRegistration {
  key: string;
  hasChildren: ComputedRef<boolean>;
  /** Whether the row itself or one of its descendants is active. */
  isActive: ComputedRef<boolean>;
  /** Key of the nested row that is active or holds the active row, so a move inside the branch is noticed. */
  activeChildKey: ComputedRef<string | null>;
}

/**
 * Shared state of `mt-nav`, provided to the sections and rows slotted into it.
 */
export interface NavContext {
  linkComponent: ComputedRef<NavLinkComponent>;
  /** Whether the top-level row with the given key is open. The navigation owns this state. */
  isBranchExpanded: (key: string) => boolean;
  /** Registers a top-level row. Returns the matching unregister function. */
  registerBranch: (registration: NavBranchRegistration) => () => void;
  /** Reports the user toggling a top-level row. */
  onBranchToggle: (key: string, open: boolean) => void;
  onLinkClick: (event: NavNavigateEvent) => void;
}

/**
 * Provided by every row to the rows nested inside it.
 */
export interface NavItemContext {
  /** Nesting depth of the providing row, starting at 1 for the top level. */
  depth: number;
  /** Lets a nested row report whether it, or one of its descendants, is active. */
  reportActive: (key: string, active: boolean) => void;
}

export const NAV_CONTEXT: InjectionKey<NavContext> = Symbol("mt-nav");

export const NAV_ITEM_CONTEXT: InjectionKey<NavItemContext> = Symbol("mt-nav-item");

export function useNavContext(component: string): NavContext {
  // Returns the state of the surrounding mt-nav, or throws if the component is rendered outside one
  const context = inject(NAV_CONTEXT, null);

  if (!context) {
    throw new Error(`${component} must be rendered inside mt-nav`);
  }

  return context;
}
