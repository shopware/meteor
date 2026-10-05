<script setup lang="ts">
import { ref } from "vue";
import { MtAttachment } from "@shopware-ag/meteor-component-library";

const file = new File(["%PDF"], "price-list.pdf", { type: "application/pdf" });
const showProduct = ref(true);
</script>

<template>
  <div class="attachment-example">
    <mt-attachment :file="file" />
    <mt-attachment
      v-if="showProduct"
      icon="regular-products"
      label="Product: Lamp"
      removable
      @remove="showProduct = false"
    />
  </div>
</template>

<style scoped>
.attachment-example {
  display: flex;
  flex-wrap: wrap;
  gap: var(--scale-size-8);
}
</style>
