import { inject, type InjectionKey, type Ref } from "vue";

/**
 * The edge of the viewport a drawer slides in from.
 *
 * @experimental Not for public use yet: undocumented, and it may change or be removed without notice.
 */
export type MtDrawerSide = "start" | "end" | "top" | "bottom";

/**
 * Why a drawer that is not dismissible refused to close.
 *
 * @experimental Not for public use yet: undocumented, and it may change or be removed without notice.
 */
export type MtDrawerDismissReason = "outside-click" | "escape-key" | "swipe";

export interface MtDrawerContext {
  isOpen: Readonly<Ref<boolean>>;
  side: Ref<MtDrawerSide>;
  setOpen(open: boolean): void;
  dismiss(reason: MtDrawerDismissReason): void;
  onSwipeRefused(reset: () => void): void;
}

export const drawerContextKey = Symbol("mt-drawer") as InjectionKey<MtDrawerContext>;

export function useDrawerContext(component: string): MtDrawerContext {
  const context = inject(drawerContextKey, null);
  if (!context) throw new Error(`<${component}> must be used inside <mt-drawer-root>.`);

  return context;
}
