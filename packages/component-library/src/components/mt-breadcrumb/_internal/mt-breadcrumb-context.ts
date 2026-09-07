import { inject, onMounted, onUnmounted, onUpdated, type InjectionKey } from "vue";

export interface BreadcrumbContextValue {
  requestLayout: () => void;
}

export const BreadcrumbContext = Symbol(
  "BreadcrumbContext",
) as InjectionKey<BreadcrumbContextValue>;

export function useBreadcrumbLayout() {
  const { requestLayout } = inject(BreadcrumbContext, { requestLayout: () => {} });

  onMounted(requestLayout);
  onUpdated(requestLayout);
  onUnmounted(requestLayout);
}
