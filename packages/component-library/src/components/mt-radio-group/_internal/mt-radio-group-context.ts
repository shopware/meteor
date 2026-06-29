import type { ComputedRef } from "vue";

export interface RadioGroupContext {
  selectedValue: ComputedRef<string | number | boolean | null | undefined>;
  selectOption: (value: string | number | boolean) => void;
  disabled: ComputedRef<boolean>;
  name: ComputedRef<string>;
}
