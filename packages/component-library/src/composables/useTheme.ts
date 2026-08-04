import { computed, effectScope, getCurrentScope, onScopeDispose, ref, watch } from "vue";
import type { ComputedRef, Ref } from "vue";
import { useLocalStorage, usePreferredDark } from "@vueuse/core";

/**
 * The theme a user can choose. `"system"` follows the operating system
 * preference via `prefers-color-scheme`.
 */
export type Theme = "light" | "dark" | "system";

/**
 * The theme that is actually applied once `"system"` has been resolved.
 */
export type ResolvedTheme = "light" | "dark";

export interface UseThemeOptions {
  /**
   * `localStorage` key used to persist the preference across reloads.
   * Set to `null` to disable persistence.
   *
   * @default "mt-theme"
   */
  storageKey?: string | null;
  /**
   * Element whose `data-theme` attribute is kept in sync with the resolved
   * theme. Defaults to the document root element.
   */
  target?: HTMLElement;
  /**
   * Preference used when nothing has been persisted yet.
   *
   * @default "system"
   */
  defaultTheme?: Theme;
  /**
   * Whether to write the resolved theme to the target's `data-theme`
   * attribute. Disable this when the host applies the theme itself.
   *
   * @default true
   */
  applyToTarget?: boolean;
}

export interface UseThemeReturn {
  /** The user's preference: `"light"`, `"dark"`, or `"system"`. */
  theme: Ref<Theme>;
  /** The applied theme after resolving `"system"`: `"light"` or `"dark"`. */
  resolvedTheme: ComputedRef<ResolvedTheme>;
  /** Sets the preference. Convenient for use outside of `v-model` bindings. */
  setTheme: (theme: Theme) => void;
  /**
   * Releases all listeners held by the composable. Called automatically on
   * scope disposal when used inside a component or `effectScope`; call it
   * manually when using the composable outside of an active scope.
   */
  stop: () => void;
}

const DEFAULT_STORAGE_KEY = "mt-theme";

function isTheme(value: unknown): value is Theme {
  return value === "light" || value === "dark" || value === "system";
}

/**
 * Manages the application theme: tracks the user's preference, resolves
 * `"system"` against the operating system setting, applies the result to a
 * target element's `data-theme` attribute, and persists the choice to
 * `localStorage`.
 *
 * The returned `theme` ref is meant to be bound to `mt-theme-select` via
 * `v-model`, while `resolvedTheme` reflects the value actually rendered.
 */
export function useTheme(options: UseThemeOptions = {}): UseThemeReturn {
  const {
    storageKey = DEFAULT_STORAGE_KEY,
    target,
    defaultTheme = "system",
    applyToTarget = true,
  } = options;

  /*
   * All reactive effects run in a detached scope so the composable works both
   * inside components (auto-cleanup via onScopeDispose) and outside of any
   * scope (manual cleanup via the returned stop function).
   */
  const scope = effectScope(true);

  const state = scope.run(() => {
    const prefersDark = usePreferredDark();

    const theme: Ref<Theme> =
      storageKey === null
        ? ref(defaultTheme)
        : useLocalStorage<Theme>(storageKey, defaultTheme, {
            writeDefaults: false,
            serializer: {
              read: (raw) => (isTheme(raw) ? raw : defaultTheme),
              write: (value) => value,
            },
          });

    const resolvedTheme = computed<ResolvedTheme>(() => {
      if (theme.value === "system") return prefersDark.value ? "dark" : "light";

      return theme.value;
    });

    watch(
      resolvedTheme,
      (value) => {
        if (!applyToTarget) return;

        const element =
          target ?? (typeof document !== "undefined" ? document.documentElement : undefined);
        if (element) element.dataset.theme = value;
      },
      { immediate: true },
    );

    return { theme, resolvedTheme };
  })!;

  const stop = (): void => scope.stop();

  if (getCurrentScope()) onScopeDispose(stop);

  const setTheme = (value: Theme): void => {
    state.theme.value = value;
  };

  return {
    theme: state.theme,
    resolvedTheme: state.resolvedTheme,
    setTheme,
    stop,
  };
}
