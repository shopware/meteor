import { inject, type InjectionKey, type Ref } from "vue";

export type MtDrawerSide = "start" | "end" | "top" | "bottom";

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
