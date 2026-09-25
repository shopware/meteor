import {
  computed,
  inject,
  onScopeDispose,
  ref,
  toValue,
  watch,
  type InjectionKey,
  type MaybeRefOrGetter,
  type Ref,
} from "vue";

export type MtAppSide = "start" | "end";

/** The regions of the shell that a view can hide, see `useMtAppRegions`. */
export interface MtAppRegions {
  header?: boolean;
  sidebarStart?: boolean;
  sidebarEnd?: boolean;
}

/** The media query that matches while the viewport is narrower than the given width. */
export function breakpointQuery(breakpoint: number): string {
  return `(width < ${breakpoint}px)`;
}

/**
 * Whether the viewport is narrower than the breakpoint. The viewport is only read
 * while `enabled` is true, which the shell sets after mounting: server-rendered markup
 * and the first client render then agree. A breakpoint of zero (or less) disables the
 * mobile layout entirely.
 */
export function useBreakpoint(
  breakpoint: MaybeRefOrGetter<number>,
  enabled: Readonly<Ref<boolean>>,
): Readonly<Ref<boolean>> {
  const isMobile = ref(false);
  let mediaQuery: MediaQueryList | undefined;

  const update = () => {
    isMobile.value = mediaQuery?.matches ?? false;
  };

  const stop = () => {
    mediaQuery?.removeEventListener("change", update);
    mediaQuery = undefined;
  };

  watch(
    [() => toValue(breakpoint), enabled],
    ([value, isEnabled]) => {
      stop();

      const supported = typeof window !== "undefined" && typeof window.matchMedia === "function";
      if (!isEnabled || value <= 0 || !supported) {
        isMobile.value = false;
        return;
      }

      mediaQuery = window.matchMedia(breakpointQuery(value));
      mediaQuery.addEventListener("change", update);
      update();
    },
    { immediate: true },
  );

  onScopeDispose(stop);

  return computed(() => isMobile.value);
}

/** Provided by mt-app; the contract between the shell and its internal parts. */
export interface AppLayoutContext {
  isMobile: Readonly<Ref<boolean>>;
  activeSide: Readonly<Ref<MtAppSide | null>>;
  /** Announces a sidebar for the given side; the returned function removes it again. */
  registerSidebar(side: MtAppSide): () => void;
  open(side: MtAppSide): void;
  close(): void;
  /** Hides regions while the returned release function has not been called. */
  requestRegions(regions: () => MtAppRegions): () => void;
}

export const appLayoutKey = Symbol("mt-app-layout") as InjectionKey<AppLayoutContext>;

export function useAppLayout(component: string): AppLayoutContext {
  const context = inject(appLayoutKey, null);

  if (context === null) {
    const error = new Error(`<${component} /> is missing a parent <mt-app /> component.`);

    const ErrorWithCapture = Error as ErrorConstructor & {
      captureStackTrace?(target: object, constructorOpt?: unknown): void;
    };
    ErrorWithCapture.captureStackTrace?.(error, useAppLayout);

    throw error;
  }

  return context;
}
