<script setup lang="ts">
import MtCollapsible from "@shopware-ag/meteor-component-library/MtCollapsible";
import MtCollapsibleTrigger from "@shopware-ag/meteor-component-library/MtCollapsibleTrigger";
import MtCollapsibleContent from "@shopware-ag/meteor-component-library/MtCollapsibleContent";
import MtButton from "@shopware-ag/meteor-component-library/MtButton";
</script>

<template>
  <mt-collapsible>
    <mt-collapsible-trigger as-child>
      <mt-button variant="primary">Toggle content</mt-button>
    </mt-collapsible-trigger>

    <mt-collapsible-content>
      <p style="margin-top: 8px; font-size: var(--font-size-xs);">
        This content is revealed and hidden by the trigger above.
      </p>
    </mt-collapsible-content>
  </mt-collapsible>
</template>
