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
      >
        <mt-icon
          v-if="isInherited"
          key="inherit-icon"
          data-testid="mt-inheritance-switch-icon"
          :multicolor="true"
          name="regular-link-horizontal"
          size="14"
          @click="onClickRemoveInheritance"
        />

        <mt-icon
          v-else
          key="uninherit-icon"
          :class="{
            'is--clickable': !disabled,
          }"
          :multicolor="true"
          name="regular-link-horizontal-slash"
          size="14"
          @click="onClickRestoreInheritance"
        />
      </button>
    </template>
  </mt-tooltip>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import MtIcon from "../../../icons-media/mt-icon/mt-icon.vue";
import MtTooltip from "@/components/overlay/mt-tooltip/mt-tooltip.vue";
import { useI18n } from "vue-i18n";

export default defineComponent({
  name: "MtInheritanceSwitch",

  components: {
    "mt-icon": MtIcon,
    MtTooltip,
  },

  props: {
    isInherited: {
      type: Boolean,
      required: true,
      default: false,
    },

    disabled: {
      type: Boolean,
      required: false,
      default: false,
    },
  },

  setup(props, { emit }) {
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

    function onClickRestoreInheritance() {
      if (props.disabled) return;

      emit("inheritance-restore");
    }

    function onClickRemoveInheritance() {
      if (props.disabled) return;

      emit("inheritance-remove");
    }

    return { t, onClickRemoveInheritance, onClickRestoreInheritance };
  },
});
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
