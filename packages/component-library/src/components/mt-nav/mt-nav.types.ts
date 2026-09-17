import type { Component } from "vue";

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
