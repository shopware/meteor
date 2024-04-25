<template>
  <mt-base-field class="mt-search" :disabled="disabled" :has-focus="hasFocus" :size="size">
    <template #element="{ identification }">
      <mt-icon name="regular-search-s" />

      <input
        :id="identification"
        class="mt-search__text-input"
        type="text"
        :name="identification"
        :disabled="disabled"
        :value="currentValue"
        :placeholder="
          $t(placeholder)
            ? $t(placeholder).toString()
            : $t('mt-search.searchPlaceholder').toString()
        "
        @input="onInput"
        @change="onChange"
        @focus="setFocusClass"
        @blur="removeFocusClass"
      />
    </template>
  </mt-base-field>
</template>

<script lang="ts">
import MtBaseField from "../../form/_internal/mt-base-field/mt-base-field.vue";
import MtIcon from "../../icons-media/mt-icon/mt-icon.vue";
import { defineComponent, ref, watch } from "vue";

export default defineComponent({
  components: {
    "mt-base-field": MtBaseField,
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
  setup(props, { emit }) {
    const hasFocus = ref(false);
    const currentValue = ref(props.modelValue);

    watch(
      () => props.modelValue,
      (value) => {
        currentValue.value = value;
      },
    );

    const onChange = (event: Event) => {
      // @ts-expect-error - target is defined
      emit("change", event.target.value || "");
    };

    const onInput = (event: Event) => {
      // @ts-expect-error - target is defined
      emit("update:modelValue", event.target.value);
    };

    const setFocusClass = () => {
      hasFocus.value = true;
    };

    const removeFocusClass = () => {
      hasFocus.value = false;
    };

    return {
      hasFocus,
      setFocusClass,
      removeFocusClass,
      onChange,
      onInput,
      currentValue,
    };
  },
});
</script>

<style lang="scss">
.mt-search.mt-field {
  .icon--regular-search-s {
    transition: 0.3s all ease;
    background-color: $color-white;
    color: $color-gray-600;
    display: flex;
    align-items: center;
    padding-left: 12px;

    #meteor-icon-kit__regular-search-s {
      width: 10px;
      height: 10px;
    }
  }

  .mt-search__text-input {
    padding-left: 8px;
  }

  &.is--disabled {
    .icon--regular-search-s {
      background-color: $color-gray-100;
    }
  }
}
</style>
