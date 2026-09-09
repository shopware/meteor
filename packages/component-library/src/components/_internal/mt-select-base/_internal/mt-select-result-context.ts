import type { InjectionKey } from "vue";

export const MtSelectResultAddActiveItemListener = Symbol() as InjectionKey<
  (listener: (index: number) => void) => void
>;
export const MtSelectResultRemoveActiveItemListener = Symbol() as InjectionKey<
  (listener: (index: number) => void) => void
>;
export const MtSelectResultAddItemSelectByKeyboardListener = Symbol() as InjectionKey<
  (listener: (index: number) => void) => void
>;
export const MtSelectResultRemoveItemSelectByKeyboardListener = Symbol() as InjectionKey<
  (listener: (index: number) => void) => void
>;
