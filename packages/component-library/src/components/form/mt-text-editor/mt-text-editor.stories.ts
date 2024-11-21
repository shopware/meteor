import type { StoryObj } from "@storybook/vue3";
import { action } from "@storybook/addon-actions";
import { fn } from "@storybook/test";
import MtTextEditor from "./mt-text-editor.vue";
import type { SlottedMeta } from "@/_internal/story-helper";
import MtTextEditorToolbarButtonColor from "./_internal/mt-text-editor-toolbar-button-color.vue";

export type MtTextEditorMeta = SlottedMeta<typeof MtTextEditor, "default" | "click">;

export default {
  title: "Components/Form/mt-text-editor",
  component: MtTextEditor,
  args: {
    modelValue: `
  <h1><span style="color: #05dceb">Hello</span> <span style="color: #2beb05">World</span></h1><p><strong>Some</strong> text</p><ol><li><p>Lorem</p></li><li><p>Ipsum</p></li></ol>
    `,
  },
  render: (args) => ({
    components: { MtTextEditor, MtTextEditorToolbarButtonColor },
    setup() {
      return {
        args,
      };
    },
    template: `
<div class="wrapper" style="padding: 72px">
  <mt-text-editor v-bind="args">
    <!-- Here we can add custom toolbar buttons -->
  </mt-text-editor>
</div>`,
  }),
} as MtTextEditorMeta;

export type MtTextEditorStory = StoryObj<MtTextEditorMeta>;

export const DefaultStory: MtTextEditorStory = {
  name: "mt-text-editor",
};
