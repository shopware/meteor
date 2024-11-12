<template>
  <div class="mt-segmented-control" :data-context="!!disableContext ? 'none' : 'default'">
    <template v-for="action in actions" :key="action.id">
      <div v-if="action === 'divider'" class="mt-segmented-control__divider"></div>

      <component
        v-else
        :is="!!action.hasCheckbox ? 'label' : 'button'"
        @click="!!action.hasCheckbox ? undefined : action.onClick()"
        class="mt-segmented-control__action"
        :data-pressed="!!action.isPressed"
        :disabled="!!action.disabled && !action.hasCheckbox"
        :data-variant="!!action.isCritical ? 'critical' : 'default'"
        :data-context="!!disableContext ? 'none' : 'default'"
        :data-checkbox="!!action.hasCheckbox"
      >
        <div
          style="position: relative; display: flex; align-items: center"
          v-if="!!action.hasCheckbox"
        >
          <input
            type="checkbox"
            :disabled="!!action.disabled"
            class="mt-segmented-control__checkbox"
            @change="
              (event) =>
                action.onClick({ checkboxValue: (event.target as HTMLInputElement).checked })
            "
          />

          <mt-icon class="mt-segmented-control__checkbox-indicator" name="regular-checkmark-xxs" />
        </div>

        <mt-icon
          v-if="!!action.iconName"
          :name="action.iconName"
          size="0.75rem"
          aria-hidden="true"
        />

        <span>{{ action.label }}</span>
      </component>
    </template>
  </div>
</template>

<script setup lang="ts">
import MtIcon from "@/components/icons-media/mt-icon/mt-icon.vue";

type Action =
  | {
      id: string;
      label: string;
      onClick: (data?: { checkboxValue: boolean }) => void;
      isPressed?: boolean;
      isCritical?: boolean;
      iconName?: string;
      hasCheckbox?: boolean;
      disabled?: boolean;
    }
  | "divider";

defineProps<{
  actions: Action[];
  disableContext?: boolean;
}>();
</script>

<style scoped>
.mt-segmented-control {
  --segmented-control-border-width: 1px;

  border: var(--segmented-control-border-width) solid var(--color-border-primary-default);
  border-radius: var(--border-radius-button);
  height: 2rem;
  width: max-content;
  display: flex;
  align-items: center;
  background-color: var(--color-elevation-surface-overlay);

  & > :first-child {
    border-top-left-radius: calc(
      var(--border-radius-button) - var(--segmented-control-border-width)
    );
    border-bottom-left-radius: calc(
      var(--border-radius-button) - var(--segmented-control-border-width)
    );
  }

  & > :last-child {
    border-top-right-radius: calc(
      var(--border-radius-button) - var(--segmented-control-border-width)
    );
    border-bottom-right-radius: calc(
      var(--border-radius-button) - var(--segmented-control-border-width)
    );
  }
}

.mt-segmented-control[data-context="default"] {
  padding: 0.125rem;
  column-gap: 0.125rem;
}

.mt-segmented-control__action {
  padding-inline: 0.75rem;
  font-family: var(--font-family-body);
  font-size: var(--font-size-2xs);
  line-height: var(--font-line-height-2xs);
  font-weight: var(--font-weight-medium);
  height: 100%;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  column-gap: 0.75rem;
  cursor: pointer;
  transition-duration: 0.15s;
  transition-timing-function: ease-out;
  transition-property: background-color, color;

  &:focus-visible {
    box-shadow: inset 0 0 0 2px var(--segmented-control-action-focus-color);
    outline: none;
  }
}

.mt-segmented-control__action[data-variant="default"] {
  --segmented-control-action-focus-color: var(--color-border-brand-selected);

  background-color: var(--color-interaction-secondary-default);
  color: var(--color-text-primary-default);

  &:hover {
    background-color: var(--color-interaction-secondary-hover);
  }

  &:active {
    background-color: var(--color-interaction-secondary-dark);
  }
}

.mt-segmented-control__action[data-variant="default"][data-pressed="true"][data-checkbox="false"] {
  --segmented-control-action-focus-color: var(--color-text-static-default);

  background-color: var(--color-interaction-primary-default);
  color: var(--color-text-static-default);

  &:hover {
    background-color: var(--color-interaction-primary-hover);
  }

  &:active {
    background-color: var(--color-interaction-primary-hover);
  }
}

.mt-segmented-control__action[data-pressed="false"][data-variant="critical"] {
  --segmented-control-action-focus-color: var(--color-border-critical-default);

  color: var(--color-text-critical-default);

  &:hover {
    background-color: var(--color-background-critical-dark);
  }

  &:active {
    --segmented-control-action-focus-color: var(--color-text-static-default);

    color: var(--color-text-static-default);
    background-color: var(--color-interaction-critical-pressed);
  }
}

.mt-segmented-control__action[data-variant="critical"][data-pressed="true"] {
  --segmented-control-action-focus-color: var(--color-text-static-default);

  background-color: var(--color-interaction-critical-default);
  color: var(--color-text-static-default);

  &:hover {
    background-color: var(--color-interaction-critical-hover);
  }

  &:active {
    background-color: var(--color-interaction-critical-pressed);
  }
}

.mt-segmented-control__action[data-context="default"] {
  border-radius: var(--border-radius-button);
}

.mt-segmented-control__action[data-context="none"] {
  border-radius: 0;
}

.mt-segmented-control__checkbox {
  -webkit-appearance: none;
  cursor: pointer;
  position: relative;
  border-radius: var(--border-radius-checkbox);

  &:focus-visible {
    outline: 2px solid var(--color-border-brand-selected);
    outline-offset: 2px;
  }

  &::after {
    pointer-events: none;
    content: "";
    display: block;
    box-sizing: border-box;
    width: 1rem;
    height: 1rem;
    border: 1px solid var(--color-border-primary-default);
    border-radius: var(--border-radius-checkbox);
    background-color: var(--color-background-primary-default);
  }

  &:checked::after {
    background-color: var(--color-interaction-primary-default);
    border-color: var(--color-interaction-primary-default);
  }

  &:checked + .mt-segmented-control__checkbox-indicator {
    display: block;
  }
}

.mt-segmented-control__checkbox-indicator {
  display: none;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.mt-segmented-control__divider {
  background: var(--color-border-primary-default);
  width: 1px;
  height: 1.25rem;
}
</style>
