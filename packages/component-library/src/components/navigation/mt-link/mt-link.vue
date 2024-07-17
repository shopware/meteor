<template>
  <component
    :is="as"
    class="mt-link"
    :class="linkClasses"
    :aria-disabled="disabled"
    :tabindex="disabled ? -1 : 0"
    v-bind="to ? { ...$attrs, to } : $attrs"
    @click="onClick"
  >
    <slot />
  </component>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import type { PropType } from "vue";

export default defineComponent({
  name: "MtLink",

  props: {
    /**
     * Set the element type of the link
     */
    as: {
      type: String,
      required: false,
      default: "router-link",
    },

    /**
     * Set the to prop of the router/nuxt-link
     */
    to: {
      type: String,
      required: false,
      default: undefined,
    },

    /**
     * Render the link in various styles
     */
    variant: {
      type: String as PropType<"primary" | "critical">,
      required: false,
      default: "primary",
      validator(value: string) {
        if (!value.length) {
          return true;
        }
        return ["primary", "critical"].includes(value);
      },
    },

    /**
     * Make the link unclickable
     */
    disabled: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  computed: {
    linkClasses() {
      return {
        [`mt-link--${this.variant}`]: !!this.variant,
        "mt-link--disabled": this.disabled,
      };
    },
  },

  methods: {
    onClick(event: MouseEvent) {
      if (this.disabled) {
        event.preventDefault();
        event.stopImmediatePropagation();
        return;
      }

      this.$emit("click", event);
    },
  },
});
</script>

<style scoped>
.mt-link {
  display: inline-block;
  cursor: pointer;
  margin: 0;
  font-family: var(--font-family-body);
  font-size: var(--font-size-xs);
  line-height: var(--font-line-height-xs);
  font-weight: var(--font-weight-medium);
  text-decoration: underline;
}

.mt-link:is(:disabled, .mt-link--disabled) {
  cursor: not-allowed;
  pointer-events: none;
}

.mt-link--primary {
  color: var(--color-text-brand-default);
}

.mt-link--primary:is(:hover, :active) {
  color: var(--color-text-brand-hover);
}

.mt-link--primary:is(:disabled, .mt-link--disabled) {
  color: var(--color-text-brand-disabled);
}

.mt-link--critical {
  color: var(--color-text-critical-default);
}

.mt-link--critical:is(:hover, :active) {
  color: var(--color-text-critical-hover);
}

.mt-link--critical:is(:disabled, .mt-link--disabled) {
  color: var(--color-text-critical-disabled);
}
</style>
