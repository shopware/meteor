<template>
  <sw-base-field
    class="sw-search"
    :disabled="disabled"
    :has-focus="hasFocus"
    :size="size"
  >
    <template #element="{identification}">
      <sw-icon name="regular-search-s" />

      <input
        :id="identification"
        class="sw-search__text-input"
        type="text"
        :name="identification"
        :disabled="disabled"
        :value="currentValue"
        :placeholder="$t(placeholder) ? $t(placeholder).toString() : $t('sw-search.searchPlaceholder').toString()"
        @input="onInput"
        @change="onChange"
        @focus="setFocusClass"
        @blur="removeFocusClass"
      >
    </template>
  </sw-base-field>
</template>

<script lang="ts">
import SwBaseField from '../../form/_internal/sw-base-field/sw-base-field.vue';
import SwIcon from '../../icons-media/sw-icon/sw-icon.vue';
import { defineComponent, ref, watch } from 'vue';

export default defineComponent({
  components: {
    'sw-base-field': SwBaseField,
    'sw-icon': SwIcon,
  },

  props: {
    /**
     * The value of the search field.
     */
     value: {
      type: String,
      required: false,
      default: '',
    },

    /**
     * A placeholder text being displayed if no value is set.
     */
     placeholder: {
      type: String,
      required: false,
      default: '',
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
        "sw-search": {
          searchPlaceholder: "Search",
        },
      },
      de: {
        "sw-search": {
          searchPlaceholder: "Suchen",
        },
      },
    },
  },
  emits: ['change', 'input'],
  setup(props, { emit }) {
    const hasFocus = ref(false);
    const currentValue = ref(props.value);

    watch(() => props.value, (value) => {
      currentValue.value = value;
    });

    const onChange = (event: Event) => {
      // @ts-expect-error - target is defined
      emit('change', event.target.value || '');
    }

    const onInput = (event: Event) => {
      // @ts-expect-error - target is defined
      emit('input', event.target.value);
    }

    const setFocusClass = () => {
      hasFocus.value = true;
    }

    const removeFocusClass = () => {
      hasFocus.value = false;
    }

    return {
      hasFocus,
      setFocusClass,
      removeFocusClass,
      onChange,
      onInput,
      currentValue
    };
  },
});
</script>

<style lang="scss">
@import "../../assets/scss/variables.scss";

.sw-search.sw-field {
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

  .sw-search__text-input {
    padding-left: 8px;
  }

  &.is--disabled {
    .icon--regular-search-s {
      background-color: $color-gray-100;
    }
  }
}
</style>
