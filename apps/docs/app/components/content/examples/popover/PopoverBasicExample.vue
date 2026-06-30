<script setup lang="ts">
import { ref } from "vue";
import MtPopover from "@shopware-ag/meteor-component-library/MtPopover";
import MtPopoverItem from "@shopware-ag/meteor-component-library/MtPopoverItem";
import MtButton from "@shopware-ag/meteor-component-library/MtButton";

const showStripes = ref(false);
const showOutlines = ref(false);
const numberedColumn = ref(false);
</script>

<template>
  <mt-popover title="Table settings">
    <template #trigger="{ toggleFloatingUi }">
      <mt-button variant="secondary" @click.stop="toggleFloatingUi">
        Toggle popover
      </mt-button>
    </template>

    <template #popover-items__base>
      <mt-popover-item
        label="Numbered column"
        icon="solid-hashtag"
        show-switch
        :switch-value="numberedColumn"
        @change-switch="(value) => (numberedColumn = value)"
      />

      <mt-popover-item
        label="Show stripes"
        icon="solid-bars"
        show-switch
        :switch-value="showStripes"
        @change-switch="(value) => (showStripes = value)"
      />

      <mt-popover-item
        label="Show outlines"
        icon="solid-grip-lines"
        show-switch
        :switch-value="showOutlines"
        @change-switch="(value) => (showOutlines = value)"
      />

      <mt-popover-item
        type="critical"
        label="Reset all changes"
        icon="solid-undo"
        border-top
      />
    </template>
  </mt-popover>
</template>
