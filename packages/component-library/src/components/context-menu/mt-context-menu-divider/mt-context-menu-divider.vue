<template>
  <hr class="mt_context_menu_divider" />
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "MtContextMenuDivider",
});
</script>

<style>
.mt_context_menu_divider {
  border: none;
  border-bottom: 1px solid #d1d9e0;
  margin: 5px -10px;
}
</style>
