/**
 * Which sidebar entry is active, derived from the resolved `route.matched` chain.
 */

import type { SidebarRoute, SidebarRouter } from "../mt-sidebar.types";

type SidebarEntryLike = {
  id?: string;
  path?: string;
  params?: Record<string, unknown>;
  children?: SidebarEntryLike[];
};

/**
 * Stand-in for a missing `parentPath`: the menu entries the route's own module contributes.
 *
 * Extensions cannot be asked to declare `parentPath` retroactively, so an ambiguous set is used as-is
 * and highlights the module's entries. Core modules declare it, so there the ambiguity is declined.
 */
function ownModuleMenuPaths(route: SidebarRoute | undefined, activeNames: Set<string>): string[] {
  const module = route?.meta?.$module;
  const menuPaths = (module?.navigation ?? [])
    .map((entry) => entry.path)
    .filter((path): path is string => !!path);

  if (menuPaths.some((path) => activeNames.has(path))) {
    return [];
  }

  if (menuPaths.length > 1 && module?.type === "core") {
    return [];
  }

  return menuPaths;
}

/**
 * Route names counting as "current": the `matched` chain plus everything reachable via `parentPath`.
 */
export function getActiveRouteNames(route?: SidebarRoute, router?: SidebarRouter): Set<string> {
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
  // An explicit `parentPath` wins; the module's own entries fill in for routes that declare none.
  const pending = route?.meta?.parentPath
    ? [route.meta.parentPath]
    : ownModuleMenuPaths(route, names);

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
 * App, SDK and custom entity entries share a route name and differ only by params, so compare the
 * params the entry declares. Entries without params always match.
 */
export function entryParamsMatchRoute(entry?: SidebarEntryLike, route?: SidebarRoute): boolean {
  if (!entry?.params) {
    return true;
  }

  const entryParams = entry.params;

  return Object.keys(entryParams).every(
    (key) => String(route?.params?.[key]) === String(entryParams[key]),
  );
}

/**
 * Whether the entry's own route is active, or for path-less grouping entries the descendant's.
 */
export function isEntryOnActiveRoute(
  entry?: SidebarEntryLike,
  route?: SidebarRoute,
  activeNames: Set<string> = getActiveRouteNames(route),
): boolean {
  if (entry?.path && activeNames.has(entry.path) && entryParamsMatchRoute(entry, route)) {
    return true;
  }

  return (entry?.children ?? []).some((child) => isEntryOnActiveRoute(child, route, activeNames));
}
