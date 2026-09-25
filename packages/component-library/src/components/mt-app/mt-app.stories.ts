import type { Meta, StoryObj } from "@storybook/vue3";
import { h, type Component } from "vue";
import MtApp from "./mt-app.vue";
import MtText from "../mt-text/mt-text.vue";

export type MtAppMeta = Meta<typeof MtApp>;
export type MtAppStory = StoryObj<MtAppMeta>;

/** Stands in for slot content, styled like the slot placeholders in Figma. */
export const SlotPlaceholder: Component = {
  props: {
    name: { type: String, required: true },
    width: { type: String, default: undefined },
    height: { type: String, default: undefined },
    inset: { type: String, default: undefined },
  },
  setup(props, { slots }) {
    return () =>
      h("div", { style: { boxSizing: "border-box", height: "100%", padding: props.inset } }, [
        h(
          "div",
          {
            style: {
              display: "grid",
              placeItems: "center",
              alignContent: "center",
              gap: "var(--scale-size-16)",
              boxSizing: "border-box",
              width: props.width,
              height: props.height ?? "100%",
              padding: "var(--scale-size-16)",
              backgroundColor: "var(--color-background-secondary-default)",
              border: "1px dashed var(--color-border-primary-default)",
              borderRadius: "var(--border-radius-m)",
            },
          },
          [
            h(MtText, { size: "xs", color: "color-text-secondary-default" }, () => props.name),
            slots.default?.(),
          ],
        ),
      ]);
  },
};

const template = `
<mt-app v-bind="args">
  <template #header>
    <slot-placeholder name="header" height="var(--scale-size-56)" inset="var(--scale-size-8)" />
  </template>

  <template #sidebar-start>
    <slot-placeholder name="sidebar-start" width="15rem" />
  </template>

  <template #content>
    <slot-placeholder name="content" inset="var(--scale-size-16)" />
  </template>

  <template #sidebar-end>
    <slot-placeholder name="sidebar-end" width="20rem" />
  </template>
</mt-app>
`;

const meta: MtAppMeta = {
  title: "Components/App",
  component: MtApp,
  tags: ["!autodocs"],
  parameters: {
    layout: "fullscreen",
  },
  render: (args) => ({
    components: { MtApp, SlotPlaceholder },
    setup: () => ({ args }),
    template,
  }),
};

export default meta;

export const Default: MtAppStory = {};
