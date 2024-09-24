<template>
  <button
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
  </button>
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

<style scoped>
.mt-help-text {
  color: var(--color-icon-brand-default);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  position: relative;
  border-radius: var(--border-radius-round);

  &:focus-visible {
    outline-offset: 0.25rem;
    outline: 2px solid var(--color-border-brand-selected);
  }

  &:where(:hover, :focus-visible) {
    color: var(--color-icon-brand-hover);
  }
}

.mt-help-text::after {
  content: "";
  display: block;
  position: absolute;
  inset: 0;
  background-color: var(--color-icon-static-default);
  z-index: -1;
  border-radius: var(--border-radius-round);
}

.mt-help-text__tooltip-text {
  display: none;
}
</style>
