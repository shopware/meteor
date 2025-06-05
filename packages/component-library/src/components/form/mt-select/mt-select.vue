<template>
  <mt-select-base
    ref="selectBase"
    class="mt-select"
    :class="componentClasses"
    :is-loading="isLoading"
    :label="label"
    v-bind="$attrs"
    :error="error"
    :disabled="disabled"
    :show-clearable-button="!hideClearableButton"
    :is-inherited="isInherited"
    :is-inheritance-field="isInheritanceField"
    :disable-inheritance-toggle="disableInheritanceToggle"
    @select-expanded="onSelectExpanded"
    @select-collapsed="onSelectCollapsed"
    @clear="onClearSelection"
  >
    <template #mt-select-prefix>
      <slot name="prefix" />
    </template>

    <template #mt-select-selection="{ size }">
      <mt-select-selection-list
        ref="selectionList"
        :multi-selection="enableMultiSelection"
        :selections="visibleValues"
        :invisible-count="invisibleValueCount"
        :always-show-placeholder="alwaysShowPlaceholder"
        v-bind="{ size, valueProperty, labelProperty, placeholder, searchTerm, disabled }"
        :size="small ? 'small' : 'default'"
        @total-count-click="expandValueLimit"
        @item-remove="remove"
        @last-item-delete="removeLastItem"
        @search-term-change="onSearchTermChange"
      >
        <template #label-property="{ item, index, itemLabelProperty, itemValueProperty }">
          <slot
            name="selection-label-property"
            v-bind="{ item, index, itemLabelProperty, itemValueProperty }"
          >
            {{ getKey(item, labelProperty) }}
          </slot>
        </template>
      </mt-select-selection-list>
    </template>
    <template #results-list>
      <!-- @vue-ignore -->
      <mt-select-result-list
        ref="MtSelectResultList"
        :options="visibleResults"
        :is-loading="isLoading"
        :empty-message="t('messageNoResults', { term: searchTerm })"
        :focus-el="getFocusElement()"
        @paginate="$emit('paginate')"
        @item-select="addItem"
      >
        <template #before-item-list>
          <slot name="before-item-list" />
        </template>

        <template #result-item="{ item, index }">
          <slot
            name="result-item"
            v-bind="{
              item,
              index,
              labelProperty,
              valueProperty,
              searchTerm,
              highlightSearchTerm,
              isSelected,
              addItem,
              getKey,
            }"
          >
            <mt-select-result
              :selected="isSelected(item)"
              :class="'mt-select-option--' + item.value"
              :data-testid="'mt-select-option--' + item.value"
              v-bind="{ item, index }"
              @item-select="addItem"
              :disabled="item.disabled"
            >
              <slot
                name="result-label-property"
                v-bind="{ item, index, labelProperty, valueProperty, searchTerm, getKey }"
              >
                <mt-highlight-text
                  v-if="highlightSearchTerm"
                  :text="getKey(item, labelProperty)"
                  :search-term="searchTerm"
                />
                <template v-else>
                  {{ getKey(item, labelProperty) }}
                </template>
              </slot>
            </mt-select-result>
          </slot>
        </template>

        <template #after-item-list>
          <slot name="after-item-list" />
        </template>
      </mt-select-result-list>
    </template>

    <template #mt-select-suffix>
      <slot name="suffix" />
    </template>

    <template #mt-select-hint>
      <slot name="hint" />
    </template>
  </mt-select-base>
</template>

<script lang="ts">
import type { PropType } from "vue";

import { defineComponent } from "vue";
import { debounce } from "@/utils/debounce";
import { getPropertyValue } from "@/utils/object";
import { isPromise } from "@/utils/promise";
import MtSelectBase from "../_internal/mt-select-base/mt-select-base.vue";
import MtSelectResultList from "../_internal/mt-select-base/_internal/mt-select-result-list.vue";
import MtSelectResult from "../_internal/mt-select-base/_internal/mt-select-result.vue";
import MtSelectSelectionList from "../_internal/mt-select-base/_internal/mt-select-selection-list.vue";
import MtHighlightText from "../../_internal/mt-highlight-text.vue";
import { useI18n } from "vue-i18n";

