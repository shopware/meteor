<template>
    <dropdown-menu-separator class="mt-action-menu-divider" />
</template>

<script setup lang="ts">
import { DropdownMenuSeparator } from 'reka-ui'
</script>

<style scoped>
.mt-action-menu-divider {
    width: calc(100% + var(--scale-size-8));
    height: 1px;
    background-color: var(--color-border-secondary-default);
    margin-inline: calc(var(--scale-size-4) * -1);
    margin-block: var(--scale-size-4);
}
</style>