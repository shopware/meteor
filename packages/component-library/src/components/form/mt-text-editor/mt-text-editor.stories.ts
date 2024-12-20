import type { StoryObj } from "@storybook/vue3";
import MtTextEditor from "./mt-text-editor.vue";
import type { SlottedMeta } from "@/_internal/story-helper";
import MtTextEditorToolbarButtonColor from "./_internal/mt-text-editor-toolbar-button-color.vue";
import { ref } from "vue";
import Highlight from "@tiptap/extension-highlight";
import { fn } from "@storybook/test";

export type MtTextEditorMeta = SlottedMeta<
  typeof MtTextEditor,
  "default" | "click" | "updateModelValue"
>;

export default {
  title: "Components/Form/mt-text-editor",
  component: MtTextEditor,
  args: {
    modelValue: `<h1><span style="color: rgb(5, 220, 235)">Hello</span> <span style="color: rgb(43, 235, 5)">World</span></h1><p><strong>Some</strong> text</p><ol><li><p><a target="_blank" rel="noopener noreferrer nofollow" href="https://www.shopware.com">Lorem</a></p></li><li><p>Ipsum</p></li></ol><table style="min-width: 75px"><colgroup><col style="min-width: 25px"><col style="min-width: 25px"><col style="min-width: 25px"></colgroup><tbody><tr><th colspan="1" rowspan="1"><p><span>First</span></p></th><th colspan="1" rowspan="1"><p>Second</p></th><th colspan="1" rowspan="1"><p>Third</p></th></tr><tr><td colspan="1" rowspan="1"><p>Lorem</p></td><td colspan="1" rowspan="1"><p>Ipsum</p></td><td colspan="1" rowspan="1"><p>non</p></td></tr><tr><td colspan="1" rowspan="1"><p>dolor</p></td><td colspan="1" rowspan="1"><p>sit</p></td><td colspan="1" rowspan="1"><p>amet</p></td></tr></tbody></table><p>After table</p>`,
    updateModelValue: fn(),
    label: "My Text editor",
  },
  render: (args) => ({
    components: { MtTextEditor, MtTextEditorToolbarButtonColor },
    setup() {
      const currentModelValue = ref(args.modelValue);
      const onUpdateModelValue = (value: string) => {
        currentModelValue.value = value;
        args.updateModelValue(value);
      };

      return {
        args,
        currentModelValue,
        onUpdateModelValue,
      };
    },
    template: `
<div class="wrapper">
  <mt-text-editor
      v-bind="args"
      :modelValue="currentModelValue"
      @update:modelValue="onUpdateModelValue"
  >
    <!-- Here we can add custom toolbar buttons -->
  </mt-text-editor>
</div>`,
  }),
} as MtTextEditorMeta;

export type MtTextEditorStory = StoryObj<MtTextEditorMeta>;

export const DefaultStory: MtTextEditorStory = {
  name: "mt-text-editor",
};

export const InlineEditStory: MtTextEditorStory = {
  name: "mt-text-editor (inline edit)",
  args: {
    isInlineEdit: true,
  },
};

export const CustomButtonsStory: MtTextEditorStory = {
  name: "mt-text-editor (custom buttons)",
  args: {
    modelValue: `<h1>Hello <mark>World</mark></h1><p>In the toolbar you see now a new highlight button.</p>`,
    tipTapConfig: {
      extensions: [Highlight],
    },
    customButtons: [
      {
        name: "highlight",
        label: "Highlight",
        icon: "regular-circle-xs",
        action: (editor) => {
          editor.chain().focus().toggleMark("highlight").run();
        },
      },
    ],
  },
};
