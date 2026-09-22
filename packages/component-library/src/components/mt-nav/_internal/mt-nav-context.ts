import type { ComputedRef, InjectionKey } from "vue";
import type { NavLinkComponent, NavNavigateEvent } from "../mt-nav.types";

/**
 * What a top-level row tells the navigation about itself, so the navigation can open the branch
 * owning the active item and keep only one branch open.
 */
export interface NavBranchRegistration {
  key: string;
  hasChildren: ComputedRef<boolean>;
  /** Whether the row itself or one of its descendants is active. */
  isActive: ComputedRef<boolean>;
}

/**
 * Shared state of `mt-nav`, provided to the sections and rows slotted into it.
 */
export interface NavContext {
  linkComponent: ComputedRef<NavLinkComponent>;
  /** Whether any top-level branch is expanded, in which case the active item stops keeping folders open. */
  hasExpandedBranches: ComputedRef<boolean>;
  isBranchExpanded: (key: string) => boolean;
  /** Registers a top-level row. Returns the matching unregister function. */
  registerBranch: (registration: NavBranchRegistration) => () => void;
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
