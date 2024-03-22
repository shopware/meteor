import MtSearch from "./mt-search.vue";
import { action } from "@storybook/addon-actions";
import type { StoryObj } from "@storybook/vue3";
import { ref } from "vue";
import type { SlottedMeta } from "@/_internal/story-helper";
import { fn } from "@storybook/test";

export type MtSearchMeta = SlottedMeta<typeof MtSearch, "default" | "change" | "updateModelValue">;

const meta: MtSearchMeta = {
  title: "Components/Navigation/mt-search",
  component: MtSearch,
  args: {
    modelValue: "",
    size: "default",
    placeholder: "",
    disabled: false,
  },
  render: (args) => ({
    components: { MtSearch },
    data() {
      return {
        currentValue: this.value,
      };
    },
    watch: {
      value: {
        handler(v) {
          if (this.currentValue === v) {
            return;
          }

          this.currentValue = v;
        },
        immediate: true,
      },
    },
    methods: {},
    template: `
  <div>
    <mt-search
      v-bind="args"
      :modelValue="currentValue"
      @change="changeHandler"
      @update:modelValue="onModelValueHandler"
    >
      {{ args.default }}
    </mt-search>

    <!-- Element is used for storybook being able to lose focus of search component  -->
    <h4 style="display: none;">hidden</h4>
  </div>
  `,
    setup: () => {
      const currentValue = ref();

      function changeHandler(value: string) {
        fn(action("change"))(value);
        if (args.change) args.change(value);

        currentValue.value = value;
      }

      function onModelValueHandler(value: string) {
        fn(action("updateModelValue"))(value);

        currentValue.value = value;
      }

      return {
        args,
        onModelValueHandler,
        changeHandler,
        currentValue,
      };
    },
  }),
};

export default meta;
export type MtSearchStory = StoryObj<MtSearchMeta>;

export const Default: MtSearchStory = {
  name: "mt-search",
};
