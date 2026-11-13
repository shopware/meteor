import {
  computed,
  getCurrentInstance,
  onBeforeUnmount,
  onMounted,
  shallowRef,
  type ComponentInternalInstance,
  type ComputedRef,
} from "vue";
import { defaultWindow, useEventListener } from "@vueuse/core";

/** The part of a Vue Router route that the library uses. */
export interface RouteLike {
  path: string;
  hash: string;
  /** The path with the query and the hash. */
  fullPath?: string;
  params?: Record<string, unknown>;
  /** The route records of the route, from the root to the deepest child. */
  matched?: RouteRecordLike[];
}

/** The part of a Vue Router route record that the library uses. */
export interface RouteRecordLike {
  path: string;
  meta?: Record<string, unknown>;
  /** The component instances that the record renders, by view name. */
  instances?: Record<string, unknown>;
}

/** What a navigation guard returns: `false` cancels the navigation. */
export type RouteGuardResult = boolean | void | Promise<boolean | void>;

/** The part of a Vue Router instance that the library uses. */
interface RouterLike {
  currentRoute: { value: RouteLike };
  options: { history: { state: Record<string, unknown> } };
  back(): void;
  push(to: unknown): Promise<unknown>;
  resolve(to: unknown): { fullPath: string };
  beforeEach(guard: (to: RouteLike, from: RouteLike) => RouteGuardResult): () => void;
  afterEach(hook: (to: RouteLike, from: RouteLike, failure?: unknown) => void): () => void;
  onError(handler: (error: unknown) => void): () => void;
}

// Vue Router's `NavigationFailureType` values. The library doesn't depend on Vue Router.
const CANCELLED_NAVIGATION = 8;
const DUPLICATED_NAVIGATION = 16;

/**
 * The Vue Router that the app installed as `$router`, if any. The library doesn't depend on Vue
 * Router, so the router is only used through the few methods it needs.
 */
function findRouter(): Partial<RouterLike> | undefined {
  return getCurrentInstance()?.appContext.config.globalProperties.$router as
    | Partial<RouterLike>
    | undefined;
}

export interface UseRouteChangeOptions {
  /** Called when a navigation starts. */
  onStart?(): void;
  /**
   * Called when a navigation ends: it completed, failed or was aborted. Not called for a
   * navigation that a newer one cancelled, which ends the loading itself.
   */
  onEnd?(): void;
  /** Called after a completed navigation, and after a link to the route that is already shown. */
  onNavigate?(to: RouteLike, from: RouteLike): void;
}

/** Follows the navigations of the app's Vue Router. Does nothing without one. */
export function useRouteChange({ onStart, onEnd, onNavigate }: UseRouteChangeOptions): void {
  const router = findRouter();
  let unsubscribe: (() => void)[] = [];

  onMounted(() => {
    if (typeof router?.afterEach !== "function") return;

    unsubscribe = [
      onStart && router.beforeEach?.(() => onStart()),
      (onEnd || onNavigate) &&
        router.afterEach((to, from, failure) => {
          const type = (failure as { type?: unknown } | undefined)?.type;

          if (type !== CANCELLED_NAVIGATION) onEnd?.();
          if (!failure || type === DUPLICATED_NAVIGATION) onNavigate?.(to, from);
        }),
      // Vue Router stops logging navigation errors as soon as a handler exists.
      onEnd &&
        router.onError?.((error) => {
          onEnd();
          console.error(error);
        }),
    ].filter((stop): stop is () => void => typeof stop === "function");
  });

  onBeforeUnmount(() => {
    unsubscribe.forEach((stop) => stop());
    unsubscribe = [];
  });
}

/**
 * Runs the guard before every navigation of the app's Vue Router, which a `false` result cancels.
 * Does nothing without a router.
 */
export function useRouteGuard(guard: (to: RouteLike, from: RouteLike) => RouteGuardResult): void {
  const router = findRouter();
  let stop: (() => void) | undefined;

  onMounted(() => {
    if (typeof router?.beforeEach === "function") stop = router.beforeEach(guard);
  });

  onBeforeUnmount(() => {
    stop?.();
    stop = undefined;
  });
}

/**
 * The meta of the route records that the current route matches, from the root to the deepest child.
 * It updates as soon as a navigation is confirmed. Empty without a router.
 */
export function useMatchedRouteMeta(): ComputedRef<Record<string, unknown>[]> {
  const router = findRouter();

  return computed(
    () => router?.currentRoute?.value?.matched?.map((record) => record.meta ?? {}) ?? [],
  );
}

