<template>
  <label :for="id" :class="classes">
    <button
      v-if="inheritance !== 'none'"
      class="mt-field-label__inheritance-switch"
      :aria-label="
        inheritance === 'linked'
          ? $t('mt-field-label.unlinkInheritance')
          : $t('mt-field-label.linkInheritance')
      "
      @click="$emit('update:inheritance', inheritance === 'linked' ? 'unlinked' : 'linked')"
    >
      <mt-icon
        size="1rem"
        aria-hidden="true"
        :name="
          inheritance === 'linked' ? 'regular-link-horizontal' : 'regular-link-horizontal-slash'
        "
      />
    </button>

    <slot />
  </label>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import MtIcon from "@/components/icons-media/mt-icon/mt-icon.vue";

export default defineComponent({
  name: "MtFieldLabel",

  components: {
    MtIcon,
  },

  i18n: {
    messages: {
      en: {
        "mt-field-label": {
          linkInheritance: "Link inheritance",
          unlinkInheritance: "Unlink inheritance",
        },
      },
      de: {
        "mt-field-label": {
          linkInheritance: "Vererbung verknüpfen",
          unlinkInheritance: "Vererbung trennen",
        },
      },
    },
  },

  props: {
    id: {
      type: String,
      required: true,
    },

    hasError: {
      type: Boolean,
      required: false,
      default: false,
    },

    required: {
      type: Boolean,
      required: false,
      default: false,
    },

    inheritance: {
      type: String,
      required: false,
      default: "none",
      validator: (value: string) => ["linked", "unlinked", "none"].includes(value),
    },
  },

  emits: ["update:inheritance"],

  setup(props) {
    const classes = computed(() => ({
      "mt-field-label": true,
      "mt-field-label--with-error": props.hasError,
      "mt-field-label--is-required": props.required,
      "mt-field-label--has-linked-inheritance": props.inheritance === "linked",
    }));

    return {
      classes,
    };
  },
});
</script>

<style scoped>
.mt-field-label {
  display: flex;
  column-gap: 0.25rem;
  align-items: center;
  color: var(--color-text-primary-default);
  font-family: var(--font-family-body);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-regular);
  line-height: var(--font-line-height-xs);
}

.mt-field-label--is-required::after {
  content: "*";
  color: var(--color-text-brand-default);
}

.mt-field-label--has-linked-inheritance {
  color: var(--color-text-accent-default);
}

.mt-field-label--with-error {
  color: var(--color-text-critical-default);
}

.mt-field-label__inheritance-switch {
  margin-right: 0.25rem;

  &:focus-visible {
    outline-offset: 0.25rem;
    border-radius: var(--border-radius-2xs);
    outline-color: var(--color-border-brand-selected);
  }
}
</style>
