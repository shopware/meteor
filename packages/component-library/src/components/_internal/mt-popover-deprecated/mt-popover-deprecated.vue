<template>
  <div class="mt-popover-deprecated">
    <div
      v-popover="popoverConfig"
      class="mt-popover-deprecated__wrapper"
      :class="popoverClass"
      :style="componentStyle"
    >
      <slot />
    </div>
  </div>
</template>

<script lang="ts">
import type { PropType } from "vue";
import { defineComponent } from "vue";
import MtPopoverDirective from "../../../directives/popover.directive";

/**
 * @deprecated - Use `mt-floating-ui` instead
 */
export default defineComponent({
  name: "MtPopoverDeprecated",

  directives: {
    popover: MtPopoverDirective,
  },

  props: {
    zIndex: {
      type: [Number, null] as PropType<number | null>,
      required: false,
      default: null,
    },
    resizeWidth: {
      type: Boolean,
      required: false,
      default: false,
    },
    popoverClass: {
      type: [String, Array, Object] as PropType<string | unknown[] | Record<string, unknown>>,
      required: false,
      default: "",
    },
  },

  computed: {
    componentStyle(): { "z-Index": number | null } {
      return {
        "z-Index": this.zIndex,
      };
    },
    popoverConfig(): { active: boolean; resizeWidth: boolean } {
      return {
        active: true,
        resizeWidth: this.resizeWidth,
      };
    },
  },
});
</script>

<style>
.mt-popover-deprecated__wrapper {
  position: inherit;

  &.--placement-bottom-outside {
    transform: translate(0, calc(-100% - 57px));
  }
}
</style>
