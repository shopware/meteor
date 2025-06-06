<template>
  <ul class="mt-select-selection-list">
    <!-- eslint-disable vue/no-use-v-if-with-v-for -->
    <template v-for="(selection, index) in selections" :key="selection[valueProperty]">
      <li
        v-if="!hideLabels && multiSelection"
        :class="[
          'mt-select-selection-list__item-holder--' + index,
          'mt-select-selection-list__item-holder',
          classBindings,
        ]"
        :data-id="selection[valueProperty]"
      >
        <slot
          name="selected-option"
          v-bind="{ selection, defaultLabel: getKey(selection, labelProperty), disabled }"
        >
          <mt-label
            :dismissable="!isSelectionDisabled(selection)"
            :size="size"
            @dismiss="onClickDismiss(selection)"
          >
            <span class="mt-select-selection-list__item" :title="getKey(selection, labelProperty)">
              <slot
                name="label-property"
                v-bind="{ item: selection, index, labelProperty, valueProperty }"
              >
                {{ getKey(selection, labelProperty) }}
              </slot>
            </span>
          </mt-label>
        </slot>
      </li>
    </template>

    <li v-if="invisibleCount > 0 && !hideLabels" class="mt-select-selection-list__load-more">
      <slot name="invisible-count" v-bind="{ invisibleCount, onClickInvisibleCount }">
        <mt-button
          variant="secondary"
          class="mt-select-selection-list__load-more-button"
          @click.stop="onClickInvisibleCount"
          tabindex="0"
        >
          +{{ invisibleCount }}
        </mt-button>
      </slot>
    </li>

    <li
      v-if="!disableInput"
      class="mt-select-selection-list__input-wrapper"
      :class="inputWrapperClasses"
    >
      <slot name="input" v-bind="{ placeholder, searchTerm, onSearchTermChange, onKeyDownDelete }">
        <!-- eslint-disable-next-line vuejs-accessibility/form-control-has-label -->
        <input
          ref="MtSelectInput"
          class="mt-select-selection-list__input"
          type="text"
          :disabled="disabled"
          :readonly="!enableSearch"
          :placeholder="showPlaceholder"
          :value="inputValue"
          @input="onSearchTermChange"
          @keydown.delete="onKeyDownDelete"
          @blur="clearSearchTerm"
          @focus="onInputFocus"
        />
      </slot>
    </li>
  </ul>
</template>

<script lang="ts">
import type { PropType } from "vue";
import { defineComponent } from "vue";
import { useI18n } from "vue-i18n";
import MtLabel from "../../../../_internal/mt-label.vue";
import MtButton from "../../../mt-button/mt-button.vue";
import { getPropertyValue } from "@/utils/object";

export default defineComponent({
  name: "MtSelectSelectionList",

  components: {
    "mt-label": MtLabel,
    "mt-button": MtButton,
  },

  props: {
    selections: {
      type: Array as PropType<Record<string, string>[]>,
      required: false,
      default: () => [],
    },
    labelProperty: {
      type: [String, Array] as PropType<string | string[]>,
      required: false,
      default: "label",
    },
    valueProperty: {
      type: String,
      required: false,
      default: "value",
    },
    enableSearch: {
      type: Boolean,
      required: false,
      default: true,
    },
    invisibleCount: {
      type: Number,
      required: false,
      default: 0,
    },
    size: {
      type: String as PropType<"small" | "medium" | "default">,
      required: false,
      default: null,
    },
    alwaysShowPlaceholder: {
      type: Boolean,
      required: false,
      default: true,
    },
    placeholder: {
      type: String,
      required: false,
      default: "",
    },
    isLoading: {
      type: Boolean,
      required: false,
      default: false,
    },
    searchTerm: {
      type: String,
      required: false,
      default: "",
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false,
    },
    selectionDisablingMethod: {
      type: Function as PropType<(selection: Record<string, string>) => boolean>,
      required: false,
      default: () => false,
    },
    hideLabels: {
      type: Boolean,
      required: false,
      default: false,
    },
    multiSelection: {
      type: Boolean,
      required: true,
    },
    disableInput: {
      type: Boolean,
      required: false,
      default: false,
    },
  },

  setup() {
    const { t } = useI18n({
      messages: {
        de: {
          "select-placeholder": "Auswählen...",
        },
        en: {
          "select-placeholder": "Select...",
        },
      },
    });

    return {
      t,
      getKey: getPropertyValue,
    };
  },

  data() {
    return {
      inputInFocus: false,
    };
  },

  computed: {
    classBindings(): { "mt-select-selection-list--single": boolean } {
      return {
        "mt-select-selection-list--single": !this.multiSelection,
      };
    },

    inputWrapperClasses(): { "mt-select-selection-list__input-wrapper--small": boolean } {
      return {
        "mt-select-selection-list__input-wrapper--small": this.size === "small",
      };
    },

    showPlaceholder(): string {
      if (this.disabled) {
        return "";
      }

      if (!this.multiSelection && this.selections.length > 0) {
        return this.currentValue;
      }

      return this.alwaysShowPlaceholder
        ? this.placeholder
          ? this.placeholder
          : this.t("select-placeholder")
        : "";
    },

    currentValue(): string {
      return this.getKey(this.selections?.[0], this.labelProperty);
    },

    inputValue(): string {
      if (this.multiSelection) {
        return this.searchTerm;
      }

      if (this.inputInFocus) {
        return this.searchTerm;
      }

      return this.currentValue;
    },
  },

  methods: {
    isSelectionDisabled(selection: Record<string, string>) {
      if (!this.multiSelection) {
        return true;
      }

      if (this.disabled) {
        return true;
      }

      if (typeof this.selectionDisablingMethod !== "function") {
        return false;
      }

      return this.selectionDisablingMethod(selection);
    },

    onClickInvisibleCount() {
      this.$emit("total-count-click");
    },

    onSearchTermChange(event: Event) {
      // @ts-expect-error - target value is defined
      this.$emit("search-term-change", event.target.value, event);
    },

    async onInputFocus() {
      this.inputInFocus = true;
    },

    clearSearchTerm() {
      this.inputInFocus = false;

      if (this.searchTerm.length > 0) {
        this.$emit("search-term-change", "");
      }
    },

    onKeyDownDelete() {
      if (this.searchTerm.length < 1 && this.multiSelection) {
        this.$emit("last-item-delete");
      }
    },

    onClickDismiss(item: any) {
      this.$emit("item-remove", item);
    },

    focus() {
      if (this.$refs.MtSelectInput) {
        // @ts-expect-error - ref MtSelectInput is defined
        this.$refs.MtSelectInput.focus();
      }
    },

    blur() {
      if (this.$refs.MtSelectInput) {
        // @ts-expect-error - ref MtSelectInput is defined
        this.$refs.MtSelectInput.blur();
      }
    },

    select() {
      if (this.$refs.MtSelectInput) {
        // @ts-expect-error - ref MtSelectInput is defined
        this.$refs.MtSelectInput.select();
      }
    },

    getFocusEl() {
      return this.$refs.MtSelectInput;
    },
  },
});
</script>

