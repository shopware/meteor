import SwSegmentedControl from "./sw-segmented-control.vue";
import SwPopoverItem from "../../overlay/sw-popover-item/sw-popover-item.vue";
import type { StoryObj } from "@storybook/vue3";
import type { SlottedMeta } from "@/_internal/story-helper";

export type SwSegmentedControlMeta = SlottedMeta<typeof SwSegmentedControl, "default">;

const meta: SwSegmentedControlMeta = {
  title: "Components/Navigation/sw-segmented-control",
  component: SwSegmentedControl,
  render: (args) => ({
    components: { SwSegmentedControl, SwPopoverItem },
    template: `
      <div style="max-width: 1000px; max-height: 400px; height: 500px; margin: 0 auto;">
        <sw-segmented-control
            v-bind="args"
        >
          {{ args.default }}

          <template #labelF--popover-items__base="{ toggleFloatingUi, changeView }">
            <sw-popover-item
                label="Go to second level"
                :on-label-click="() => changeView('secondLevel')"
            />
          </template>

          <template #labelF--popover-items__secondLevel="{ toggleFloatingUi, changeView }">
            <sw-popover-item
                label="Go to third level"
                :on-label-click="() => changeView('thirdLevel')"
            />
          </template>

          <template #labelF--popover-items__thirdLevel="{ toggleFloatingUi, changeView }">
            <sw-popover-item
                label="Go back to first level"
                :on-label-click="() => changeView('base')"
            />
          </template>
        </sw-segmented-control>
      </div>`,
    setup: () => {
      return {
        args,
      };
    },
  }),
  args: {
    disableContext: true,
    actions: [
      {
        id: "labelStart",
        label: "X products selected",
        onClick: ({ checkboxValue }) => console.log("Checked Label E", checkboxValue),
        isPressed: true,
        hasCheckbox: true,
      },
      "divider",
      {
        id: "labelA",
        label: "Label A",
        onClick: () => alert("Label A"),
        iconName: "regular-tag",
        disabled: true,
      },
      "divider",
      {
        id: "labelB",
        label: "Label B",
        onClick: () => alert("Label B"),
        isPressed: true,
      },
      {
        id: "labelC",
        label: "Label C",
        onClick: () => alert("Label C"),
        isPressed: false,
        isCritical: true,
      },
      {
        id: "labelD",
        label: "Label D",
        onClick: () => alert("Label D"),
        isPressed: true,
        isCritical: true,
      },
      {
        id: "labelF",
        label: "Label F",
        iconName: "regular-calendar",
        options: true,
        popover: {
          title: "First level",
          childViews: [
            {
              name: "secondLevel",
              title: "Second level",
              childViews: [
                {
                  name: "thirdLevel",
                  title: "Third level",
                },
              ],
            },
          ],
        },
      },
    ],
  },
};

export default meta;
export type SwSegmentedControlStory = StoryObj<typeof SwSegmentedControl>;

export const DefaultStory: SwSegmentedControlStory = {
  name: "sw-segmented-control",
};
