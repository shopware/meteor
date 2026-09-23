import {
  computed,
  inject,
  onBeforeUnmount,
  onScopeDispose,
  ref,
  toValue,
  watch,
  type InjectionKey,
  type MaybeRefOrGetter,
  type Ref,
} from "vue";

export type MtAppSide = "start" | "end";

/**
 * The media query that matches below the given viewport width. `max-width` is
 * inclusive, so a fraction is subtracted to keep the breakpoint itself on the
 * desktop side.
 */
export function breakpointQuery(breakpoint: number): string {
  return `(max-width: ${breakpoint - 0.02}px)`;
}

/**
 * Whether the viewport is narrower than the breakpoint. The value is read
 * synchronously, so the first render already uses the right layout. A
 * breakpoint of zero (or less) disables the mobile layout entirely.
 */
export function useBreakpoint(breakpoint: MaybeRefOrGetter<number>): Readonly<Ref<boolean>> {
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
    () => toValue(breakpoint),
    (value) => {
      stop();

      const supported = typeof window !== "undefined" && typeof window.matchMedia === "function";
      if (value <= 0 || !supported) {
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

/**
 * Locks the document while the shell owns the viewport: the document itself never
 * scrolls (an overlay positioned below the fold in the body would otherwise make
 * it scrollable) and the page behind the shell uses the shell background instead
 * of the body color. Previous inline styles are restored when the lock is released.
 */
export function useDocumentLock(enabled: () => boolean): void {
  let previous: { overflow: string; backgroundColor: string } | undefined;

  function lock() {
    if (typeof document === "undefined" || previous) return;

    const { style } = document.documentElement;
    previous = { overflow: style.overflow, backgroundColor: style.backgroundColor };
    style.overflow = "hidden";
    style.setProperty("background-color", "var(--color-elevation-surface-sunken)");
  }

  function unlock() {
    if (typeof document === "undefined" || !previous) return;

    const { style } = document.documentElement;
    style.overflow = previous.overflow;
    style.backgroundColor = previous.backgroundColor;
    previous = undefined;
  }

  watch(enabled, (value) => (value ? lock() : unlock()), { immediate: true });

  onBeforeUnmount(unlock);
}

/** Provided by mt-app; the contract between the shell and its internal parts. */
export interface AppLayoutContext {
  isMobile: Readonly<Ref<boolean>>;
  activeSide: Readonly<Ref<MtAppSide | null>>;
  closeOnNavigate: Readonly<Ref<boolean>>;
  /** Announces a sidebar for the given side; the returned function removes it again. */
  registerSidebar(side: MtAppSide): () => void;
  open(side: MtAppSide): void;
  close(): void;
  /**
   * The element that receives focus when the drawer of the given side closes;
   * `null` leaves the focus where it is.
   */
  focusReturnTarget(side: MtAppSide): HTMLElement | null;
}

export const appLayoutKey = Symbol("mt-app-layout") as InjectionKey<AppLayoutContext>;

export function useAppLayout(component: string): AppLayoutContext {
  const context = inject(appLayoutKey, null);

  if (context === null) {
    const error = new Error(`<${component} /> is missing a parent <mt-app /> component.`);

    // V8-only and not typed in the DOM lib
    const ErrorWithCapture = Error as ErrorConstructor & {
      captureStackTrace?(target: object, constructorOpt?: unknown): void;
    };
    ErrorWithCapture.captureStackTrace?.(error, useAppLayout);

    throw error;
  }

  return context;
}
