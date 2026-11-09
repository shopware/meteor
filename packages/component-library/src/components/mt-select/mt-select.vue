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
    :small="isSmall"
    @select-expanded="onSelectExpanded"
    @select-collapsed="onSelectCollapsed"
    @clear="onClearSelection"
    @inheritance-restore="$emit('inheritance-restore', $event)"
    @inheritance-remove="$emit('inheritance-remove', $event)"
  >
    <template #mt-select-prefix>
      <slot name="prefix" />
    </template>

    <template #mt-select-selection="{ identification }">
      <mt-select-selection-list
        ref="selectionList"
        :multi-selection="enableMultiSelection"
        :selections="visibleValues"
        :invisible-count="invisibleValueCount"
        :always-show-placeholder="alwaysShowPlaceholder"
        v-bind="{
          identification,
          valueProperty,
          labelProperty,
          placeholder,
          searchTerm,
          disabled,
          enableSearch,
        }"
        :size="isSmall ? 'small' : 'default'"
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
        ref="resultList"
        :options="visibleResults"
        :is-loading="isLoading || isSearchResultsLoading"
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
              :class="'mt-select-option--' + getKey(item, valueProperty)"
              :data-testid="'mt-select-option--' + getKey(item, valueProperty)"
              v-bind="{ item, index }"
              :disabled="item.disabled"
              @item-select="addItem"
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
      <mt-field-hint v-if="showFieldHint()" :hide-icon="!!$slots.hint">
        <slot name="hint">
          {{ hint }}
        </slot>
      </mt-field-hint>
    </template>
  </mt-select-base>
</template>

<script setup lang="ts">
import type { PropType } from "vue";
import { computed, ref, useAttrs, useSlots, watch } from "vue";
import { debounce } from "@/utils/debounce";
import { getPropertyValue } from "@/utils/object";
import { isPromise } from "@/utils/promise";
import MtFieldHint from "../_internal/mt-field-hint/mt-field-hint.vue";
import MtSelectBase from "../_internal/mt-select-base/mt-select-base.vue";
import MtSelectResultList from "../_internal/mt-select-base/_internal/mt-select-result-list.vue";
import MtSelectResult from "../_internal/mt-select-base/_internal/mt-select-result.vue";
import MtSelectSelectionList from "../_internal/mt-select-base/_internal/mt-select-selection-list.vue";
import MtHighlightText from "../_internal/mt-highlight-text.vue";
import { useI18n } from "vue-i18n";

defineOptions({ name: "MtSelect", inheritAttrs: false });

const props = defineProps({
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
   * Render the select field in small
   */
  small: {
    type: Boolean,
    required: false,
    default: false,
  },

  /**
   * Toggles the search input. When disabled, the input is rendered readonly,
   * which also keeps browsers from treating it as an autofillable field.
   */
  enableSearch: {
    type: Boolean,
    required: false,
    default: true,
  },

  /**
   * Optional caption below the field. The `#hint` slot takes precedence when provided.
   */
  hint: {
    type: String as PropType<string | null>,
    required: false,
    default: null,
  },
});

const emit = defineEmits([
  "update:modelValue",
  "change",
  "item-add",
  "item-remove",
  "display-values-expand",
  "paginate",
  "search-term-change",
  "inheritance-restore",
  "inheritance-remove",
]);

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

const getKey = getPropertyValue;
const attrs = useAttrs();
const slots = useSlots();

const selectBase = ref<InstanceType<typeof MtSelectBase> | null>(null);
const selectionList = ref<InstanceType<typeof MtSelectSelectionList> | null>(null);
const resultList = ref<InstanceType<typeof MtSelectResultList> | null>(null);

const searchTerm = ref("");
const limit = ref(props.valueLimit);
const searchResults = ref<any[]>([]);
const isSearchResultsLoading = ref(false);

const currentValue = computed({
  get(): string | number | boolean | unknown[] | object | null | undefined {
    if (props.modelValue === null || props.modelValue === undefined) {
      return [];
    }

    return props.modelValue;
  },
  set(newValue: string | number | boolean | unknown[] | object | null | undefined) {
    emit("update:modelValue", newValue);

    // @deprecated tag:4.0 - Will be removed. Use `update:modelValue` instead.
    emit("change", newValue);
  },
});

const isSelected = (item: any) => {
  const value = currentValue.value;

  if (props.enableMultiSelection && Array.isArray(value)) {
    if (props.valueProperty) {
      return value.includes(getKey(item, props.valueProperty));
    }

    return value.find(
      (currentItem) =>
        getKey(currentItem, props.labelProperty) === getKey(item, props.labelProperty),
    );
  }

  if (props.valueProperty) {
    return getKey(item, props.valueProperty) === value;
  }

  return getKey(item, props.labelProperty) === getKey(value, props.labelProperty);
};

