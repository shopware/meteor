<script setup lang="ts">
import { ref } from "vue";
import MtTextEditor from "@shopware-ag/meteor-component-library/MtTextEditor";
import Highlight from "@tiptap/extension-highlight";

const content = ref(
  '<h1>Hello <mark>World</mark></h1><p>In the toolbar you see now a new highlight button.</p>',
);

const customTipTapConfig = {
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
</script>

<template>
  <mt-text-editor
    v-model="content"
    :custom-buttons="customButtons"
    :tip-tap-config="customTipTapConfig"
  />
</template>
