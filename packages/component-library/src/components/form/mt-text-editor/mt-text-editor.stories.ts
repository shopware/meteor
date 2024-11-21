import type { StoryObj } from "@storybook/vue3";
import MtTextEditor from "./mt-text-editor.vue";
import type { SlottedMeta } from "@/_internal/story-helper";
import MtTextEditorToolbarButtonColor from "./_internal/mt-text-editor-toolbar-button-color.vue";
import { ref } from "vue";

export type MtTextEditorMeta = SlottedMeta<typeof MtTextEditor, "default" | "click">;

export default {
  title: "Components/Form/mt-text-editor",
  component: MtTextEditor,
  args: {
    modelValue: `<h1><span style="color: rgb(5, 220, 235)">Hello</span> <span style="color: rgb(43, 235, 5)">World</span></h1><p><strong>Some</strong> text</p><ol><li><p><a target="_blank" rel="noopener noreferrer nofollow" href="https://www.shopware.com">Lorem</a></p></li><li><p>Ipsum</p></li></ol><table style="min-width: 75px"><colgroup><col style="min-width: 25px"><col style="min-width: 25px"><col style="min-width: 25px"></colgroup><tbody><tr><th colspan="1" rowspan="1"><p><span>First</span></p></th><th colspan="1" rowspan="1"><p>Second</p></th><th colspan="1" rowspan="1"><p>Third</p></th></tr><tr><td colspan="1" rowspan="1"><p>Lorem</p></td><td colspan="1" rowspan="1"><p>Ipsum</p></td><td colspan="1" rowspan="1"><p>non</p></td></tr><tr><td colspan="1" rowspan="1"><p>dolor</p></td><td colspan="1" rowspan="1"><p>sit</p></td><td colspan="1" rowspan="1"><p>amet</p></td></tr></tbody></table><p>After table</p>`,
  },
  render: (args) => ({
    components: { MtTextEditor, MtTextEditorToolbarButtonColor },
    setup() {
      const contentValue = ref(args.modelValue);

      return {
        args,
        contentValue,
      };
    },
    template: `
<div class="wrapper" style="padding: 72px">
  <mt-text-editor v-bind="args" v-model="contentValue">
    <!-- Here we can add custom toolbar buttons -->
  </mt-text-editor>
</div>`,
  }),
} as MtTextEditorMeta;

export type MtTextEditorStory = StoryObj<MtTextEditorMeta>;

export const DefaultStory: MtTextEditorStory = {
  name: "mt-text-editor",
};
