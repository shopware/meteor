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
 * Tells whether a row is the current page, e.g. by comparing its route with the current route.
 */
export type NavActiveMatcher = (item: NavItem) => boolean;

/**
 * Direction the top-level rows run in. Horizontal rows open their nested rows in a floating panel.
 */
export type NavOrientation = "vertical" | "horizontal";

/**
 * One row of the navigation. Rows nest through `children`, up to three levels deep in total.
 */
export interface NavItem {
  /** Stable identifier of the row. Siblings need distinct ids; without one, the label is used. */
  id?: string;
  /** Translated label of the row. */
  label: string;
  /** Icon name of the meteor icon kit, e.g. `regular-products`. Shown on top-level rows only. */
  icon?: string;
  /** Route location handed to the link component as `to`. */
  to?: NavLinkTarget;
  /** External URL, rendered as a plain anchor when no `to` is set. */
  href?: string;
  /** Anchor target for `href`. */
  target?: string;
  /** Whether the row is the current page. Its ancestors open and highlight accordingly. Alternative to `isActive` on `mt-nav`. */
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

export function isRowActive(item: NavItem, isActive?: NavActiveMatcher): boolean {
  // Tells whether the row itself is active, through its own flag or the navigation's matcher
  return !!item.active || (isActive?.(item) ?? false);
}

export function isItemActive(item: NavItem, isActive?: NavActiveMatcher): boolean {
  // Tells whether the row itself or one of its descendants is active
  return (
    isRowActive(item, isActive) ||
    (item.children?.some((child) => isItemActive(child, isActive)) ?? false)
  );
}

export function hasNestedItems(item: NavItem): boolean {
  // Tells whether the row has rows to nest below it
  return (item.children?.length ?? 0) > 0;
}

export function itemKey(item: NavItem): string {
  // Identifies a row among its siblings, by its id or, without one, its label
  return item.id ?? item.label;
}

export function branchKey(sectionIndex: number, item: NavItem): string {
  // Identifies a top-level row across sections, for the open state the navigation keeps
  return `${sectionIndex}/${itemKey(item)}`;
}

export function focusableLinks(container: HTMLElement): HTMLElement[] {
  // Lists the visible links in the container; label-only rows render as a span and can't take focus
  return Array.from(container.querySelectorAll<HTMLElement>(".mt-nav__link")).filter(
    (link) => link.tabIndex >= 0 && !link.closest("[hidden]"),
  );
}

export function moveLinkFocus(
  container: HTMLElement,
  event: KeyboardEvent,
  keys: { next: string; previous: string },
): void {
  // Moves focus between the visible links in the container with the given keys, Home and End, without wrapping
  const target = event.target;

  // Keys pressed inside slotted content, e.g. a button in a suffix, keep their meaning
  if (!(target instanceof HTMLElement) || !target.matches(".mt-nav__link")) {
    return;
  }

  const links = focusableLinks(container);
  const currentIndex = links.indexOf(target);
  let nextIndex: number;

  switch (event.key) {
    case keys.next:
      nextIndex = Math.min(currentIndex + 1, links.length - 1);
      break;
    case keys.previous:
      nextIndex = Math.max(currentIndex - 1, 0);
      break;
    case "Home":
      nextIndex = 0;
      break;
    case "End":
      nextIndex = links.length - 1;
      break;
    default:
      return;
  }

  event.preventDefault();
  links[nextIndex]?.focus();
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
  orientation: ComputedRef<NavOrientation>;
  /** Tells whether the row itself is active. */
  isRowActive: (item: NavItem) => boolean;
  /** Tells whether the row itself or one of its descendants is active. */
  isItemActive: (item: NavItem) => boolean;
  /** The slots of `mt-nav`, so a row can render the `suffix` slot for itself. */
  slots: Readonly<NavSlots>;
  /** Whether the top-level row with the given key is open. The navigation owns this state. */
  isBranchExpanded: (key: string) => boolean;
  /** Reports the user toggling a top-level row. */
  onBranchToggle: (key: string, open: boolean) => void;
  /** Whether the floating panel of the top-level row with the given key is open. Only one is open at a time. */
  isFlyoutOpen: (key: string) => boolean;
  /** Opens or closes the floating panel of a top-level row. Opening one closes any other. */
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
    throw new Error("mt-nav rows must be rendered inside mt-nav");
  }

  return context;
}
