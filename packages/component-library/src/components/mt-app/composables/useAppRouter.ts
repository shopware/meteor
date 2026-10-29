import { computed, getCurrentInstance, onBeforeUnmount, onMounted, type ComputedRef } from "vue";

export interface RouteLike {
  path: string;
  hash: string;
  meta?: Record<string, unknown>;
  params?: Record<string, unknown>;
  /** The route records of the route, from the root to the deepest child. */
  matched?: RouteRecordLike[];
}

/** The part of a Vue Router route record that the shell uses. */
export interface RouteRecordLike {
  path: string;
  /** The component instances that the record renders, by view name. */
  instances?: Record<string, unknown>;
}

/** What a navigation guard returns: `false` cancels the navigation. */
export type RouteGuardResult = boolean | void | Promise<boolean | void>;

/** The part of a Vue Router instance that the shell uses. */
interface RouterLike {
  currentRoute: { value: RouteLike };
  options: { history: { state: Record<string, unknown> } };
  back(): void;
  push(to: unknown): Promise<unknown>;
  beforeEach(guard: (to: RouteLike, from: RouteLike) => RouteGuardResult): () => void;
  afterEach(hook: (to: RouteLike, from: RouteLike, failure?: unknown) => void): () => void;
  onError(handler: () => void): () => void;
}

/** Vue Router's `NavigationFailureType.duplicated`: a link to the route that is already shown. */
const DUPLICATED_NAVIGATION = 16;

/**
 * The Vue Router that the app installed as `$router`, if any. The library doesn't depend on Vue
 * Router, so the router is only used through the few methods that the shell needs.
 */
function findRouter(): Partial<RouterLike> | undefined {
  return getCurrentInstance()?.appContext.config.globalProperties.$router as
    | Partial<RouterLike>
    | undefined;
}

export interface UseRouteChangeOptions {
  /** Called when a navigation starts. */
  onStart?(): void;
  /** Called when a navigation ends, whether it completed, failed or was cancelled. */
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
      router.beforeEach?.(() => onStart?.()),
      router.afterEach((to, from, failure) => {
        onEnd?.();

        const isDuplicated =
          (failure as { type?: unknown } | undefined)?.type === DUPLICATED_NAVIGATION;
        if (!failure || isDuplicated) onNavigate?.(to, from);
      }),
      router.onError?.(() => onEnd?.()),
    ].filter((stop): stop is () => void => typeof stop === "function");
  });

  onBeforeUnmount(() => {
    unsubscribe.forEach((stop) => stop());
    unsubscribe = [];
  });
}

/** The meta of the current route, which updates as soon as a navigation is confirmed. `{}` without a router. */
export function useRouteMeta(): ComputedRef<Record<string, unknown>> {
  const router = findRouter();

  return computed(() => router?.currentRoute?.value?.meta ?? {});
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