const visibleValues = computed((): any[] => {
  const value = currentValue.value;

  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return props.options.filter((item) => value === getKey(item, props.valueProperty));
  }

  if (Array.isArray(value)) {
    if (value.length <= 0) {
      return [];
    }

    return props.options
      .filter((item) => {
        return value.includes(getKey(item, props.valueProperty));
      })
      .slice(0, limit.value);
  }

  if (value && typeof value === "object") {
    const property = props.valueProperty || ("id" in value ? "id" : undefined);
    if (property) {
      return props.options.filter((item) => getKey(item, property) === getKey(value, property));
    }
  }

  return props.options.filter((item) => isSelected(item)).slice(0, limit.value);
});

const totalValuesCount = computed((): number => {
  const value = currentValue.value;

  if (props.enableMultiSelection && Array.isArray(value) && value.length) {
    return value.length;
  }

  if (value !== undefined || value !== null) {
    return 1;
  }

  return 0;
});

const invisibleValueCount = computed((): number => {
  if (!currentValue.value) {
    return 0;
  }

  return Math.max(0, totalValuesCount.value - limit.value);
});

const visibleResults = computed((): any[] => {
  if (searchTerm.value) {
    return searchResults.value;
  }

  return props.options;
});

/**
 * `size="small"` passed as an attribute reaches mt-base-field through $attrs;
 * treat it like the `small` prop so both render the same small select.
 */
const isSmall = computed((): boolean => {
  return props.small || attrs.size === "small";
});

const componentClasses = computed((): Record<string, boolean> => {
  return {
    "mt-select--small": isSmall.value,
  };
});

const showFieldHint = (): boolean => {
  return !!slots.hint || (props.hint != null && String(props.hint).trim() !== "");
};

const remove = (item: any) => {
  emit("item-remove", item);

  const value = currentValue.value;

  if (!Array.isArray(value)) {
    currentValue.value = null;

    return;
  }

  currentValue.value = value.filter((entry) => entry !== getKey(item, props.valueProperty));
};

const addItem = (item: any) => {
  const identifier = getKey(item, props.valueProperty);

  if (isSelected(item) && props.enableMultiSelection) {
    remove(item);
    return;
  }

  emit("item-add", item);

  const value = currentValue.value;

  if (props.enableMultiSelection) {
    if (Array.isArray(value)) {
      currentValue.value = [...value, identifier];
    } else if (value === null || value === undefined) {
      currentValue.value = [identifier];
    } else {
      currentValue.value = [value, identifier];
    }
  } else if (value !== identifier) {
    currentValue.value = identifier;
    selectBase.value?.collapse();
    selectionList.value?.blur();
  }

  selectionList.value?.focus();
  selectionList.value?.select();
};

const expandValueLimit = () => {
  emit("display-values-expand");

  limit.value += limit.value;
};

const removeLastItem = () => {
  if (!visibleValues.value.length) {
    return;
  }

  if (invisibleValueCount.value > 0) {
    expandValueLimit();
    return;
  }

  const lastSelection = visibleValues.value[visibleValues.value.length - 1];
  remove(lastSelection);
};

const onSearchTermChange = (term: string) => {
  searchTerm.value = term;
};

const resetActiveItem = () => {
  if (!resultList.value) {
    return;
  }

  resultList.value.setActiveItemIndex(0);
};

const searchTermDebounced = debounce((newSearchTerm: string) => {
  emit("search-term-change", newSearchTerm);
  resetActiveItem();

  searchResults.value = [];

  if (newSearchTerm !== undefined && newSearchTerm !== null) {
    isSearchResultsLoading.value = true;
    const result = props.searchFunction({
      options: props.options,
      labelProperty: props.labelProperty,
      valueProperty: props.valueProperty,
      searchTerm: searchTerm.value,
    });

    if (isPromise(result)) {
      result.then((res: any) => {
        if (res) {
          searchResults.value = res;
        }

        isSearchResultsLoading.value = false;
      });
    } else {
      if (result) {
        searchResults.value = result;
      }

      isSearchResultsLoading.value = false;
    }
  }
}, 100);

const onSelectExpanded = () => {
  selectionList.value?.focus();
};

const onSelectCollapsed = () => {
  searchTerm.value = "";
  selectionList.value?.blur();
};

const onClearSelection = () => {
  currentValue.value = props.enableMultiSelection ? [] : null;
};

const getFocusElement = () => {
  return selectionList.value?.getFocusEl() as HTMLElement;
};

watch(
  () => props.valueLimit,
  (value) => {
    limit.value = value;
  },
);

watch(searchTerm, (newSearchTerm) => {
  searchTermDebounced(newSearchTerm);
});
</script>
