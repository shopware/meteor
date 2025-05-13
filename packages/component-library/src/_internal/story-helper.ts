import type { Meta } from "@storybook/vue3";
import type { DefineComponent } from "vue";
import { within } from "@storybook/test";
import type { ComponentPropsAndSlots, StoryObj, VueRenderer } from "@storybook/vue3";
import type { BoundFunctions, queries } from "@testing-library/vue";
import type { FunctionalComponent } from "vue";
import type { PlayFunctionContext } from "@storybook/types";
import type { Constructor } from "type-fest";

export type SlottedMeta<
  TComponent extends abstract new (...args: any) => any,
  TSlots extends string,
> = Meta<DefineComponent<InstanceType<TComponent>["$props"] & Record<TSlots, any>>>;

type ComponentPropsOrProps<TCmpOrArgs> =
  TCmpOrArgs extends Constructor<any>
    ? ComponentPropsAndSlots<TCmpOrArgs>
    : TCmpOrArgs extends FunctionalComponent<any>
      ? ComponentPropsAndSlots<TCmpOrArgs>
      : TCmpOrArgs;

export function defineStory<T>(
  config: Omit<StoryObj<T>, "play"> & {
    play?: (
      context: PlayFunctionContext<VueRenderer, ComponentPropsOrProps<T>> & {
        screen: BoundFunctions<typeof queries>;
      },
    ) => Promise<void>;
  },
  extension?: { from: StoryObj<T> },
): StoryObj<T> {
  if (!config.play) {
    return config as StoryObj<T>;
  }

  return {
    ...extension?.from,
    ...config,
    play: async (context: PlayFunctionContext<VueRenderer, ComponentPropsOrProps<T>>) => {
      if (!config.play) return () => void 0;

      const screen = within(document.body);
      // @ts-expect-error
      await config.play({ ...context, screen });
    },
  } as unknown as StoryObj<T>;
}
