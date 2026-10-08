import { inject, type InjectionKey, type Ref } from "vue";

/** The edge of the viewport a drawer slides in from. */
export type MtDrawerSide = "start" | "end" | "top" | "bottom";

/** Why a drawer that is not dismissible refused to close. */
export type MtDrawerDismissReason = "outside-click" | "escape-key" | "swipe";

/** What `mt-drawer-root` shares with its trigger, content and close button. */
export interface MtDrawerContext {
  isOpen: Readonly<Ref<boolean>>;
  /** The edge the content slides in from, set by the content, so the root knows the swipe direction. */
  side: Ref<MtDrawerSide>;
  setOpen(open: boolean): void;
  /** Closes the drawer, or reports the reason when it is not dismissible. */
  dismiss(reason: MtDrawerDismissReason): void;
  /** Registers how the content moves back after a swipe that may not close the drawer. */
  onSwipeRefused(reset: () => void): void;
}

export const drawerContextKey = Symbol("mt-drawer") as InjectionKey<MtDrawerContext>;

export function useDrawerContext(component: string): MtDrawerContext {
  const context = inject(drawerContextKey, null);

  if (context === null) {
    const error = new Error(`<${component} /> is missing a parent <mt-drawer-root /> component.`);
    if (Error.captureStackTrace) Error.captureStackTrace(error, useDrawerContext);

    throw error;
  }

  return context;
}
