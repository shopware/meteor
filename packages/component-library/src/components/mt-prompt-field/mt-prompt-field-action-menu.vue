<template>
  <dropdown-menu-root>
    <dropdown-menu-trigger as-child>
      <mt-button
        variant="tertiary"
        square
        :disabled="context.disabled.value"
        :aria-label="label ?? t('label')"
      >
        <template #iconFront>
          <mt-icon :name="icon" size="14" decorative />
        </template>
      </mt-button>
    </dropdown-menu-trigger>

    <dropdown-menu-portal>
      <mt-action-menu>
        <slot />
      </mt-action-menu>
    </dropdown-menu-portal>
  </dropdown-menu-root>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { DropdownMenuPortal, DropdownMenuRoot, DropdownMenuTrigger } from "reka-ui";
import MtActionMenu from "@/components/mt-action-menu/mt-action-menu.vue";
import MtButton from "@/components/mt-button/mt-button.vue";
import MtIcon from "@/components/mt-icon/mt-icon.vue";
import { usePromptFieldContext } from "./composables/usePromptFieldContext";

/**
 * The **+** menu of `mt-prompt-field`, placed in its `tools` slot. The default slot holds the
 * items: `mt-action-menu-item`s, submenus or `mt-prompt-field-add-attachments`.
 *
 * @experimental This can be used, but the API may still change in a future release.
 */
withDefaults(
  defineProps<{
    /** The accessible name of the trigger. Defaults to a translated "Add to prompt". */
    label?: string;
    /** The icon of the trigger. */
    icon?: string;
  }>(),
  {
    label: undefined,
    icon: "regular-plus",
  },
);

defineSlots<{
  /** The menu items. */
  default?(): unknown;
}>();

const context = usePromptFieldContext("mt-prompt-field-action-menu");

const { t } = useI18n({
  messages: {
    en: { label: "Add to prompt" },
    de: { label: "Zum Prompt hinzufügen" },
  },
});
</script>
