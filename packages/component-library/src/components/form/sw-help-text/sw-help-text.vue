<template>
  <span
    v-tooltip="{
      message: text,
      width: width,
      showDelay: showDelay,
      hideDelay: hideDelay,
    }"
    class="sw-help-text"
    role="tooltip"
    aria-label="help-text"
  >
    <sw-icon data-testid="sw-help-text__icon" name="solid-question-circle-s" />
    <span class="sw-help-text__tooltip-text">{{ text }}</span>
  </span>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import SwIcon from "../../icons-media/sw-icon/sw-icon.vue";
import SwTooltipDirective from "../../../directives/tooltip.directive";

/**
 * @internal
 */
export default defineComponent({
  name: "SwHelpText",

  components: {
    "sw-icon": SwIcon,
  },

  directives: {
    tooltip: SwTooltipDirective,
  },

  props: {
    /**
     * The text which gets rendered in the tooltip
     */
    text: {
      type: String,
      required: true,
      default: "",
    },
    /**
     * The width of the tooltip
     */
    width: {
      type: Number,
      required: false,
      default: 200,
    },
    /**
     * Choose the delay until the tooltip gets rendered when it gets hovered
     */
    showDelay: {
      type: Number,
      required: false,
      default: 100,
    },
    /**
     * Choose the delay until the tooltip gets removed the cursor leaves
     */
    hideDelay: {
      type: Number,
      required: false,
      default: 100,
    },
  },
});
</script>

<style lang="scss">
@import "../../assets/scss/variables.scss";

.sw-help-text {
  color: $color-shopware-brand-500;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  pointer-events: auto;

  &__tooltip-text {
    display: none;
  }
}
</style>