<style lang="scss">
@import "../../../../assets/scss/variables";

.mt-select-selection-list {
  display: flex;
  flex-wrap: wrap;
  list-style: none;
  width: calc(100% - 30px);

  &:has(.mt-select-selection-list--single) {
    flex-wrap: nowrap;

    .mt-select-selection-list--single {
      min-width: 0;
      max-width: 100%;
    }
  }

  &--single {
    .mt-label {
      border: none;
      background: unset;
    }
  }

  .mt-select-selection-list__item-holder {
    max-width: 220px;
    line-height: 0;
    margin: var(--scale-size-8) var(--scale-size-6) 0 0;
  }

  .mt-select-selection-list__load-more {
    margin: var(--scale-size-8) var(--scale-size-6) 0 0;
  }

  button.mt-select-selection-list__load-more-button {
    padding: var(--scale-size-8) var(--scale-size-12);
    margin: 0 var(--scale-size-6) 0 0;
    color: var(--color-text-brand-default);
    font-size: 12px;
    line-height: 14px;
    border-radius: 2px;
    height: unset;
    border-color: var(--color-border-primary-default);
  }

  .mt-select-selection-list__input-wrapper {
    flex: 1 1 auto;
    min-width: 120px;
  }

  .mt-select-selection-list__input-wrapper--small .mt-select-selection-list__input {
    min-height: 32px;
    padding: var(--scale-size-4) var(--scale-size-16) var(--scale-size-4) var(--scale-size-8);
  }

  .mt-select-selection-list__input {
    display: inline-block;
    min-height: 46px;
    padding: var(--scale-size-12) var(--scale-size-16) var(--scale-size-12) var(--scale-size-8);

    &::placeholder {
      color: lighten($color-darkgray-200, 25%);
      white-space: break-spaces;
    }
  }
}

.mt-field--medium .mt-select-selection-list {
  .mt-select-selection-list__item-holder .mt-label {
    margin: var(--scale-size-4) var(--scale-size-6) 0 0;
  }

  input {
    padding: var(--scale-size-4) var(--scale-size-16) var(--scale-size-8) var(--scale-size-8);
  }

  .mt-select-selection-list__load-more-button {
    padding: var(--scale-size-4) var(--scale-size-12);
    margin: var(--scale-size-4) var(--scale-size-6) 0 0;
  }
}

.mt-field--small .mt-select-selection-list {
  .mt-select-selection-list__item-holder .mt-label {
    margin: var(--scale-size-4) var(--scale-size-6) 0 0;
  }

  input {
    padding: var(--scale-size-2) var(--scale-size-16) var(--scale-size-4) var(--scale-size-8);
  }

  .mt-select-selection-list__load-more-button {
    padding: 0 var(--scale-size-8);
    margin: -1px var(--scale-size-6) 0 0;
  }
}
</style>
