import { inject, type InjectionKey, type Ref } from "vue";
import type { MtAppPanel } from "./useApp";
import type { MtAppRegions } from "./useAppRegions";
import type { UnsavedChangesSource } from "./createAppUnsavedChanges";

/**
 * What `mt-app` shares with its parts and with `useApp()`, `useAppRegions()`,
 * `useAppLoading()` and `useUnsavedChanges()`.
 */
export interface AppContext {
  isMobile: Readonly<Ref<boolean>>;
  isOpen(panel: MtAppPanel): boolean;
  open(panel: MtAppPanel): void;
  close(panel: MtAppPanel): void;
  toggle(panel: MtAppPanel): void;
  /** Reports loading until the returned function is called. */
  startLoading(): () => void;
  /** Hides regions until the returned function is called. */
  requestRegions(regions: () => MtAppRegions): () => void;
  /** Reports unsaved changes until the returned function is called. */
  registerUnsavedChanges(source: UnsavedChangesSource): () => void;
  /** Asks to discard the unsaved changes, if there are any. Resolves `true` to leave. */
  confirmLeave(): Promise<boolean>;
  /** Moves the focus to the content, for example when the focused region disappears. */
  focusContent(): void;
}

export const appContextKey = Symbol("mt-app") as InjectionKey<AppContext>;

/** The context of the surrounding `mt-app`, for parts that only work inside of it. */
export function useAppContext(component: string): AppContext {
  const context = inject(appContextKey, null);

  if (context === null) {
    const error = new Error(`<${component} /> is missing a parent <mt-app /> component.`);
    if (Error.captureStackTrace) Error.captureStackTrace(error, useAppContext);

    throw error;
  }

  return context;
}
