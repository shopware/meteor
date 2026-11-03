<script setup lang="ts">
import { computed } from "vue";
import MtButton from "@shopware-ag/meteor-component-library/MtButton";
// useCopyToClipboard has no subpath export, so it is imported from the barrel.
import { useCopyToClipboard } from "@shopware-ag/meteor-component-library";

const { status, copy } = useCopyToClipboard();

const buttonText = computed(() => {
  if (status.value === "copied") return "Link copied";
  if (status.value === "failed") return "Copy failed";
  return "Copy link";
});
</script>

<template>
  <mt-button
    variant="secondary"
    @click="copy('https://example.com/products/SW-10001')"
  >
    {{ buttonText }}
  </mt-button>
</template>
