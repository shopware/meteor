import type { ComputedRef, InjectionKey } from "vue";
import type { NavLinkComponent, NavRoute, NavRouter } from "../mt-nav.types";

export interface NavContext {
  route: ComputedRef<NavRoute | undefined>;
  router: ComputedRef<NavRouter | undefined>;
  linkComponent: ComputedRef<NavLinkComponent>;
  /** Whether any top-level branch is expanded, in which case the route stops keeping folders open. */
  hasExpandedBranches: ComputedRef<boolean>;
}

export const NAV_CONTEXT: InjectionKey<NavContext> = Symbol("mt-nav");
