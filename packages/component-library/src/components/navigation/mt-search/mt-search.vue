<template>
  <div :class="['mt-search', `mt-search--size-${size}`, { 'mt-search--disabled': disabled }]">
    <input
      :value="modelValue"
      @input="onInput"
      @change="onChange"
      class="mt-search__input"
      :disabled="disabled"
      type="text"
      :placeholder="placeholder || $t('mt-search.searchPlaceholder')"
    />

    <mt-icon name="regular-search-s" size="1rem" color="var(--color-icon-primary-default)" />
  </div>
</template>

<script lang="ts">
import MtIcon from "../../icons-media/mt-icon/mt-icon.vue";
import { defineComponent } from "vue";

export default defineComponent({
  components: {
    "mt-icon": MtIcon,
  },

  props: {
    /**
     * The value of the search field.
     */
    modelValue: {
      type: String,
      required: false,
      default: "",
    },

    /**
     * A placeholder text being displayed if no value is set.
     */
    placeholder: {
      type: String,
      required: false,
      default: "",
    },

    /**
     * The size of the search field.
     *
     * @values small, default
     */
    size: {
      type: String,
      required: false,
      default: "default",
      validator: (value: string) => {
        return ["small", "default"].includes(value);
      },
    },

    /**
     * Determines if the field is disabled.
     */
    disabled: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  i18n: {
    messages: {
      en: {
        "mt-search": {
          searchPlaceholder: "Search",
        },
      },
      de: {
        "mt-search": {
          searchPlaceholder: "Suchen",
        },
      },
    },
  },

  emits: ["change", "update:modelValue"],

  setup(_, { emit }) {
    const onChange = (event: Event) => {
      // @ts-expect-error - target is defined
      emit("change", event.target.value || "");
    };

    const onInput = (event: Event) => {
      // @ts-expect-error - target is defined
      emit("update:modelValue", event.target.value);
    };

    return {
      onChange,
      onInput,
    };
  },
});
</script>

<style scoped>
.mt-search {
  background: var(--color-elevation-surface-raised);
  border: 1px solid var(--color-border-primary-default);
  border-radius: var(--border-radius-xs);
  color: var(--color-text-primary-default);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-regular);
  line-height: var(--font-line-height-xs);
  overflow: hidden;
  display: flex;
  align-items: center;

  &:focus-within {
    border-color: var(--color-border-brand-selected);
    box-shadow: 0 0 4px 0 rgba(24, 158, 255, 0.3);
  }
}

.mt-search--size-default {
  padding: 0.75rem 1rem;
}

.mt-search--size-small {
  padding: 0.25rem 1rem;
}

.mt-search__input {
  display: block;
  width: 100%;
  border: none;
  background: transparent;
  font-size: var(--font-size-xs);
  font-family: var(--font-size-body);
  line-height: var(--font-line-height-xs);
  color: var(--color-text-primary-default);
  outline: none;
  -webkit-appearance: none;
  -moz-appearance: none;

  &::placeholder {
    color: var(--color-text-secondary-default);
  }

  &:disabled {
    color: var(--color-text-primary-disabled);

    &::placeholder {
      color: var(--color-text-secondary-disabled);
    }
  }
}

.mt-search--disabled {
  background-color: var(--color-background-primary-disabled);
}
</style>
