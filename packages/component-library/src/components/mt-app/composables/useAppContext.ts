import { inject, type InjectionKey, type Ref } from "vue";
import type { MtAppPanel } from "./useMtApp";
import type { MtAppRegions } from "./useMtAppRegions";

/** What `mt-app` shares with its parts and with `useMtApp()` and `useMtAppRegions()`. */
export interface AppContext {
  isMobile: Readonly<Ref<boolean>>;
  isOpen(panel: MtAppPanel): boolean;
  open(panel: MtAppPanel): void;
  close(panel: MtAppPanel): void;
  toggle(panel: MtAppPanel): void;
  /** Hides regions until the returned function is called. */
  requestRegions(regions: () => MtAppRegions): () => void;
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
