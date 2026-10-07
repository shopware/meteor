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
 * One row of the navigation. Rows nest through `children`, up to three levels deep in total.
 */
export interface NavItem {
  /** Translated label of the row. Siblings need distinct labels. */
  label: string;
  /** Icon name of the meteor icon kit, e.g. `regular-products`. Shown on top-level rows only. */
  icon?: string;
  /** Route location handed to the link component as `to`. */
  to?: NavLinkTarget;
  /** External URL, rendered as a plain anchor when no `to` is set. */
  href?: string;
  /** Anchor target for `href`. */
  target?: string;
  /** Whether the row is the current page. Its ancestors open and highlight accordingly. */
  active?: boolean;
  /** Nested rows. A row with nested rows and no `to` renders as a button toggling them. */
  children?: NavItem[];
}

/**
 * A group of rows below an optional header.
 */
export interface NavSection {
  header?: string;
  items: NavItem[];
}

/**
 * The navigation supports at most this many levels; deeper rows are leaf items only.
 */
export const MAX_NESTING_LEVEL = 3;

export function isItemActive(item: NavItem): boolean {
  // Tells whether the row itself or one of its descendants is active
  return !!item.active || (item.children?.some(isItemActive) ?? false);
}

export function hasNestedItems(item: NavItem): boolean {
  // Tells whether the row has rows to nest below it
  return (item.children?.length ?? 0) > 0;
}

export function branchKey(sectionIndex: number, item: NavItem): string {
  // Identifies a top-level row across sections, for the open state the navigation keeps
  return `${sectionIndex}/${item.label}`;
}

/**
 * Slots of `mt-nav`.
 */
export interface NavSlots {
  /** Rendered after the label of every row, e.g. for a badge or counter. */
  suffix?: (props: { item: NavItem }) => unknown;
}

/**
 * Shared state of `mt-nav`, provided to the internal sections and rows.
 */
export interface NavContext {
  linkComponent: ComputedRef<NavLinkComponent>;
  /** The slots of `mt-nav`, so a row can render the `suffix` slot for itself. */
  slots: Readonly<NavSlots>;
  /** Whether the top-level row with the given key is open. The navigation owns this state. */
  isBranchExpanded: (key: string) => boolean;
  /** Reports the user toggling a top-level row. */
  onBranchToggle: (key: string, open: boolean) => void;
  onNavigate: (item: NavItem) => void;
}

export const NAV_CONTEXT: InjectionKey<NavContext> = Symbol("mt-nav");

export function useNavContext(): NavContext {
  // Returns the state of the surrounding mt-nav, or throws if rendered outside one
  const context = inject(NAV_CONTEXT, null);

  if (!context) {
    throw new Error("mt-nav rows must be rendered inside mt-nav");
  }

  return context;
}
