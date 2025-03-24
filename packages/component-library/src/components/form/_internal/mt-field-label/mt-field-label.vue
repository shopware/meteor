<template>
  <label
    :for="id"
    :class="classes"
    @mousedown="
      (event) => {
        // only prevent text selection if clicking inside the label itself
        const target = event.target as HTMLElement;
        if (target.closest('button, input, select, textarea')) return;

        // prevent text selection when double clicking label
        if (!event.defaultPrevented && event.detail > 1) event.preventDefault();
      }
    "
  >
    <button
      type="button"
      v-if="inheritance !== 'none'"
      class="mt-field-label__inheritance-switch"
      :aria-label="inheritance === 'linked' ? t('unlinkInheritance') : t('linkInheritance')"
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

<script setup lang="ts">
import { computed } from "vue";
import MtIcon from "@/components/icons-media/mt-icon/mt-icon.vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n({
  messages: {
    en: {
      linkInheritance: "Link inheritance",
      unlinkInheritance: "Unlink inheritance",
    },
    de: {
      linkInheritance: "Vererbung verknüpfen",
      unlinkInheritance: "Vererbung trennen",
    },
  },
});

const props = withDefaults(
  defineProps<{
    id: string;
    hasError?: boolean;
    required?: boolean;
    inheritance?: "linked" | "unlinked" | "none";
  }>(),
  {
    inheritance: "none",
  },
);

defineEmits<{
  (e: "update:inheritance", value: "linked" | "unlinked"): void;
}>();

const classes = computed(() => [
  "mt-field-label",
  {
    "mt-field-label--with-error": props.hasError,
    "mt-field-label--is-required": props.required,
    "mt-field-label--has-linked-inheritance": props.inheritance === "linked",
  },
]);
</script>

<style scoped>
.mt-field-label {
  display: flex;
  column-gap: var(--scale-size-4);
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
  margin-right: var(--scale-size-4);

  &:focus-visible {
    outline-offset: 0.25rem;
    border-radius: var(--border-radius-2xs);
    outline-color: var(--color-border-brand-selected);
  }
}
</style>
