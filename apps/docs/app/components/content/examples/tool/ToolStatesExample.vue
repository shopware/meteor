<script setup lang="ts">
import { MtTool, MtToolHeader } from "@shopware-ag/meteor-component-library";
</script>

<template>
  <div class="tool-states-example">
    <mt-tool>
      <mt-tool-header type="tool-searchProducts" state="input-streaming" />
    </mt-tool>
    <mt-tool>
      <mt-tool-header type="tool-searchProducts" state="input-available" />
    </mt-tool>
    <mt-tool>
      <mt-tool-header type="tool-updateStock" state="approval-requested" />
    </mt-tool>
    <mt-tool>
      <mt-tool-header type="tool-updateStock" state="approval-responded" />
    </mt-tool>
    <mt-tool>
      <mt-tool-header type="tool-searchProducts" state="output-available" />
    </mt-tool>
    <mt-tool>
      <mt-tool-header type="tool-readPage" state="output-error" />
    </mt-tool>
    <mt-tool>
      <mt-tool-header type="tool-updateStock" state="output-denied" />
    </mt-tool>
  </div>
</template>

<style scoped>
.tool-states-example {
  display: grid;
  gap: var(--scale-size-8);
}
</style>
