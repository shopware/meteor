<template>
  <hr class="sw_context_menu_divider" />
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "SwContextMenuDivider",
});
</script>

<style lang="scss">
@import "../../assets/scss/variables.scss";

$sw-context-menu-color-border: $color-gray-300;

.sw_context_menu_divider {
  border: none;
  border-bottom: 1px solid $sw-context-menu-color-border;
  margin: 5px -10px;
}
</style>
