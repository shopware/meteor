import { getCurrentInstance, nextTick, onBeforeUnmount, onMounted, type Ref } from "vue";
import { useEventListener } from "@vueuse/core";

interface RouteLike {
  path: string;
  hash: string;
}

/** The part of a vue-router instance the shell uses. */
interface RouterLike {
  beforeEach(guard: () => void): () => void;
  afterEach(hook: (to: RouteLike, from: RouteLike, failure?: unknown) => void): () => void;
  options: { history: { listen(callback: () => void): () => void } };
}

function isRouterLike(value: unknown): value is RouterLike {
  const router = value as Partial<RouterLike> | undefined;

  return (
    typeof router?.beforeEach === "function" &&
    typeof router.afterEach === "function" &&
    typeof router.options?.history?.listen === "function"
  );
}

function nextFrame() {
  return new Promise<void>((resolve) => {
    if (typeof requestAnimationFrame === "function") requestAnimationFrame(() => resolve());
    else setTimeout(resolve, 0);
  });
}

const MAX_SAVED_POSITIONS = 50;

function historyEntryKey(): unknown {
  return window.history.state?.position ?? window.location.href;
}

export interface UseAppRouterOptions {
  /** The shell's scroll container. */
  scrollContainer: Readonly<Ref<HTMLElement | null>>;
  /** Called after every navigation, for example to close an open drawer. */
  onNavigate(): void;
}

/**
 * Connects the shell to vue-router when the application installed one
 * (`app.config.globalProperties.$router`); nothing happens without it and the library
 * does not depend on vue-router. Because the content panel scrolls instead of the
 * window, the shell takes over what the router does for the window: scrolling to the
 * top when the path changes, to the element of a hash, and restoring the position of
 * a history entry on back and forward navigation.
 */
export function useAppRouter(options: UseAppRouterOptions): void {
  const instance = getCurrentInstance();
  const positions = new Map<unknown, number>();
  let saving = true;
  let isPopNavigation = false;
  let navigationId = 0;
  let teardown: (() => void)[] = [];

  function savePosition(top: number) {
    const key = historyEntryKey();
    positions.delete(key);
    positions.set(key, top);

    if (positions.size > MAX_SAVED_POSITIONS) positions.delete(positions.keys().next().value);
  }

  useEventListener(
    options.scrollContainer,
    "scroll",
    () => {
      if (saving && options.scrollContainer.value)
        savePosition(options.scrollContainer.value.scrollTop);
    },
    { passive: true },
  );

  async function afterNavigation(to: RouteLike, from: RouteLike, failure?: unknown) {
    const wasPopNavigation = isPopNavigation;
    isPopNavigation = false;

    if (failure) {
      saving = true;
      return;
    }

    const id = ++navigationId;
    options.onNavigate();

    await nextTick();
    await nextFrame();

    if (id !== navigationId) return;

    const container = options.scrollContainer.value;
    const savedPosition = positions.get(historyEntryKey());
    const hashTarget = to.hash
      ? document.getElementById(decodeURIComponent(to.hash.slice(1)))
      : null;

    if (container) {
      if (wasPopNavigation && savedPosition !== undefined) {
        container.scrollTop = savedPosition;
      } else if (hashTarget && container.contains(hashTarget)) {
        hashTarget.scrollIntoView();
      } else if (to.path !== from.path) {
        container.scrollTop = 0;
      }

      savePosition(container.scrollTop);
    }

    saving = true;
  }

  onMounted(() => {
    const router = instance?.appContext.config.globalProperties.$router;
    if (!isRouterLike(router)) return;

    teardown = [
      router.options.history.listen(() => {
        isPopNavigation = true;
      }),
      router.beforeEach(() => {
        saving = false;
      }),
      router.afterEach((to, from, failure) => {
        void afterNavigation(to, from, failure);
      }),
    ];
  });

  onBeforeUnmount(() => {
    teardown.forEach((stop) => stop());
    teardown = [];
  });
}