export default defineComponent({
  name: "MtSelect",

  components: {
    "mt-select-base": MtSelectBase,
    "mt-select-result-list": MtSelectResultList,
    "mt-select-selection-list": MtSelectSelectionList,
    "mt-highlight-text": MtHighlightText,
    "mt-select-result": MtSelectResult,
  },

  inheritAttrs: false,

  emits: [
    "update:modelValue",
    "change",
    "item-add",
    "item-remove",
    "display-values-expand",
    "paginate",
    "search-term-change",
  ],

  props: {
    /**
     * An array of objects with the labelProperty and valueProperty.
     *
     * @example [{label: 'Option A', value: 'a'}, {label: 'Option B', value: 'b'}]
     */
    options: {
      type: Array,
      required: true,
    },

    /**
     * Toggles if either one or more items can be selected.
     */
    enableMultiSelection: {
      type: Boolean,
      default: false,
    },

    /**
     * Dependent on multiSelection, either a single value or an array of values.
     */
    modelValue: {
      type: [String, Number, Boolean, Array, Object, null, undefined] as PropType<
        string | number | boolean | unknown[] | null | object | undefined
      >,
      required: false,
      default: null,
    },

    /**
     * The object key of the label property. Can be a single string or an array of strings.
     * If an array is provided, the first property that has a non-empty value will be used.
     */
    labelProperty: {
      type: [String, Array] as PropType<string | string[]>,
      required: false,
      default: "label",
    },

    /**
     * The object key to use for the value.
     */
    valueProperty: {
      type: String,
      required: false,
      default: "value",
    },

    /**
     * The number of items that are expanded by default.
     */
    valueLimit: {
      type: Number,
      required: false,
      default: 5,
    },

    /**
     * The label for the select field itself.
     */
    label: {
      type: String,
      required: false,
      default: "",
    },

    /**
     * The placeholder for the select field.
     */
    placeholder: {
      type: String,
      required: false,
      default: "",
    },

    /**
     * Determines if the placeholder should be shown even when there are no selections.
     */
    alwaysShowPlaceholder: {
      type: Boolean,
      required: false,
      default: true,
    },

    /**
     * Toggles the loading state of the select field.
     */
    isLoading: {
      type: Boolean,
      required: false,
      default: false,
    },

    /**
     * Disables or enables the select field.
     */
    disabled: {
      type: Boolean,
      required: false,
      default: false,
    },

    /**
     * Toggles a button to clear all selections.
     */
    hideClearableButton: {
      type: Boolean,
      required: false,
      default: false,
    },

    /**
     * Determines to highlight the searched term or not.
     */
    highlightSearchTerm: {
      type: Boolean,
      required: false,
      default: true,
    },

    /**
     * Used to implement a custom search function.
     * Parameters passed: { options, labelProperty, valueProperty, searchTerm }
     */
    searchFunction: {
      type: Function,
      required: false,
      default: ({
        options,
        labelProperty,
        searchTerm,
      }: {
        options: any;
        labelProperty: string | string[];
        searchTerm: string;
      }) => {
        return options.filter((option: any) => {
          // If labelProperty is an array, check each property
          if (Array.isArray(labelProperty)) {
            for (const property of labelProperty) {
              const label = getPropertyValue(option, property);
              if (
                label &&
                typeof label === "string" &&
                label.toLowerCase().includes(searchTerm.toLowerCase())
              ) {
                return true;
              }
            }
            return false;
          }

          // Original behavior for string labelProperty
          const label = getPropertyValue(option, labelProperty);
          if (!label) {
            return false;
          }
          return label.toLowerCase().includes(searchTerm.toLowerCase());
        });
      },
    },

    /**
     * An error in your business logic related to this field.
     *
     * For example: {"code": 500, "detail": "Error while saving"}
     */
    error: {
      type: Object,
      required: false,
      default: null,
    },

    /**
     * Toggles the inheritance visualization.
     */
    isInherited: {
      type: Boolean,
      required: false,
      default: false,
    },

    /**
     * Determines if the field is inheritable.
     */
    isInheritanceField: {
      type: Boolean,
      required: false,
      default: false,
    },

    /**
     * Determines the active state of the inheritance toggle.
     */
    disableInheritanceToggle: {
      type: Boolean,
      required: false,
      default: false,
    },

    /**
     * Render the select field in small without a search input
     */
    small: {
      type: Boolean,
      required: false,
      default: false,
    },
  },

  data() {
    return {
      searchTerm: "",
      limit: this.valueLimit,
      searchResults: [],
    };
  },

  computed: {
    visibleValues(): any[] {
      if (
        typeof this.currentValue === "string" ||
        typeof this.currentValue === "number" ||
        typeof this.currentValue === "boolean"
      ) {
        const value = this.currentValue;

        return this.options.filter((item) => value === this.getKey(item, this.valueProperty));
      }

      if (Array.isArray(this.currentValue)) {
        const value = this.currentValue;

        if (this.currentValue.length <= 0) {
          return [];
        }

        return this.options
          .filter((item) => value.includes(this.getKey(item, this.valueProperty)))
          .slice(0, this.limit);
      }

      if (this.currentValue && typeof this.currentValue === "object") {
        const property = this.valueProperty || ("id" in this.currentValue ? "id" : undefined);
        if (property) {
          return this.options.filter(
            (item) => this.getKey(item, property) === this.getKey(this.currentValue, property),
          );
        }
      }

      return this.options.filter((item) => this.isSelected(item)).slice(0, this.limit);
    },

    totalValuesCount(): number {
      if (
        this.enableMultiSelection &&
        Array.isArray(this.currentValue) &&
        this.currentValue.length
      ) {
        return this.currentValue.length;
      }

      if (Array.isArray(this.currentValue)) {
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        this.currentValue.length;
      }

      if (this.currentValue !== undefined || this.currentValue !== null) {
        return 1;
      }

      return 0;
    },

    invisibleValueCount(): number {
      if (!this.currentValue) {
        return 0;
      }

      return Math.max(0, this.totalValuesCount - this.limit);
    },

    currentValue: {
      get(): string | number | boolean | unknown[] | object | null | undefined {
        if (this.modelValue === null || this.modelValue === undefined) {
          return [];
        }

        return this.modelValue;
      },
      set(newValue: string | number | boolean | unknown[] | null | undefined) {
        this.$emit("update:modelValue", newValue);

        // @deprecated tag:4.0 - Will be removed. Use `update:modelValue` instead.
        this.$emit("change", newValue);
      },
    },

    visibleResults(): any[] {
      if (this.searchTerm) {
        return this.searchResults;
      }

      return this.options;
    },

    componentClasses(): Record<string, boolean> {
      return {
        "mt-select--small": this.small,
      };
    },
  },

  setup() {
    const { t } = useI18n({
      messages: {
        en: {
          messageNoResults: 'No results found for "{term}".',
        },
        de: {
          messageNoResults: 'Es wurden keine Ergebnisse für "{term}" gefunden.',
        },
      },
    });

    return {
      t,
      getKey: getPropertyValue,
    };
  },

  watch: {
    valueLimit(value) {
      this.limit = value;
    },

    searchTerm(newSearchTerm) {
      this.searchResults = [];
      if (newSearchTerm) {
        const result = this.searchFunction({
          options: this.options,
          labelProperty: this.labelProperty,
          valueProperty: this.valueProperty,
          searchTerm: this.searchTerm,
        });

        if (isPromise(result)) {
          result.then((res: any) => {
            if (res) {
              this.searchResults = res;
            }
          });
        } else {
          if (result) {
            this.searchResults = result;
          }
        }
      }
    },
  },

  methods: {
    isSelected(item: any) {
      if (this.enableMultiSelection && Array.isArray(this.currentValue)) {
        if (this.valueProperty) {
          return this.currentValue.includes(this.getKey(item, this.valueProperty));
        }

        return this.currentValue.find(
          (currentItem) =>
            this.getKey(currentItem, this.labelProperty) === this.getKey(item, this.labelProperty),
        );
      }

      if (this.valueProperty) {
        return this.getKey(item, this.valueProperty) === this.currentValue;
      }

      return (
        this.getKey(item, this.labelProperty) === this.getKey(this.currentValue, this.labelProperty)
      );
    },

    addItem(item: any) {
      const identifier = this.getKey(item, this.valueProperty);

      if (this.isSelected(item) && this.enableMultiSelection) {
        this.remove(item);
        return;
      }

      this.$emit("item-add", item);

      if (this.enableMultiSelection) {
        if (Array.isArray(this.currentValue)) {
          this.currentValue = [...this.currentValue, identifier];
        } else if (this.currentValue === null || this.currentValue === undefined) {
          this.currentValue = [identifier];
        } else {
          this.currentValue = [this.currentValue, identifier];
        }
      } else if (this.currentValue !== identifier) {
        this.currentValue = identifier;
        // @ts-expect-error - ref exists
        this.$refs.selectBase.collapse();
        // @ts-expect-error - ref exists
        this.$refs.selectionList.blur();
      }

      // @ts-expect-error - ref exists
      this.$refs.selectionList.focus();
      // @ts-expect-error - ref exists
      this.$refs.selectionList.select();
    },

    remove(item: any) {
      this.$emit("item-remove", item);

      if (!Array.isArray(this.currentValue)) {
        this.currentValue = null;

        return;
      }

      this.currentValue = this.currentValue.filter(
        (value) => value !== this.getKey(item, this.valueProperty),
      );
    },

    removeLastItem() {
      if (!this.visibleValues.length) {
        return;
      }

      if (this.invisibleValueCount > 0) {
        this.expandValueLimit();
        return;
      }

      const lastSelection = this.visibleValues[this.visibleValues.length - 1];
      this.remove(lastSelection);
    },

    expandValueLimit() {
      this.$emit("display-values-expand");

      this.limit += this.limit;
    },

    onSearchTermChange: debounce(function updateSearchTerm(term) {
      // @ts-expect-error - this context exists even here
      this.searchTerm = term;
      // @ts-expect-error - this context exists even here
      this.$emit("search-term-change", this.searchTerm);
      // @ts-expect-error - this context exists even here
      this.resetActiveItem();
    }, 100),

    resetActiveItem() {
      if (!this.$refs.MtSelectResultList) {
        return;
      }

      // @ts-expect-error - ref exists
      this.$refs.MtSelectResultList.setActiveItemIndex(0);
    },

    onSelectExpanded() {
      // @ts-expect-error - ref exists
      this.$refs.selectionList.focus();
    },

    onSelectCollapsed() {
      this.searchTerm = "";
      // @ts-expect-error - ref exists
      this.$refs.selectionList.blur();
    },

    onClearSelection() {
      this.currentValue = this.enableMultiSelection ? [] : null;
    },

    getFocusElement() {
      // @ts-expect-error - ref exists
      return this.$refs.selectionList.getFocusEl() as HTMLElement;
    },
  },
});
</script>
