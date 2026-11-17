import { inject, type Component, type ComputedRef, type InjectionKey } from "vue";

/**
 * Component rendering the navigation links, e.g. `router-link`. Receives the target as `to`.
 */
export type NavLinkComponent = string | Component;

/**
 * Route location handed to the link component, e.g. a Vue Router `RouteLocationRaw`.
 */
export type NavLinkTarget = string | object;

/**
 * Tells whether an item is the current page, e.g. by comparing its route with the current route.
 */
export type NavActiveMatcher = (item: NavItem) => boolean;

/**
 * Direction the top-level items run in. Horizontal items open their nested items in a floating
 * panel.
 */
export type NavOrientation = "vertical" | "horizontal";

interface NavItemBase {
  /** Stable identifier of the item. Siblings need distinct ids; without one, the label is used. */
  id?: string;
  /** Translated label of the item. */
  label: string;
  /** Icon name of the meteor icon kit, e.g. `regular-products`. Shown on top-level items only. */
  icon?: string;
  /** Whether the item is the current page. Its ancestors open and highlight accordingly. Alternative to `isActive` on `mt-nav`. */
  active?: boolean;
}

/**
 * An item linking to a page, or an item with only a label.
 */
interface NavLinkItem extends NavItemBase {
  /** Route location handed to the link component as `to`. */
  to?: NavLinkTarget;
  /** External URL, rendered as a plain anchor when no `to` is set. */
  href?: string;
  /** Anchor target for `href`. */
  target?: string;
  children?: never;
}

/**
 * An item holding nested items, which it opens and closes. It isn't a link itself.
 */
interface NavGroupItem extends NavItemBase {
  /** Nested items. */
  children: NavItem[];
  to?: never;
  href?: never;
  target?: never;
}

/**
 * One item of the navigation: either a link or a group of nested items, never both. Items nest up
 * to three levels deep in total.
 */
export type NavItem = NavLinkItem | NavGroupItem;

/**
 * A group of items below an optional header.
 */
export interface NavSection {
  header?: string;
  items: NavItem[];
}

/**
 * The navigation supports at most this many levels; deeper items are leaf items only.
 */
export const MAX_NESTING_LEVEL = 3;

export function isRowActive(item: NavItem, isActive?: NavActiveMatcher): boolean {
  // Tells whether the item itself is active, through its own flag or the navigation's matcher
  return !!item.active || (isActive?.(item) ?? false);
}

export function isItemActive(item: NavItem, isActive?: NavActiveMatcher): boolean {
  // Tells whether the item itself or one of its descendants is active
  return (
    isRowActive(item, isActive) ||
    (item.children?.some((child) => isItemActive(child, isActive)) ?? false)
  );
}

export function hasNestedItems(item: NavItem): boolean {
  // Tells whether the item has items to nest below it
  return (item.children?.length ?? 0) > 0;
}

export function itemKey(item: NavItem): string {
  // Identifies an item among its siblings, by its id or, without one, its label
  return item.id ?? item.label;
}

export function branchKey(sectionIndex: number, item: NavItem): string {
  // Identifies a top-level item across sections, for the open state the navigation keeps
  return `${sectionIndex}/${itemKey(item)}`;
}

/**
 * Slots of `mt-nav`.
 */
export interface NavSlots {
  /** Rendered after the label of every item, e.g. for a badge or counter. */
  suffix?: (props: { item: NavItem }) => unknown;
}

/**
 * Shared state of `mt-nav`, provided to the internal sections and items.
 */
export interface NavContext {
  linkComponent: ComputedRef<NavLinkComponent>;
  orientation: ComputedRef<NavOrientation>;
  /** Tells whether the item itself is active. */
  isRowActive: (item: NavItem) => boolean;
  /** Tells whether the item itself or one of its descendants is active. */
  isItemActive: (item: NavItem) => boolean;
  /** The slots of `mt-nav`, so an item can render the `suffix` slot for itself. */
  slots: Readonly<NavSlots>;
  /** Whether the top-level item with the given key is open. The navigation owns this state. */
  isBranchExpanded: (key: string) => boolean;
  /** Reports the user toggling a top-level item. */
  onBranchToggle: (key: string, open: boolean) => void;
  /** Whether the floating panel of the top-level item with the given key is open. Only one is open at a time. */
  isFlyoutOpen: (key: string) => boolean;
  /** Opens or closes the floating panel of a top-level item. Opening one closes any other. */
  onFlyoutToggle: (key: string, open: boolean) => void;
  /** Whether the open floating panel replaced another one, so it slides in sideways instead. */
  flyoutSwitched: ComputedRef<boolean>;
  onNavigate: (item: NavItem) => void;
}

export const NAV_CONTEXT: InjectionKey<NavContext> = Symbol("mt-nav");

export function useNavContext(): NavContext {
  // Returns the state of the surrounding mt-nav, or throws if rendered outside one
  const context = inject(NAV_CONTEXT, null);

  if (!context) {
    throw new Error("mt-nav items must be rendered inside mt-nav");
  }

  return context;
}
