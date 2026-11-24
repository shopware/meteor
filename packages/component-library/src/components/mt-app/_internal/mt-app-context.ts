import {
  computed,
  getCurrentInstance,
  inject,
  onActivated,
  onDeactivated,
  onScopeDispose,
  type ComputedRef,
  type InjectionKey,
  type Ref,
} from "vue";
import type { AppTriggerRegion } from "../composables/createAppTriggers";
import type { MtAppContext, MtAppPanel } from "../composables/useApp";
import type { MtAppRegions } from "../composables/useAppRegions";
import type { UnsavedChangesSource } from "../composables/createAppUnsavedChanges";

/** A panel's trigger in a header, such as the one of a page. */
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
   * Reports that a component in the header shows the panel's trigger, so the pages don't, until
   * the returned function is called.
   */
  registerHeaderTrigger(panel: () => MtAppPanel): () => void;
  /**
   * Reports a trigger that the app placed itself with `mt-app-panel-trigger`, so the shell's own
   * components leave out theirs for the panel, until the returned function is called. A trigger
   * inside its own panel reports `undefined`, as it stands in for no other trigger.
   */
  registerPlacedTrigger(panel: () => MtAppPanel | undefined, region: AppTriggerRegion): () => void;
  /** The label, the icon and the controlled element of the panel's trigger. Read while rendering. */
  triggerOf(panel: MtAppPanel): AppPanelTrigger;
  /**
   * The trigger that the shell's component in the region shows for the panel, or `undefined` while
   * the panel has none or another place shows it. Read while rendering.
   */
  panelTrigger(panel: MtAppPanel, region: AppTriggerRegion): AppPanelTrigger | undefined;
  /** Whether a panel of the shell is being resized, during which pages keep their layout. */
  isResizing: Readonly<Ref<boolean>>;
}

export const appContextKey = Symbol("mt-app") as InjectionKey<AppContext>;

/** The region of the shell around a component. Without one, it is in a page. */
export const appTriggerRegionKey = Symbol(
  "mt-app-trigger-region",
) as InjectionKey<AppTriggerRegion>;

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

/** A panel's trigger with its state, for a component that shows it. */
export interface AppPanelTriggerState extends AppPanelTrigger {
  expanded: boolean;
  toggle(): void;
}

/**
 * Shows the trigger of a panel of the surrounding `mt-app`. The trigger is `undefined` while the
 * panel has none, in a page while the shell's header shows it, and outside of a shell.
 */
export function useAppPanelTrigger(
  panel: () => MtAppPanel,
): ComputedRef<AppPanelTriggerState | undefined> {
  const app = inject(appContextKey, null);
  const region = inject(appTriggerRegionKey, "page");

  if (region === "header") useAppRegistration((app) => app.registerHeaderTrigger(panel));

  return computed(() => {
    const trigger = app?.panelTrigger(panel(), region);
    if (!app || !trigger) return undefined;

    return { ...trigger, expanded: app.isOpen(panel()), toggle: () => app.toggle(panel()) };
  });
}
