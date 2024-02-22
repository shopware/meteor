<template>
  <component :is="tag">
    <slot />
  </component>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import smoothReflow from "vue-smooth-reflow";

export default defineComponent({
  name: "SmoothReflow",

  mixins: [smoothReflow],

  props: {
    tag: {
      type: String,
      required: false,
      default: "div",
    },
    options: {
      type: Object,
      required: false,
      default: () => ({
        property: ["height", "width", "transform"],
        transition: "height .2s, width .2s, transform .2s",
      }),
    },
  },

  mounted() {
    // @ts-expect-error - smoothReflow is not typed
    this.$smoothReflow(this.options);
  },
});
</script>
