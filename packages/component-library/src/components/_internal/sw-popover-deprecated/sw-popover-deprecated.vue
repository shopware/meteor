<template>
  <div class="sw-popover-deprecated">
    <div
      v-popover="popoverConfig"
      class="sw-popover-deprecated__wrapper"
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
import SwPopoverDirective from "../../../directives/popover.directive";

/**
 * @deprecated - Use `sw-floating-ui` instead
 */
export default defineComponent({
  name: "SwPopover",

  directives: {
    popover: SwPopoverDirective,
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

<style lang="scss">
.sw-popover-deprecated {
  .sw-popover-deprecated__wrapper {
    position: inherit;
  }
}

.sw-popover-deprecated__wrapper {
  &.--placement-bottom-outside {
    transform: translate(0, calc(-100% - 57px));
  }
}
</style>
