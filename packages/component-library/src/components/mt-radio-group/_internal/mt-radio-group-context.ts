import type { ComputedRef, InjectionKey } from "vue";

export interface RadioGroupContext {
  selectedValue: ComputedRef<string | number | boolean | null | undefined>;
  selectOption: (value: string | number | boolean) => void;
  disabled: ComputedRef<boolean>;
  error: ComputedRef<boolean>;
  name: ComputedRef<string>;
}

export interface RadioGroupCustomItemContext {
  disabled: ComputedRef<boolean>;
  registerInput: (input: HTMLInputElement | null) => void;
}

export const radioGroupCustomItemKey = Symbol(
  "radioGroupCustomItem",
) as InjectionKey<RadioGroupCustomItemContext>;
