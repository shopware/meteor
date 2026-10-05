<script setup lang="ts">
import {
  MtButton,
  MtIcon,
  MtUser,
} from "@shopware-ag/meteor-component-library";
</script>

<template>
  <div class="user-example">
    <mt-user name="Mila Hoffmann" subtitle="mila.hoffmann@example.com">
      <template #suffix>
        <mt-button
          variant="tertiary"
          size="small"
          square
          aria-label="Account menu"
        >
          <mt-icon name="regular-ellipsis-v" size="var(--scale-size-16)" />
        </mt-button>
      </template>
    </mt-user>
  </div>
</template>

<style scoped>
.user-example {
  max-width: 15rem;
}
</style>
