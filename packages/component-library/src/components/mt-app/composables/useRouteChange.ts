import { getCurrentInstance, onBeforeUnmount, onMounted } from "vue";

export interface RouteLike {
  path: string;
  hash: string;
}

/** The part of a Vue Router instance that the shell uses. */
interface RouterLike {
  afterEach(hook: (to: RouteLike, from: RouteLike, failure?: unknown) => void): () => void;
}

/** Vue Router's `NavigationFailureType.duplicated`: a link to the route that is already shown. */
const DUPLICATED_NAVIGATION = 16;

/**
 * Calls `onRouteChange` after every completed navigation of the app's Vue Router, and after a link
 * to the route that is already shown. The library doesn't depend on Vue Router: it uses the router
 * that the app installed as `$router`, and does nothing without one.
 */
export function useRouteChange(onRouteChange: (to: RouteLike, from: RouteLike) => void): void {
  const instance = getCurrentInstance();
  let stop: (() => void) | undefined;

  onMounted(() => {
    const router = instance?.appContext.config.globalProperties.$router as
      | Partial<RouterLike>
      | undefined;
    if (typeof router?.afterEach !== "function") return;

    stop = router.afterEach((to, from, failure) => {
      const isDuplicated =
        (failure as { type?: unknown } | undefined)?.type === DUPLICATED_NAVIGATION;
      if (!failure || isDuplicated) onRouteChange(to, from);
    });
  });

  onBeforeUnmount(() => stop?.());
}
