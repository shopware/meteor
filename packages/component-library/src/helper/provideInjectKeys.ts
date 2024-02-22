import type { InjectionKey } from "vue";

export const swSelectResultAddActiveItemListener = Symbol() as InjectionKey<
  (listener: (index: number) => void) => void
>;
export const swSelectResultRemoveActiveItemListener = Symbol() as InjectionKey<
  (listener: (index: number) => void) => void
>;
export const swSelectResultAddItemSelectByKeyboardListener = Symbol() as InjectionKey<
  (listener: (index: number) => void) => void
>;
export const swSelectResultRemoveItemSelectByKeyboardListener = Symbol() as InjectionKey<
  (listener: (index: number) => void) => void
>;
