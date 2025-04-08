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
          v-bind="{ selection, defaultLabel: selection[labelProperty], disabled }"
        >
          <mt-label
            :dismissable="!isSelectionDisabled(selection)"
            :size="size"
            @dismiss="onClickDismiss(selection)"
          >
            <span class="mt-select-selection-list__item" :title="selection[labelProperty]">
              <slot
                name="label-property"
                v-bind="{ item: selection, index, labelProperty, valueProperty }"
              >
                {{ selection[labelProperty] }}
              </slot>
            </span>
          </mt-label>
        </slot>
      </li>
    </template>

    <li v-if="invisibleCount > 0 && !hideLabels" class="mt-select-selection-list__load-more">
      <slot name="invisible-count" v-bind="{ invisibleCount, onClickInvisibleCount }">
        <button
          type="button"
          class="mt-select-selection-list__load-more-button"
          @click.stop="onClickInvisibleCount"
        >
          +{{ invisibleCount }}
        </button>
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
import MtLabel from "../../../../_internal/mt-label.vue";
import MtButton from "../../../mt-button/mt-button.vue";

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
      type: String,
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
      default: false,
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
      if (this.inputInFocus) {
        return this.currentValue;
      }

      return this.alwaysShowPlaceholder || this.selections.length === 0 ? this.placeholder : "";
    },

    currentValue(): string {
      return this.selections?.[0]?.[this.labelProperty];
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

<style>
.mt-select-selection-list {
  display: flex;
  flex-wrap: wrap;
  list-style: none;
  width: calc(100% - 30px);
}

.mt-select-selection-list:has(.mt-select-selection-list--single) {
  flex-wrap: nowrap;
}

.mt-select-selection-list:has(.mt-select-selection-list--single) .mt-select-selection-list--single {
  min-width: 0;
  max-width: 100%;
}

.mt-select-selection-list--single .mt-label {
  border: none;
  background: unset;
}

.mt-select-selection-list .mt-select-selection-list__item-holder {
  max-width: 220px;
  line-height: 0;
  margin: var(--scale-size-8) var(--scale-size-6) 0 0;
}

.mt-select-selection-list .mt-select-selection-list__load-more {
  margin: var(--scale-size-8) var(--scale-size-6) 0 0;
}

.mt-select-selection-list__load-more-button {
  color: var(--color-text-brand-default);
  font-size: var(--font-size-xs);
  padding: var(--scale-size-8) var(--scale-size-12);
  height: var(--scale-size-32);
  line-height: 1.1;
  border: 1px solid var(--color-border-primary-default);
  border-radius: var(--border-radius-xs);
  background: var(--color-background-primary-default);

  &:hover {
    background-color: var(--color-background-brand-default);
    border-color: var(--color-border-brand-selected);
  }
}

.mt-select-selection-list .mt-select-selection-list__input-wrapper {
  flex: 1 1 0;
}

.mt-select-selection-list
  .mt-select-selection-list__input-wrapper--small
  .mt-select-selection-list__input {
  min-height: var(--scale-size-32);
  padding: var(--scale-size-4) var(--scale-size-16) var(--scale-size-4) var(--scale-size-8);
}

.mt-select-selection-list .mt-select-selection-list__input {
  display: inline-block;
  min-height: calc(var(--scale-size-48) - var(--scale-size-2));
  padding: var(--scale-size-12) var(--scale-size-16) var(--scale-size-12) var(--scale-size-8);
}

.mt-select-selection-list .mt-select-selection-list__input::placeholder {
  color: var(--color-text-secondary-default);
  white-space: break-spaces;
}

.mt-field--medium .mt-select-selection-list .mt-select-selection-list__item-holder .mt-label {
  margin: var(--scale-size-4) var(--scale-size-6) 0 0;
}

.mt-field--medium .mt-select-selection-list input {
  padding: var(--scale-size-4) var(--scale-size-16) var(--scale-size-8) var(--scale-size-8);
}

.mt-field--small .mt-select-selection-list .mt-select-selection-list__item-holder .mt-label {
  margin: var(--scale-size-4) var(--scale-size-6) 0 0;
}

.mt-field--small .mt-select-selection-list input {
  padding: var(--scale-size-2) var(--scale-size-16) var(--scale-size-4) var(--scale-size-8);
}
</style>
