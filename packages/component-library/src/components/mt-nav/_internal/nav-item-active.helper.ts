/**
 * Which navigation item is active, derived from the resolved `route.matched` chain.
 */

import type { NavRoute, NavRouter } from "../mt-nav.types";

type NavItemLike = {
  id?: string;
  path?: string;
  params?: Record<string, unknown>;
  children?: NavItemLike[];
};

/**
 * Route names counting as "current": the `matched` chain plus everything reachable via `parentPath`.
 */
export function getActiveRouteNames(route?: NavRoute, router?: NavRouter): Set<string> {
  const names = new Set<string>();

  (route?.matched ?? []).forEach((record) => {
    if (record.name) {
      names.add(record.name);
    }
  });

  if (route?.name) {
    names.add(route.name);
  }

  const findRoute = (name: string) =>
    router?.getRoutes?.().find((candidate) => candidate.name === name) ?? null;
  const visited = new Set<string>();
  const pending = route?.meta?.parentPath ? [route.meta.parentPath] : [];

  while (pending.length) {
    const parentPath = pending.shift() as string;

    if (visited.has(parentPath)) {
      continue;
    }

    visited.add(parentPath);
    names.add(parentPath);

    const grandParentPath = findRoute(parentPath)?.meta?.parentPath;

    if (grandParentPath) {
      pending.push(grandParentPath);
    }
  }

  return names;
}

/**
 * Items sharing a route name differ only by params, so compare the params the item declares.
 * Items without params always match.
 */
export function itemParamsMatchRoute(item?: NavItemLike, route?: NavRoute): boolean {
  if (!item?.params) {
    return true;
  }

  const itemParams = item.params;

  return Object.keys(itemParams).every(
    (key) => String(route?.params?.[key]) === String(itemParams[key]),
  );
}

/**
 * Whether the item's own route is active, or for path-less grouping items the descendant's.
 */
export function isItemOnActiveRoute(
  item?: NavItemLike,
  route?: NavRoute,
  activeNames: Set<string> = getActiveRouteNames(route),
): boolean {
  if (item?.path && activeNames.has(item.path) && itemParamsMatchRoute(item, route)) {
    return true;
  }

  return (item?.children ?? []).some((child) => isItemOnActiveRoute(child, route, activeNames));
}
