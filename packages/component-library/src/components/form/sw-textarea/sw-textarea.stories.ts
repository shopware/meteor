import SwTextarea from "./sw-textarea.vue";
import type { StoryObj } from "@storybook/vue3";
import type { SlottedMeta } from "@/_internal/story-helper";

export type SwTextareaMeta = SlottedMeta<
  typeof SwTextarea,
  | "default"
  | "change"
  | "updateModelValue"
  | "hint"
  | "label"
  | "placeholder"
  | "error"
  | "inheritanceRestore"
  | "inheritanceRemove"
  | "isInherited"
>;

export default {
  title: "Components/Form/sw-textarea",
  component: SwTextarea,
  render: (args) => ({
    template: `
            <div>
              <sw-textarea
                v-bind="args"
                :modelValue="currentValue"
                @update:modelValue="args.updateModelValue"
                @change="onChange"
                @inheritance-restore="args.inheritanceRestore"
                @inheritance-remove="args.inheritanceRemove"
              >
                <template #hint>{{ args.hint }}</template>
              </sw-textarea>
              <p style="display: none">hidden</p>
            </div>`,
    components: { SwTextarea },
    data() {
      return {
        currentValue: "",
      };
    },
    watch: {
      "args.modelValue"(v) {
        this.currentValue = v;
      },
    },
    created() {
      this.currentValue = args.modelValue;
    },
    methods: {
      onChange(value: string) {
        args.change(value);
        this.currentValue = value;
      },
    },
    setup: () => {
      return {
        args,
      };
    },
  }),
  args: {
    label: "Textareafield",
  },
  argTypes: {
    updateModelValue: {
      action: "updateModelValue",
      table: {
        category: "Events",
      },
    },
    change: {
      action: "change",
      table: {
        category: "Events",
      },
    },
    inheritanceRestore: {
      action: "inheritance-restore",
      table: {
        category: "Events",
      },
    },
    inheritanceRemove: {
      action: "inheritance-remove",
      table: {
        category: "Events",
      },
    },
    hint: {
      control: { type: "text" },
    },
  },
} as SwTextareaMeta;

export type SwTextareaStory = StoryObj<SwTextareaMeta>;

export const DefaultStory: SwTextareaStory = {
  name: "sw-textarea",
};
