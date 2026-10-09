import { computed, getCurrentInstance, onBeforeUnmount, onMounted, type ComputedRef } from "vue";

export interface RouteLike {
  path: string;
  hash: string;
  meta?: Record<string, unknown>;
}

/** The part of a Vue Router instance that the shell uses. */
interface RouterLike {
  currentRoute: { value: RouteLike };
  beforeEach(guard: () => void): () => void;
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
