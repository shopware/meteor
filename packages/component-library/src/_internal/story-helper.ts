import type { Meta } from "@storybook/vue3";
import type { DefineComponent } from "vue";

export type SlottedMeta<
  TComponent extends abstract new (...args: any) => any,
  TSlots extends string,
> = Meta<DefineComponent<InstanceType<TComponent>["$props"] & Record<TSlots, any>>>;
