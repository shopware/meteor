<template>
  <div
    class="sw-inheritance-switch"
    :class="{
      'sw-inheritance-switch--disabled': disabled,
      'sw-inheritance-switch--is-inherited': isInherited,
      'sw-inheritance-switch--is-not-inherited': !isInherited,
    }"
  >
    <sw-icon
      v-if="isInherited"
      key="inherit-icon"
      v-tooltip="{
        message: $tc('sw-inheritance-switch.tooltipRemoveInheritance'),
        disabled: disabled,
      }"
      data-testid="sw-inheritance-switch-icon"
      :multicolor="true"
      name="regular-lock-s"
      @click="onClickRemoveInheritance"
    />
    <sw-icon
      v-else
      key="uninherit-icon"
      v-tooltip="{
        message: $tc('sw-inheritance-switch.tooltipRestoreInheritance'),
        disabled: disabled,
      }"
      :class="unInheritClasses"
      :multicolor="true"
      name="regular-lock-open-s"
      size="14"
      @click="onClickRestoreInheritance"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import SwTooltipDirective from "../../../../directives/tooltip.directive";
import SwIcon from "../../../icons-media/sw-icon/sw-icon.vue";

export default defineComponent({
  name: "SwInheritanceSwitch",

  i18n: {
    messages: {
      en: {
        "sw-inheritance-switch": {
          tooltipRemoveInheritance: "Remove inheritance",
          tooltipRestoreInheritance: "Restore inheritance",
        },
      },
      de: {
        "sw-inheritance-switch": {
          tooltipRemoveInheritance: "Vererbung entfernen",
          tooltipRestoreInheritance: "Vererbung wiederherstellen",
        },
      },
    },
  },

  components: {
    "sw-icon": SwIcon,
  },

  directives: {
    tooltip: SwTooltipDirective,
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
});
</script>

<style lang="scss">
.sw-inheritance-switch {
  cursor: pointer;
  margin-top: -1px;

  &.sw-inheritance-switch--disabled {
    cursor: default;
  }
}
</style>
