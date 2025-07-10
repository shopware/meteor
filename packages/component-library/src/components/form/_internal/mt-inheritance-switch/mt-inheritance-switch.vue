<template>
  <mt-tooltip
    :content="isInherited ? t('tooltipRemoveInheritance') : t('tooltipRestoreInheritance')"
  >
    <template #default="props">
      <button
        v-bind="props"
        :class="[
          'mt-inheritance-switch',
          {
            'mt-inheritance-switch--disabled': disabled,
            'mt-inheritance-switch--is-inherited': isInherited,
            'mt-inheritance-switch--is-not-inherited': !isInherited,
          },
        ]"
        :disabled="disabled"
        @click="isInherited ? $emit('inheritanceRemove') : $emit('inheritanceRestore')"
      >
        <mt-icon
          v-if="isInherited"
          data-testid="mt-inheritance-switch-icon"
          :multicolor="true"
          name="regular-link-horizontal"
          size="14"
        />

        <mt-icon v-else :multicolor="true" name="regular-link-horizontal-slash" size="14" />
      </button>
    </template>
  </mt-tooltip>
</template>

<script setup lang="ts">
import MtIcon from "../../../icons-media/mt-icon/mt-icon.vue";
import MtTooltip from "@/components/overlay/mt-tooltip/mt-tooltip.vue";
import { useI18n } from "vue-i18n";

defineProps<{
  isInherited: boolean;
  disabled?: boolean;
}>();

const { t } = useI18n({
  messages: {
    en: {
      tooltipRemoveInheritance: "Remove inheritance",
      tooltipRestoreInheritance: "Restore inheritance",
    },
    de: {
      tooltipRemoveInheritance: "Vererbung entfernen",
      tooltipRestoreInheritance: "Vererbung wiederherstellen",
    },
  },
});

defineEmits<{
  inheritanceRemove: [];
  inheritanceRestore: [];
}>();
</script>

<style scoped>
.mt-inheritance-switch {
  cursor: pointer;
  margin-top: -1px;

  outline-width: var(--scale-size-2);
  outline-color: var(--color-border-brand-selected);
  outline-offset: var(--scale-size-2);
}

.mt-inheritance-switch--disabled {
  cursor: default;
}
</style>
