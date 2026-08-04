import { inject, type InjectionKey } from "vue";

export const TooltipContext = Symbol("TooltipContext") as InjectionKey<boolean>;

export function useIsInsideTooltip() {
  return inject(TooltipContext, false);
}
