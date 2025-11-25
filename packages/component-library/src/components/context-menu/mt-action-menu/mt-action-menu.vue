<template>
    <dropdown-menu-content class="mt-action-menu" :side-offset="8" align="start">
        <slot name="default" />
    </dropdown-menu-content>
</template> 

<script setup lang="ts">
import { DropdownMenuContent } from 'reka-ui';
</script>

<style>
/* Find out why we can't scope styles */
.mt-action-menu {
    background-color: var(--color-elevation-surface-default);
    border: 1px solid var(--color-border-secondary-default);
    box-shadow: 0px 6px 24px -8px var(--color-elevation-shadow-default);
    border-radius: var(--border-radius-m);
    padding: var(--scale-size-4);

    min-width: 320px
}
</style>