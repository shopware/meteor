<template>
  <span
    v-tooltip="{
      message: text,
      width: width,
      showDelay: showDelay,
      hideDelay: hideDelay,
    }"
    class="mt-help-text"
    role="tooltip"
    aria-label="help-text"
  >
    <mt-icon data-testid="mt-help-text__icon" name="solid-question-circle-s" />
    <span class="mt-help-text__tooltip-text">{{ text }}</span>
  </span>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import MtIcon from "../../icons-media/mt-icon/mt-icon.vue";
import MtTooltipDirective from "../../../directives/tooltip.directive";

/**
 * @internal
 */
export default defineComponent({
  name: "MtHelpText",

  components: {
    "mt-icon": MtIcon,
  },

  directives: {
    tooltip: MtTooltipDirective,
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
.mt-help-text {
  color: #189eff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  pointer-events: auto;

  &__tooltip-text {
    display: none;
  }
}
</style>
