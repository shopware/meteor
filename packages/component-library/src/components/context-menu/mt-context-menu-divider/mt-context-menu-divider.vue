<template>
  <hr class="mt_context_menu_divider" />
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "MtContextMenuDivider",
});
</script>

<style scoped>
.mt_context_menu_divider {
  border: none;
  border-bottom: 1px solid var(--color-border-primary-default);
  margin: 5px -10px;
}
</style>
