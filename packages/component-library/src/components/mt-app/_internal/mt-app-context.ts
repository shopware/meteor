import {
  getCurrentInstance,
  inject,
  onActivated,
  onDeactivated,
  onScopeDispose,
  type InjectionKey,
  type Ref,
} from "vue";
import type { MtAppContext, MtAppPanel } from "../composables/useApp";
import type { MtAppRegions } from "../composables/useAppRegions";
import type { UnsavedChangesSource } from "../composables/createAppUnsavedChanges";

/** A panel's trigger in the header of a page. */
export interface AppPanelTrigger {
  label: string;
  icon: string;
  /** The id of the panel, or of its drawer. */
  controls: string;
}

/** What `mt-app` shares with its parts and its composables. */
export interface AppContext extends MtAppContext {
  /** Reports loading until the returned function is called. */
  startLoading(): () => void;
  /** Hides regions until the returned function is called. */
  registerRegions(regions: () => MtAppRegions): () => void;
  /** Reports unsaved changes until the returned function is called. */
  registerUnsavedChanges(source: UnsavedChangesSource): () => void;
  /**
   * Reports that a page shows the panel's trigger, so the shell's header doesn't, until the
   * returned function is called.
   */
  registerTrigger(panel: () => MtAppPanel): () => void;
  /** The panel's trigger, or `undefined` while it has none. Pages read it while they render. */
  panelTrigger(panel: MtAppPanel): AppPanelTrigger | undefined;
  /** Whether a panel of the shell is being resized, during which pages keep their layout. */
  isResizing: Readonly<Ref<boolean>>;
}

export const appContextKey = Symbol("mt-app") as InjectionKey<AppContext>;

/**
 * Keeps a registration with the surrounding `mt-app` while the calling component or effect scope
 * is alive and not deactivated by `<KeepAlive>`. Does nothing outside of a shell.
 */
export function useAppRegistration(register: (app: AppContext) => () => void): void {
  const app = inject(appContextKey, null);
  if (app === null) return;

  let release: (() => void) | undefined = register(app);

  if (getCurrentInstance()) {
    onDeactivated(() => {
      release?.();
      release = undefined;
    });
    onActivated(() => {
      release ??= register(app);
    });
  }

  onScopeDispose(() => release?.());
}
