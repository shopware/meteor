<template>
  <div
    class="mt-inheritance-switch"
    :class="{
      'mt-inheritance-switch--disabled': disabled,
      'mt-inheritance-switch--is-inherited': isInherited,
      'mt-inheritance-switch--is-not-inherited': !isInherited,
    }"
  >
    <mt-icon
      v-if="isInherited"
      key="inherit-icon"
      v-tooltip="{
        message: t('tooltipRemoveInheritance'),
        disabled: disabled,
      }"
      data-testid="mt-inheritance-switch-icon"
      :multicolor="true"
      name="regular-link-horizontal"
      size="14"
      @click="onClickRemoveInheritance"
    />
    <mt-icon
      v-else
      key="uninherit-icon"
      v-tooltip="{
        message: t('tooltipRestoreInheritance'),
        disabled: disabled,
      }"
      :class="unInheritClasses"
      :multicolor="true"
      name="regular-link-horizontal-slash"
      size="14"
      @click="onClickRestoreInheritance"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import MtTooltipDirective from "../../../../directives/tooltip.directive";
import MtIcon from "../../../icons-media/mt-icon/mt-icon.vue";
import { useI18n } from "@/composables/useI18n";

export default defineComponent({
  name: "MtInheritanceSwitch",

  components: {
    "mt-icon": MtIcon,
  },

  directives: {
    tooltip: MtTooltipDirective,
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

  computed: {
    unInheritClasses(): { "is--clickable": boolean } {
      return { "is--clickable": !this.disabled };
    },
  },

  methods: {
    onClickRestoreInheritance() {
      if (this.disabled) {
        return;
      }
      this.$emit("inheritance-restore");
    },

    onClickRemoveInheritance() {
      if (this.disabled) {
        return;
      }
      this.$emit("inheritance-remove");
    },
  },

  setup() {
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

    return { t };
  },
});
</script>

<style lang="scss">
.mt-inheritance-switch {
  cursor: pointer;
  margin-top: -1px;

  &.mt-inheritance-switch--disabled {
    cursor: default;
  }
}
</style>
