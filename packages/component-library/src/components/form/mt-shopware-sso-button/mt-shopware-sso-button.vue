<template>
  <mt-button
    class="mt-shopware-sso-button"
    variant="primary"
    :block="block"
    :disabled="disabled"
    :is="is"
    v-bind="$attrs"
  >
    <slot>
      Login with Shopware SSO
    </slot>

    <template #iconBack="slotProps">
      <mt-icon name="solid-shopware" :size="`${slotProps.size}px`" decorative />
    </template>
  </mt-button>
  
</template>

<script setup lang="ts">
import MtButton from "@/components/form/mt-button/mt-button.vue";
import MtIcon from "@/components/icons-media/mt-icon/mt-icon.vue";

withDefaults(
  defineProps<{
    is?: string;
    disabled?: boolean;
    block?: boolean;
  }>(),
  {
    is: "button",
  },
);
</script>

<style scoped>
.mt-shopware-sso-button :deep(.mt-button__content) {
  column-gap: var(--scale-size-12);
}

.mt-shopware-sso-button :deep(.mt-icon) {
  color: var(--color-static-white);
}
</style>


