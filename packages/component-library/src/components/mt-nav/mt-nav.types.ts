import type { Component } from "vue";

/**
 * A single navigation entry as passed to `mt-nav`.
 *
 * Entries form a tree: `children` holds the entries nested below, in the order they are shown.
 * The navigation supports up to three levels of nesting.
 * Labels must already be translated. Pass only the entries the current user may see.
 */
export interface NavEntry {
  /** Unique identifier. Falls back to `path` when omitted. */
  id?: string;
  /** Route name the entry navigates to. Optional for grouping entries and external links. */
  path?: string;
  /** Translated label. */
  label: string;
  /** Nested entries, shown in the given order. */
  children?: NavEntry[];
  /** Icon name of the meteor icon kit, e.g. `regular-products`. Top level only. */
  icon?: string;
  /** Route params, e.g. to disambiguate entries sharing a route name. */
  params?: Record<string, unknown>;
  /** External URL. Rendered as a plain anchor when no `path` is set. */
  link?: string;
  /** Anchor target for `link`. */
  target?: string;
  /** Free-form type, rendered as a class for styling hooks. */
  moduleType?: string;
}

/**
 * A group of entries rendered as one list, optionally below a header.
 */
export interface NavSection {
  /** Unique identifier, used as the render key. Falls back to `header`. */
  id?: string;
  /** Translated heading above the entries. Hidden while the navigation is collapsed. */
  header?: string;
  /** Top level entries of the section, shown in the given order. */
  entries: NavEntry[];
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
  /** Route name of the navigation entry that owns this (detail) route. */
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
