import { computed, onScopeDispose, ref, watch, type ComputedRef, type Ref } from "vue";

/**
 * The color scheme a user can choose. `"system"` follows the operating system
 * preference via `prefers-color-scheme`.
 */
export type ColorScheme = "light" | "dark" | "system";

/**
 * The color scheme that is actually applied once `"system"` has been resolved.
 */
export type ResolvedColorScheme = "light" | "dark";

export interface UseColorSchemeOptions {
  /**
   * `localStorage` key used to persist the preference across reloads. Set to
   * `null` to disable persistence.
   */
  storageKey?: string | null;
  /**
   * Element whose `data-theme` attribute is kept in sync with the resolved
   * scheme. Defaults to the document root element.
   */
  target?: HTMLElement;
  /**
   * Preference used when nothing has been persisted yet.
   */
  defaultScheme?: ColorScheme;
  /**
   * Whether to write the resolved scheme to the target's `data-theme`
   * attribute. Disable this when the host applies the theme itself.
   */
  applyToTarget?: boolean;
}

export interface UseColorSchemeReturn {
  /** The user's preference: `"light"`, `"dark"`, or `"system"`. */
  scheme: Ref<ColorScheme>;
  /** The applied scheme after resolving `"system"`: `"light"` or `"dark"`. */
  resolvedScheme: ComputedRef<ResolvedColorScheme>;
  /** Sets the preference. Convenient for binding to `mt-theme-select`. */
  setScheme: (scheme: ColorScheme) => void;
  /**
   * Stops listening to OS color-scheme changes. Called automatically on scope
   * disposal when used inside a component or `effectScope`; call it manually
   * when using the composable outside of an active scope.
   */
  stop: () => void;
}

const DEFAULT_STORAGE_KEY = "mt-color-scheme";
const SYSTEM_QUERY = "(prefers-color-scheme: dark)";

function isColorScheme(value: unknown): value is ColorScheme {
  return value === "light" || value === "dark" || value === "system";
}

function readStoredScheme(storageKey: string | null): ColorScheme | undefined {
  if (storageKey === null || typeof window === "undefined") return undefined;

  try {
    const stored = window.localStorage?.getItem(storageKey);
    return isColorScheme(stored) ? stored : undefined;
  } catch {
    return undefined;
  }
}

/**
 * Manages the application color scheme: tracks the user's preference, resolves
 * `"system"` against the OS setting, applies the result to a target element's
 * `data-theme` attribute, and persists the choice.
 *
 * The returned `scheme` ref is meant to be bound to the `mt-theme-select`
 * component, while `resolvedScheme` reflects the value actually rendered.
 */
export function useColorScheme(options: UseColorSchemeOptions = {}): UseColorSchemeReturn {
  const {
    storageKey = DEFAULT_STORAGE_KEY,
    target,
    defaultScheme = "system",
    applyToTarget = true,
  } = options;

  const scheme = ref<ColorScheme>(readStoredScheme(storageKey) ?? defaultScheme);

  let media: MediaQueryList | undefined;
  if (typeof window !== "undefined" && typeof window.matchMedia === "function") {
    media = window.matchMedia(SYSTEM_QUERY);
  }

  const systemScheme = ref<ResolvedColorScheme>(media?.matches ? "dark" : "light");

  const resolvedScheme = computed<ResolvedColorScheme>(() =>
    scheme.value === "system" ? systemScheme.value : scheme.value,
  );

  const onSystemChange = (event: MediaQueryListEvent): void => {
    systemScheme.value = event.matches ? "dark" : "light";
  };

  media?.addEventListener("change", onSystemChange);

  const resolveTarget = (): HTMLElement | undefined => {
    if (target) return target;
    return typeof document !== "undefined" ? document.documentElement : undefined;
  };

  watch(
    resolvedScheme,
    (value) => {
      if (!applyToTarget) return;
      const element = resolveTarget();
      if (element) element.dataset.theme = value;
    },
    { immediate: true },
  );

  watch(scheme, (value) => {
    if (storageKey === null || typeof window === "undefined") return;
    try {
      window.localStorage?.setItem(storageKey, value);
    } catch {
      // Ignore storage errors (quota, private mode, disabled storage).
    }
  });

  const stop = (): void => {
    media?.removeEventListener("change", onSystemChange);
  };

  onScopeDispose(stop);

  const setScheme = (value: ColorScheme): void => {
    scheme.value = value;
  };

  return { scheme, resolvedScheme, setScheme, stop };
}
