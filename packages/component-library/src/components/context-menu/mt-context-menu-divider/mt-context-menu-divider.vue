<template>
  <hr class="mt_context_menu_divider" />
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "MtContextMenuDivider",
});
</script>

<style lang="scss">
$mt-context-menu-color-border: $color-gray-300;

.mt_context_menu_divider {
  border: none;
  border-bottom: 1px solid $mt-context-menu-color-border;
  margin: 5px -10px;
}
</style>
