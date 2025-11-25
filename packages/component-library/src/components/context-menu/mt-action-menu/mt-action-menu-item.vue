<template>
    <dropdown-menu-item :class="['mt-action-menu-item', `mt-action-menu-item--variant-${variant}`]" :disabled="disabled">
        <mt-icon v-if="!!icon" :name="icon" size="16" mode="solid" />

        <slot name="default" />

        <span v-if="shortcutText" class="mt-action-menu-item__shortcut">
            {{ shortcutText }}
        </span>
    </dropdown-menu-item>
</template>

<script setup lang="ts">
import { DropdownMenuItem } from 'reka-ui';
import MtIcon from '../../icons-media/mt-icon/mt-icon.vue';
import { computed } from 'vue';

const props = withDefaults(defineProps<{
    variant?: 'default' | 'critical';
    icon: string;
    disabled?: boolean;
    shortcut?: {
        pc: string;
        mac: string;
    };
}>(), {
    variant: 'default',
    disabled: false,
    shortcut: undefined,
});

const isMac = typeof navigator !== 'undefined' && /Mac|iPod|iPhone|iPad/.test(navigator.platform);

const shortcutText = computed(() => {
    if (!props.shortcut) return undefined;
    return isMac ? props.shortcut.mac : props.shortcut.pc;
});
</script>

<style scoped>
.mt-action-menu-item {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: var(--scale-size-8);
    font-size: var(--font-size-xs);
    font-family: var(--font-family-body);
    line-height: var(--font-line-height-xs);
    font-weight: var(--font-weight-regular);
    min-height: var(--scale-size-32);
    padding-inline: var(--scale-size-10);
    border-radius: var(--border-radius-s);
    cursor: pointer;

    &[data-highlighted] {
        background-color: var(--color-interaction-secondary-hover);
        outline: none;
    }

    &:active:not([data-disabled]) {
        background: var(--color-interaction-secondary-pressed);
    }
}

.mt-action-menu-item--variant-default {
    color: var(--color-text-primary-default);

    &[data-disabled] {
        color: var(--color-text-primary-disabled);
        cursor: not-allowed;
    }
}

.mt-action-menu-item--variant-critical {
    color: var(--color-text-critical-default);

    &[data-disabled] {
        color: var(--color-text-critical-disabled);
        cursor: not-allowed;
    }
}

.mt-action-menu-item__shortcut {
    margin-left: auto;
    color: var(--color-text-secondary-default);
    font-size: var(--font-size-xs);
    font-family: var(--font-family-body);
    line-height: var(--font-line-height-xs);
    font-weight: var(--font-weight-regular);
}
</style>