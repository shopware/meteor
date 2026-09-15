import type { Component } from "vue";

/**
 * A single navigation item as passed to `mt-nav-section`.
 *
 * Items form a tree: `children` holds the items nested below, in the order they are shown.
 * The navigation supports up to three levels of nesting.
 * Labels must already be translated. Pass only the items the current user may see.
 */
export interface NavItem {
  /** Unique identifier. Falls back to `path` when omitted. */
  id?: string;
  /** Route name the item navigates to. Optional for grouping items and external links. */
  path?: string;
  /** Translated label. */
  label: string;
  /** Nested items, shown in the given order. */
  children?: NavItem[];
  /** Icon name of the meteor icon kit, e.g. `regular-products`. Top level only. */
  icon?: string;
  /** Route params, e.g. to disambiguate items sharing a route name. */
  params?: Record<string, unknown>;
  /** External URL. Rendered as a plain anchor when no `path` is set. */
  link?: string;
  /** Anchor target for `link`. */
  target?: string;
  /** Free-form type, rendered as a class for styling hooks. */
  moduleType?: string;
}

/**
 * Minimal shape of the current route, compatible with a Vue Router `RouteLocationNormalized`.
 */
export interface NavRoute {
  name?: string;
  path?: string;
  params?: Record<string, unknown>;
  matched?: Array<{ name?: string }>;
  meta?: NavRouteMeta;
}

export interface NavRouteMeta {
  /** Route name of the navigation item that owns this (detail) route. */
  parentPath?: string;
  /** Written by the Shopware Administration for every module route. */
  $module?: {
    type?: string;
    navigation?: Array<{ path?: string }>;
  };
  [key: string]: unknown;
}

/**
 * Minimal shape of the router, compatible with a Vue Router instance.
 */
export interface NavRouter {
  getRoutes?: () => Array<{ name?: string | symbol | null; meta?: NavRouteMeta }>;
}

export type NavLinkComponent = string | Component;
