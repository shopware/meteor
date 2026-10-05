<script setup lang="ts">
import {
  MtAttachment,
  MtMessage,
  MtText,
} from "@shopware-ag/meteor-component-library";
</script>

<template>
  <div class="message-example">
    <mt-message from="user">
      <template #attachments>
        <mt-attachment
          url="/price-list.pdf"
          media-type="application/pdf"
          label="price-list.pdf"
        />
      </template>

      <mt-text size="xs">
        Which prices in this list are lower than ours?
      </mt-text>
    </mt-message>

    <mt-message from="assistant">
      <mt-text size="xs">
        Two products are cheaper in the list: the desk lamp by 4 € and the oak
        shelf by 12 €.
      </mt-text>
    </mt-message>
  </div>
</template>

<style scoped>
.message-example {
  display: flex;
  flex-direction: column;
  gap: var(--scale-size-16);
}
</style>
