<script setup lang="ts">
import MtCard from "@shopware-ag/meteor-component-library/MtCard";
import MtLoader from "@shopware-ag/meteor-component-library/MtLoader";
</script>

<template>
  <!-- Wrapper carries the scope id so the :deep rule can reach .mt-card__content. -->
  <div>
    <mt-card>
      <div class="generate-loader">
        <mt-loader
          :backdrop="false"
          size="32px"
          title="Generating"
          description="3 of 12 invoices generated"
        />
      </div>
    </mt-card>
  </div>
</template>

<style scoped>
/* Roomier 48px padding around the loader. `.mt-card` lifts specificity above
   MtCard's own padding rule. */
:deep(.mt-card .mt-card__content) {
  --mt-card-content-padding: var(--scale-size-48);
}
/* mt-loader is absolutely positioned and fills its nearest positioned ancestor,
   so give it a sized, relative box to center within. */
.generate-loader {
  position: relative;
  height: var(--scale-size-96);
}
</style>
