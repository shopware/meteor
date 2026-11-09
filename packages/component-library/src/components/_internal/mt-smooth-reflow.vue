<template>
  <component :is="tag">
    <slot />
  </component>
</template>

<script lang="ts">
import { defineComponent, type ComponentOptionsMixin } from "vue";
import smoothReflow from "vue-smooth-reflow";

export default defineComponent({
  name: "SmoothReflow",

  // vue-smooth-reflow is typed for Vue 2, and its types would end up in our published type files
  mixins: [smoothReflow as ComponentOptionsMixin],

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
