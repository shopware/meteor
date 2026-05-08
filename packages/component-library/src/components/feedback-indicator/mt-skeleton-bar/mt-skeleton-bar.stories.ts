import MtSkeletonBar from "./mt-skeleton-bar.vue";
import type { StoryObj } from "@storybook/vue3";
import type { SlottedMeta } from "@/_internal/story-helper";

export type MtSkeletonBarMeta = SlottedMeta<typeof MtSkeletonBar, "default">;

export default {
  title: "Components/Skeleton Bar",
  component: MtSkeletonBar,
  render: (args) => ({
    components: { MtSkeletonBar },
    template: `
          <div style="width: 500px; margin-top: 50px; margin-left: 50px;">
            <mt-skeleton-bar v-bind="args"></mt-skeleton-bar>
          </div>
        `,
    setup: () => {
      return {
        args,
      };
    },
  }),
} as MtSkeletonBarMeta;

export type MtSkeletonBarStory = StoryObj<MtSkeletonBarMeta>;

export const Default: MtSkeletonBarStory = {
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `<mt-skeleton-bar />`,
      },
    },
  },
};

export const MultipleLines: MtSkeletonBarStory = {
  name: "Form layout",
  render: () => ({
    components: { MtSkeletonBar },
    template: `
      <div
        style="
          width: 640px;
          margin-top: 50px;
          margin-left: 50px;
          display: grid;
          gap: 32px;
        "
      >
        <div style="display: grid; gap: 32px;">
          <div
            style="
              display: grid;
              grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
              gap: 32px;
            "
          >
            <div>
              <mt-skeleton-bar />
            </div>
            <div>
              <mt-skeleton-bar />
            </div>
          </div>

          <div
            style="
              display: grid;
              grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
              gap: 32px;
            "
          >
            <div>
              <mt-skeleton-bar />
            </div>
            <div>
              <mt-skeleton-bar />
            </div>
          </div>

          <div
            style="
              display: grid;
              grid-template-columns: repeat(3, minmax(0, 1fr));
              gap: 32px;
            "
          >
            <div>
              <mt-skeleton-bar />
            </div>
            <div>
              <mt-skeleton-bar />
            </div>
            <div>
              <mt-skeleton-bar />
            </div>
          </div>
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `<div>
  <div style="display: grid; gap: 32px;">
    <div
      style="
        display: grid;
        grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
        gap: 32px;
      "
    >
      <div>
        <mt-skeleton-bar />
      </div>
      <div>
        <mt-skeleton-bar />
      </div>
    </div>

    <div
      style="
        display: grid;
        grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
        gap: 32px;
      "
    >
      <div>
        <mt-skeleton-bar />
      </div>
      <div>
        <mt-skeleton-bar />
      </div>
    </div>

    <div
      style="
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 32px;
      "
    >
      <div>
        <mt-skeleton-bar />
      </div>
      <div>
        <mt-skeleton-bar />
      </div>
      <div>
        <mt-skeleton-bar />
      </div>
    </div>
  </div>
</div>`,
      },
    },
  },
};
