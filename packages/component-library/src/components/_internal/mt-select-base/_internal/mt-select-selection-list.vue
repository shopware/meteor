<template>
  <ul
    class="mt-select-selection-list"
    :class="{ 'mt-select-selection-list--small': size === 'small' }"
  >
    <!-- eslint-disable vue/no-use-v-if-with-v-for -->
    <template v-for="(selection, index) in selections" :key="selection[valueProperty]">
      <li
        v-if="!hideLabels && multiSelection"
        :class="[
          'mt-select-selection-list__item-holder--' + index,
          'mt-select-selection-list__item-holder',
        ]"
        :data-id="selection[valueProperty]"
      >
        <slot
          name="selected-option"
          v-bind="{ selection, defaultLabel: getKey(selection, labelProperty), disabled }"
        >
          <mt-label
            :dismissable="!isSelectionDisabled(selection)"
            :size="size === 'small' ? 'medium' : 'default'"
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
          :size="size === 'small' ? 'x-small' : 'small'"
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
          autocomplete="off"
          data-1p-ignore
          data-lpignore="true"
          data-bwignore
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
import MtLabel from "../../mt-label.vue";
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
      inputEdited: false,
    };
  },

  computed: {
    inputWrapperClasses(): { "mt-select-selection-list__input-wrapper--small": boolean } {
      return {
        "mt-select-selection-list__input-wrapper--small": this.size === "small",
      };
    },

    showPlaceholder(): string {
      if (this.disabled) {
        return "";
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

      if (this.inputInFocus && this.inputEdited) {
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
      this.inputEdited = true;
      // @ts-expect-error - target value is defined
      this.$emit("search-term-change", event.target.value, event);
    },

    async onInputFocus() {
      this.inputInFocus = true;
      this.inputEdited = false;
    },

    clearSearchTerm() {
      this.inputInFocus = false;
      this.inputEdited = false;
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
/*
 * The list owns all spacing between tags, the "+N" button and the input:
 * a single gap plus block padding. Every item is vertically centered in its
 * row, so tags, the button and the input line up regardless of their height.
 * The list itself is centered inside the field block by .mt-select__selection.
 */
.mt-select-selection-list {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--scale-size-6) var(--scale-size-8);
  padding-block: var(--scale-size-6);
  list-style: none;
  width: calc(100% - 30px);

  /*
   * The items inherit the larger line-height of .mt-select__selection; a flex
   * item has no line box strut, so the row is exactly as tall as its content.
   */
  .mt-select-selection-list__item-holder,
  .mt-select-selection-list__load-more,
  .mt-select-selection-list__input-wrapper {
    display: flex;
    align-items: center;
  }

  .mt-select-selection-list__item-holder {
    max-width: 220px;
  }

  .mt-select-selection-list__input-wrapper {
    flex: 1 1 auto;
    min-width: 120px;
  }

  .mt-select-selection-list__input {
    min-height: var(--scale-size-32);
    padding: var(--scale-size-4) var(--scale-size-16) var(--scale-size-4) var(--scale-size-8);

    &::placeholder {
      color: var(--color-text-secondary-default);
      white-space: break-spaces;
    }
  }

  /* same height as the medium tags, so wrapped rows are all equally tall */
  .mt-select-selection-list__input-wrapper--small .mt-select-selection-list__input {
    min-height: var(--scale-size-20);
    padding: var(--scale-size-2) var(--scale-size-16) var(--scale-size-2) var(--scale-size-8);
  }
}

.mt-select-selection-list--small {
  gap: var(--scale-size-4) var(--scale-size-6);
  padding-block: var(--scale-size-4);

  /* match the 20px medium tags; the button's own scoped x-small size is 24px */
  .mt-select-selection-list__load-more .mt-select-selection-list__load-more-button {
    min-height: var(--scale-size-20);
    padding-inline: var(--scale-size-6);
  }
}
</style>
