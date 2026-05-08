import type { StoryObj } from "@storybook/vue3";
import MtTextEditor from "./mt-text-editor.vue";
import type { SlottedMeta } from "@/_internal/story-helper";
import MtTextEditorToolbarButtonColor from "./_internal/mt-text-editor-toolbar-button-color.vue";
import MtButton from "../mt-button/mt-button.vue";
import { ref, onMounted, onBeforeUnmount } from "vue";
import Highlight from "@tiptap/extension-highlight";
import { fn } from "@storybook/test";
import "./mt-text-editor.stories.css";

const storyBodyClass = "mt-text-editor-story--fullscreen-fix";
const useFullscreenStoryBodyClass = () => {
  onMounted(() => {
    if (typeof document === "undefined") return;
    document.body.classList.add(storyBodyClass);
  });
  onBeforeUnmount(() => {
    if (typeof document === "undefined") return;
    document.body.classList.remove(storyBodyClass);
  });
};

export type MtTextEditorMeta = SlottedMeta<
  typeof MtTextEditor,
  "default" | "click" | "updateModelValue"
>;

export default {
  title: "Components/Text Editor",
  component: MtTextEditor,
  parameters: {
    layout: "fullscreen",
  },
  args: {
    modelValue: `<h1><span style="color: rgb(5, 220, 235)">Hello</span> <span style="color: rgb(43, 235, 5)">World</span></h1><p><strong>Some</strong> text</p><ol><li><p><a target="_blank" rel="noopener noreferrer nofollow" href="https://www.shopware.com">Lorem</a></p></li><li><p>Ipsum</p></li></ol><table style="min-width: 75px"><colgroup><col style="min-width: 25px"><col style="min-width: 25px"><col style="min-width: 25px"></colgroup><tbody><tr><th colspan="1" rowspan="1"><p>First</p></th><th colspan="1" rowspan="1"><p>Second</p></th><th colspan="1" rowspan="1"><p>Third</p></th></tr><tr><td colspan="1" rowspan="1"><p>Lorem</p></td><td colspan="1" rowspan="1"><p>Ipsum</p></td><td colspan="1" rowspan="1"><p>non</p></td></tr><tr><td colspan="1" rowspan="1"><p>dolor</p></td><td colspan="1" rowspan="1"><p>sit</p></td><td colspan="1" rowspan="1"><p>amet</p></td></tr></tbody></table><p>After table</p>`,
    updateModelValue: fn(),
    label: "My Text editor",
  },
  render: (args) => ({
    components: { MtTextEditor, MtTextEditorToolbarButtonColor },
    setup() {
      useFullscreenStoryBodyClass();

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
<div class="wrapper mt-text-editor-story__wrapper">
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

export const Default: MtTextEditorStory = {};

export const InlineEditStory: MtTextEditorStory = {
  name: "Inline edit",
  args: {
    isInlineEdit: true,
  },
};

export const CustomButtonsStory: MtTextEditorStory = {
  name: "Custom buttons",
  args: {
    modelValue: `<h1>Hello <mark>World</mark></h1><p>In the toolbar you see now a new highlight button.</p>`,
  },
  render: (args) => ({
    components: { MtTextEditor },
    setup() {
      useFullscreenStoryBodyClass();

      const currentModelValue = ref(args.modelValue);
      const onUpdateModelValue = (value: string) => {
        currentModelValue.value = value;
        args.updateModelValue(value);
      };

      const tipTapConfig = {
        extensions: [Highlight],
      };

      const customButtons = [
        {
          name: "highlight",
          label: "Highlight",
          icon: "regular-circle-xs",
          action: (editor: any) => {
            editor.chain().focus().toggleMark("highlight").run();
          },
        },
      ];

      return {
        args,
        currentModelValue,
        onUpdateModelValue,
        tipTapConfig,
        customButtons,
      };
    },
    template: `
<div class="wrapper mt-text-editor-story__wrapper">
  <mt-text-editor
    v-bind="args"
    :modelValue="currentModelValue"
    :tip-tap-config="tipTapConfig"
    :custom-buttons="customButtons"
    @update:modelValue="onUpdateModelValue"
  />
</div>`,
  }),
};

export const DiffModalStory: MtTextEditorStory = {
  name: "Diff modal",
  args: {
    modelValue: '<div class="box" data-custom="123">\n  <p>Content</p>\n</div>',
    updateModelValue: fn(),
    label: "My Text editor",
  },
  render: (args) => ({
    components: { MtTextEditor },
    setup() {
      useFullscreenStoryBodyClass();

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
<div class="wrapper mt-text-editor-story__wrapper">
  <mt-text-editor
    v-bind="args"
    :modelValue="currentModelValue"
    @update:modelValue="onUpdateModelValue"
  />
  <p style="margin-top: 16px; color: var(--color-text-secondary-default);">
    The given HTML contains a custom attribute (data-custom="123"). When the user
    starts to edit, the content would be changed. Therefore this overlay is shown
    to the user. Same check is done also when switching from code to WYSIWYG mode.
  </p>
</div>`,
  }),
};

export const HiddenToolbarStory: MtTextEditorStory = {
  name: "Hidden toolbar",
  args: {
    modelValue: `<h1>Editor without toolbar</h1><p>The toolbar is completely hidden in this example. This is useful when you want a simpler editing experience or want to implement your own custom toolbar.</p>`,
    showToolbar: false,
    label: "Editor without toolbar",
  },
};

export const CodeModeStory: MtTextEditorStory = {
  name: "Code mode by default",
  args: {
    modelValue: `<h1>Starting in code mode</h1><p>This editor starts in code mode by default. You can toggle to WYSIWYG using the toggle button.</p>`,
    codeMode: true,
    label: "Code mode editor",
  },
};

export const CodeModeTwoWayBindingStory: MtTextEditorStory = {
  name: "Code mode two-way binding",
  args: {
    modelValue: `<h1>Programmatic mode control</h1><p>Use the button above to toggle between code and WYSIWYG mode programmatically.</p>`,
    updateModelValue: fn(),
    label: "Controlled mode editor",
  },
  render: (args) => ({
    components: { MtTextEditor, MtButton },
    setup() {
      useFullscreenStoryBodyClass();

      const currentModelValue = ref(args.modelValue);
      const isCodeMode = ref(false);

      const onUpdateModelValue = (value: string) => {
        currentModelValue.value = value;
        args.updateModelValue(value);
      };

      const toggleMode = () => {
        isCodeMode.value = !isCodeMode.value;
      };

      return {
        args,
        currentModelValue,
        isCodeMode,
        onUpdateModelValue,
        toggleMode,
      };
    },
    template: `
<div class="wrapper mt-text-editor-story__wrapper">
  <div class="mt-text-editor-story__row">
    <mt-button 
      @click="toggleMode" 
      style="margin-bottom: 16px;"
    >
      Toggle Mode (Currently: {{ isCodeMode ? 'Code' : 'WYSIWYG' }})
    </mt-button>
  </div>
  <mt-text-editor
    v-bind="args"
    :modelValue="currentModelValue"
    v-model:code-mode="isCodeMode"
    @update:modelValue="onUpdateModelValue"
  />
  <p style="margin-top: 16px; color: var(--color-text-secondary-default);">
    The editor mode can be controlled programmatically using v-model:code-mode.
    Click the button above to toggle between modes.
  </p>
</div>`,
  }),
};
