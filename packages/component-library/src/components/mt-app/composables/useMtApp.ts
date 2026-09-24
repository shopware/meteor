import { inject, provide, ref, type InjectionKey, type Ref } from "vue";
import type { ResolvedTheme, Theme } from "@/composables/useTheme";
import type { MtAppSide } from "./useAppLayout";

export type { MtAppSide };

/** The shell state and controls that `useMtApp()` exposes to descendants of `<mt-app>`. */
export interface MtAppContext {
  /** Whether the shell currently uses the mobile layout with off-canvas sidebars. */
  isMobile: Readonly<Ref<boolean>>;
  /** The sidebar that is open as a drawer, or `null`. Always `null` in the desktop layout. */
  activeDrawer: Readonly<Ref<MtAppSide | null>>;
  /** The theme preference: `light`, `dark` or `system`. */
  theme: Readonly<Ref<Theme>>;
  /** The theme that is applied after resolving `system`. */
  resolvedTheme: Readonly<Ref<ResolvedTheme>>;
  /** The element that scrolls the content. The window itself never scrolls while the shell is mounted. */
  scrollContainer: Readonly<Ref<HTMLElement | null>>;
  /** Opens the drawer of the given side. Does nothing in the desktop layout or for an empty or hidden sidebar. */
  openDrawer(side: MtAppSide): void;
  closeDrawer(): void;
  /** Sets the theme preference. With a controlled `theme` prop this only emits `update:theme`. */
  setTheme(theme: Theme): void;
}

export const mtAppKey = Symbol("mt-app") as InjectionKey<MtAppContext>;

export function provideMtApp(context: MtAppContext): void {
  provide(mtAppKey, context);
}

/**
 * Gives descendants of `<mt-app>` access to the shell state. Outside of a shell it
 * returns inert defaults, so components using it keep working on their own.
 */
export function useMtApp(): MtAppContext {
  const context = inject(mtAppKey, null);
  if (context !== null) return context;

  return {
    isMobile: ref(false),
    activeDrawer: ref(null),
    theme: ref<Theme>("system"),
    resolvedTheme: ref<ResolvedTheme>("light"),
    scrollContainer: ref(null),
    openDrawer: () => undefined,
    closeDrawer: () => undefined,
    setTheme: () => undefined,
  };
}
