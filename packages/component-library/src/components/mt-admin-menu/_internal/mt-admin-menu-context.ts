import type { ComputedRef, InjectionKey } from "vue";
import type { MenuLinkComponent, MenuRoute, MenuRouter } from "../mt-admin-menu.types";

export interface AdminMenuContext {
  route: ComputedRef<MenuRoute | undefined>;
  router: ComputedRef<MenuRouter | undefined>;
  linkComponent: ComputedRef<MenuLinkComponent>;
  moduleIconColors: ComputedRef<boolean>;
  /** Whether any top-level branch is expanded, in which case the route stops keeping folders open. */
  hasExpandedBranches: ComputedRef<boolean>;
}

export const ADMIN_MENU_CONTEXT: InjectionKey<AdminMenuContext> = Symbol("mt-admin-menu");