/** The route record that renders the component: the deepest one that renders it or an ancestor. */
export function findRenderingRecord(
  component: ComponentInternalInstance,
  matched: RouteRecordLike[],
): RouteRecordLike | undefined {
  const lineage = new Set<ComponentInternalInstance>();

  for (
    let ancestor: ComponentInternalInstance | null = component;
    ancestor;
    ancestor = ancestor.parent
  ) {
    lineage.add(ancestor);
  }

  // A record keeps the public instances it renders. `$` leads back to the internal instance, also
  // for the closed instances of `<script setup>` components.
  const isInLineage = (instance: unknown) => {
    const internal = (instance as { $?: ComponentInternalInstance } | null)?.$;
    return internal !== undefined && lineage.has(internal);
  };

  return [...matched]
    .reverse()
    .find((record) => Object.values(record.instances ?? {}).some(isInLineage));
}

/**
 * Returns a function that tells the path of the route record that renders the calling component,
 * such as `/orders/:id`: the kind of page, not one of its URLs. Without a record that renders it,
 * the deepest record of the current route counts. Call the function once the component has
 * mounted, when the router knows the component. `undefined` without a router.
 */
export function useRenderingRoutePath(): () => string | undefined {
  const component = getCurrentInstance();
  const router = findRouter();

  return () => {
    const matched = router?.currentRoute?.value?.matched ?? [];

    return ((component && findRenderingRecord(component, matched)) ?? matched.at(-1))?.path;
  };
}

/**
 * Returns a function that goes back to the previous page of the app's Vue Router, or to the
 * fallback when the app has none, for example when the page was opened directly. The returned
 * function does nothing without a router.
 */
export function useRouterBack(): (fallback: unknown) => void {
  const router = findRouter();

  return (fallback) => {
    if (typeof router?.push !== "function") return;

    // Vue Router keeps the previous location of the app in the history state.
    if (router.options?.history?.state?.back && typeof router.back === "function") router.back();
    else void router.push(fallback);
  };
}

/**
 * Shows a new page in a scroll area from its top, or from the element of its URL hash, as browsers
 * do for a window.
 */
export function scrollToRoute(scrollArea: HTMLElement | null, to: RouteLike, from: RouteLike) {
  if (!scrollArea) return;

  const target = to.hash ? document.getElementById(to.hash.slice(1)) : null;

  if (target && scrollArea.contains(target)) target.scrollIntoView();
  else if (to.path !== from.path) scrollArea.scrollTop = 0;
}

/** A link of a component: a route location for Vue Router, or a URL. */
export interface LinkTarget {
  to?: unknown;
  href?: string;
}

/**
 * Returns a function that tells how closely a link points to the current page: `-1` when it
 * doesn't, otherwise a higher number for a more specific link. A link points to its own page and to
 * the pages below it, `/` only to itself, and the query and hash of the link have to match. The
 * current page is the route of the app's Vue Router, or the browser's address without one, which
 * is known once the component has mounted.
 */
export function useLinkMatch(): (link: LinkTarget) => number {
  const router = findRouter();
  const browserUrl = shallowRef<string>();

  if (!router?.currentRoute) {
    const update = () => {
      browserUrl.value = defaultWindow?.location.href;
    };

    onMounted(update);
    useEventListener(defaultWindow, ["popstate", "hashchange"], update);
    // Also follows other routers, which change the address with `history.pushState()`.
    useEventListener(
      () => (defaultWindow as { navigation?: EventTarget } | undefined)?.navigation,
      "currententrychange",
      update,
    );
  }

  const currentUrl = computed(() => {
    const url = router?.currentRoute?.value.fullPath ?? browserUrl.value;

    return url === undefined ? undefined : new URL(url, "http://localhost");
  });

  return ({ to, href }) => {
    const target =
      to !== undefined && typeof router?.resolve === "function"
        ? router.resolve(to).fullPath
        : href ?? to;

    if (!currentUrl.value || typeof target !== "string" || target.startsWith("#")) return -1;

    return matchScore(new URL(target, currentUrl.value), currentUrl.value);
  };
}

function matchScore(link: URL, current: URL) {
  const path = link.pathname.replace(/\/+$/, "");
  const currentPath = current.pathname.replace(/\/+$/, "");
  const isOnPath = currentPath === path || (path !== "" && currentPath.startsWith(`${path}/`));
  const hasQuery = [...link.searchParams].every(([key, value]) =>
    current.searchParams.getAll(key).includes(value),
  );

  if (link.origin !== current.origin || !isOnPath || !hasQuery) return -1;
  if (link.hash && link.hash !== current.hash) return -1;

  return path.length + link.search.length + link.hash.length;
}
