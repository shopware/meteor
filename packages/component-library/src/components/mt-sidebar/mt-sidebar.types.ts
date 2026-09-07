import type { Component } from "vue";

/**
 * A single navigation entry as passed to `mt-sidebar`.
 *
 * Entries form a flat list: `parent` names the `id` (or `path`) of the entry it nests under.
 * The menu builds the tree itself and supports up to three levels of nesting.
 * Labels must already be translated. Pass only the entries the current user may see.
 */
export interface SidebarEntry {
  /** Unique identifier. Falls back to `path` when omitted. */
  id?: string;
  /** Route name the entry navigates to. Optional for grouping entries and external links. */
  path?: string;
  /** Translated label. */
  label: string;
  /** `id` (or `path`) of the parent entry. Omit for top-level entries. */
  parent?: string;
  /** Sort order among siblings. */
  position?: number;
  /** Icon name of the meteor icon kit, e.g. `regular-products`. Top level only. */
  icon?: string;
  /** Module color used for the icon when `moduleIconColors` is enabled. */
  color?: string;
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
 * A menu entry with its resolved tree position.
 */
export interface SidebarTreeEntry extends SidebarEntry {
  level: number;
  children: SidebarTreeEntry[];
}

/**
 * Minimal shape of the current route, compatible with a Vue Router `RouteLocationNormalized`.
 */
export interface SidebarRoute {
  name?: string;
  path?: string;
  params?: Record<string, unknown>;
  matched?: Array<{ name?: string }>;
  meta?: SidebarRouteMeta;
}

export interface SidebarRouteMeta {
  /** Route name of the menu entry that owns this (detail) route. */
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
export interface SidebarRouter {
  getRoutes?: () => Array<{ name?: string | symbol | null; meta?: SidebarRouteMeta }>;
}

export interface SidebarUser {
  firstName?: string;
  lastName?: string;
  /** Role or title shown below the name, e.g. "Administrator". */
  title?: string;
  avatarUrl?: string;
}

export type SidebarLinkComponent = string | Component;
