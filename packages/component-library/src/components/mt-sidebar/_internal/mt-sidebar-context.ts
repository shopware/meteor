import type { ComputedRef, InjectionKey } from "vue";
import type { SidebarLinkComponent, SidebarRoute, SidebarRouter } from "../mt-sidebar.types";

export interface SidebarContext {
  route: ComputedRef<SidebarRoute | undefined>;
  router: ComputedRef<SidebarRouter | undefined>;
  linkComponent: ComputedRef<SidebarLinkComponent>;
  moduleIconColors: ComputedRef<boolean>;
  /** Whether any top-level branch is expanded, in which case the route stops keeping folders open. */
  hasExpandedBranches: ComputedRef<boolean>;
}

export const SIDEBAR_CONTEXT: InjectionKey<SidebarContext> = Symbol("mt-sidebar");
