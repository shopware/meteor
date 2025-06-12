<template>
  <!-- Height needs to be set inline because the card has an mt-ignore-class component as a wrapper -->
  <mt-card class="mt-data-table" :class="MtDataTableClasses" :title="title" :subtitle="subtitle">
    <template #toolbar>
      <div class="mt-data-table__toolbar">
        <mt-search
          v-if="disableSearch !== true"
          class="mt-data-table__search"
          size="small"
          :model-value="searchValue"
          @update:model-value="handleSearchUpdate"
        />

        <mt-popover v-if="filters.length > 0" title="Filters" :child-views="filterChildViews">
          <template #trigger="{ toggleFloatingUi }">
            <mt-button variant="secondary" @click="toggleFloatingUi">
              <mt-icon name="solid-filter-s" aria-hidden="true" />

              <span>{{ t("filter.addFilter") }}</span>
            </mt-button>
          </template>

          <template #popover-items__base="{ changeView }">
            <mt-popover-item
              v-for="filter in filters"
              :key="filter.id"
              :label="filter.label"
              show-options
              @click-options="() => changeView(filter.id)"
            />
          </template>

          <template v-for="filter in filters" :key="filter.id" #[`popover-items__${filter.id}`]>
            <mt-popover-item
              v-for="option in filter.type.options"
              :key="option.id"
              :label="option.label"
              show-checkbox
              :checkbox-checked="isOptionSelected(filter.id, option.id)"
              @change-checkbox="
                (isChecked) =>
                  isChecked ? addOption(filter.id, option.id) : removeOption(filter.id, option.id)
              "
            />
          </template>
        </mt-popover>

        <slot name="toolbar" />
      </div>

      <div v-if="appliedFilters.length > 0" class="mt-data-table__filter">
        <span>{{
          isLoading
            ? t("filter.fetchingFilteredResults")
            : t("filter.numberOfResults", { n: numberOfResults ?? 0 })
        }}</span>

        <div class="mt-data-table__filter-list">
          <mt-data-table-filter
            v-for="filter in appliedFilters"
            :key="filter.id"
            :filter="filters.find((f) => f.id === filter.id)!"
            :applied-options="filter.type.options"
            @add-option="(filterId, optionId) => addOption(filterId, optionId)"
            @remove-option="(filterId, optionId) => removeOption(filterId, optionId)"
            @remove-filter="removeFilter(filter.id)"
          />
        </div>

        <mt-popover title="Filters" :child-views="filterChildViews">
          <template #trigger="{ toggleFloatingUi }">
            <button
              type="button"
              class="mt-data-table__add-filter-button"
              :aria-label="t('filter.addFilter')"
              @click="toggleFloatingUi"
            >
              <mt-icon name="solid-plus-square-s" />
            </button>
          </template>

          <template #popover-items__base="{ changeView }">
            <mt-popover-item
              v-for="filter in filters"
              :key="filter.id"
              :label="filter.label"
              show-options
              @click-options="() => changeView(filter.id)"
            />
          </template>

          <template v-for="filter in filters" :key="filter.id" #[`popover-items__${filter.id}`]>
            <mt-popover-item
              v-for="option in filter.type.options"
              :key="option.id"
              :label="option.label"
              show-checkbox
              :checkbox-checked="isOptionSelected(filter.id, option.id)"
              @change-checkbox="
                (isChecked) =>
                  isChecked ? addOption(filter.id, option.id) : removeOption(filter.id, option.id)
              "
            />
          </template>
        </mt-popover>

        <mt-data-table-reset-filter-button
          :number-of-applied-filters="appliedFilters.length"
          @click="$emit('update:appliedFilters', [])"
        />
      </div>
    </template>

    <template #default>
      <div v-if="somethingSelected" class="mt-data-table__table-selection-bulk-edit">
        <mt-segmented-control disable-context :actions="bulkEditSegmentedControlActions">
          <template #more--popover-items__base>
            <mt-popover-item
              v-for="moreAction in bulkEditMoreActions"
              :key="moreAction.id"
              :label="moreAction.label"
              :on-label-click="moreAction.onClick"
              :type="moreAction.type"
              :icon="moreAction.icon"
              :meta-copy="moreAction.metaCopy"
              :contextual-detail="moreAction.contextualDetail"
            />
          </template>
        </mt-segmented-control>
      </div>

      <div ref="tableWrapper" class="mt-data-table__table-wrapper">
        <table ref="dataTable">
          <caption class="mt-data-table__caption">
            {{
              caption
            }}
          </caption>

          <thead>
            <tr>
              <th
                v-if="enableRowNumbering"
                v-stickyColumn
                class="mt-data-table__table-row-number-head"
                scope="col"
              >
                <span> # </span>
              </th>

              <th
                v-if="allowRowSelection"
                v-stickyColumn
                class="mt-data-table__table-selection-head"
                scope="col"
              >
                <mt-checkbox :checked="somethingSelected" @change="handleSelectAll" />
              </th>

              <template v-for="column in sortedColumns">
                <!-- @vue-skip -->
                <th
                  v-if="isColumnVisible(column)"
                  :key="column.property"
                  :ref="
                    (el) => {
                      if (el) {
                        columnHeaderRefs[column.property] = el;
                      }
                    }
                  "
                  v-draggable="{ ...dragConfig, data: column }"
                  scope="col"
                  class="mt-data-table__table-wrapper-table-head"
                  :class="getColumnHeaderClasses(column)"
                  :data-header-column-property="column.property"
                  :style="renderColumnHeaderStyle(column)"
                  :data-testid="'column-table-head__' + column.property"
                  @mouseenter="() => (currentHoveredColumn = column.property)"
                  @mouseleave="() => (currentHoveredColumn = null)"
                >
                  <div
                    class="mt-data-table__table-head-dragzone"
                    :data-testid="'column-dragzone__' + column.property"
                  >
                    <div
                      class="mt-data-table__table-head-dragzone-bar"
                      :data-testid="'column-dragzone-bar__' + column.property"
                    >
                      <div class="mt-data-table__table-head-dragzone-indicator">
                        <mt-icon name="regular-grip-horizontal-s" />
                      </div>
                    </div>
                  </div>

                  <div
                    class="mt-data-table__table-head-inner-wrapper"
                    :class="getColumnHeaderInnerWrapperClasses(column)"
                  >
                    <span>{{ column.label }}</span>

                    <div
                      v-if="sortBy === column.property"
                      class="mt-data-table__table-head-sorting-icons"
                    >
                      <mt-icon
                        :name="
                          sortDirection === 'ASC' ? 'solid-long-arrow-up' : 'solid-long-arrow-down'
                        "
                        class="mt-data-table__table-head-sort"
                      />
                    </div>
                  </div>

                  <div
                    v-droppable="{ ...dropConfig, data: { ...column, dropZone: 'before' } }"
                    class="mt-data-table__table-head-dropzone-before"
                    :data-testid="'column-dropzone-before__' + column.property"
                  />
                  <div
                    v-droppable="{ ...dropConfig, data: { ...column, dropZone: 'after' } }"
                    class="mt-data-table__table-head-dropzone-after"
                    :data-testid="'column-dropzone-after__' + column.property"
                  />

                  <mt-popover
                    :title="column.label"
                    class="mt-data-table__table-head-column-settings"
                  >
                    <template #trigger="{ toggleFloatingUi }">
                      <div
                        class="mt-data-table__table-head-column-settings-trigger"
                        :data-testid="'column-settings-trigger__' + column.property"
                        @click="toggleFloatingUi"
                      >
                        <!-- DIV Placeholder for clicking to open the column settings popover -->
                      </div>
                    </template>

                    <template #popover-items__base="{ toggleFloatingUi }">
                      <mt-popover-item
                        v-if="column.sortable"
                        :label="t('columnSettings.sortAscending')"
                        icon="regular-long-arrow-up"
                        contextual-detail="A -> Z"
                        :on-label-click="
                          () => onColumnSettingsSortChange(column.property, 'ASC', toggleFloatingUi)
                        "
                      />

                      <mt-popover-item
                        v-if="column.sortable"
                        :label="t('columnSettings.sortDescending')"
                        icon="regular-long-arrow-down"
                        contextual-detail="Z -> A"
                        :on-label-click="
                          () =>
                            onColumnSettingsSortChange(column.property, 'DESC', toggleFloatingUi)
                        "
                      />

                      <mt-popover-item
                        v-if="!isPrimaryColumn(column)"
                        :label="t('columnSettings.hideColumn')"
                        icon="regular-eye-slash"
                        :on-label-click="() => changeColumnVisibility(column.property, false)"
                        border-top
                      />
                    </template>
                  </mt-popover>

                  <mt-floating-ui
                    v-if="highlightedColumn === column.property && !isDragging"
                    :is-opened="true"
                    :offset="0"
                    class="mt-data-table__table-head-add-column-indicator"
                    :auto-update-options="{ animationFrame: true }"
                  >
                    <mt-popover
                      :title="t('addColumnIndicator.popoverTitle')"
                      @update:is-opened="
                        (value) => {
                          if (value === false) {
                            forceHighlightedColumn = false;
                            setHighlightedColumn(null);
                          }
                        }
                      "
                    >
                      <template #trigger="{ toggleFloatingUi }">
                        <mt-icon
                          v-tooltip="{
                            message: t('addColumnIndicator.tooltipMessage'),
                            width: 'auto',
                          }"
                          name="solid-plus-square-s"
                          :data-testid="'add-column-indicator-icon__' + column.property"
                          @mouseenter="() => setHighlightedColumn(column)"
                          @mouseleave="() => setHighlightedColumn(null)"
                          @click="
                            () => {
                              forceHighlightedColumn = true;
                              toggleFloatingUi();
                            }
                          "
                        />
                      </template>

                      <template #popover-items__base="{ toggleFloatingUi }">
                        <mt-popover-item-result
                          :options="addColumnOptions"
                          @search="onAddColumnSearch"
                          @click-option="
                            (columnProperty) => {
                              onAddColumnOptionClick(columnProperty, column.property);
                              toggleFloatingUi();
                            }
                          "
                        />
                      </template>
                    </mt-popover>
                  </mt-floating-ui>

                  <div
                    v-if="column.allowResize !== false"
                    class="mt-data-table__table-head-resizable mt-data-table__table-head-resizable-before"
                    :data-testid="'mt-data-table__table-head-resizable-before__' + column.property"
                    @mousedown.prevent.stop="
                      () => startColumnResizing(getPreviousVisibleColumn(column))
                    "
                    @mouseenter="() => setHighlightedColumn(getPreviousVisibleColumn(column))"
                    @mouseleave="() => setHighlightedColumn(null)"
                  />

                  <div
                    v-if="column.allowResize !== false"
                    class="mt-data-table__table-head-resizable mt-data-table__table-head-resizable-after"
                    :data-testid="'mt-data-table__table-head-resizable-after__' + column.property"
                    @mousedown.prevent.stop="() => startColumnResizing(column)"
                    @mouseenter="() => setHighlightedColumn(column)"
                    @mouseleave="() => setHighlightedColumn(null)"
                  />
                </th>
              </template>

              <th
                v-if="!(disableSettingsTable && disableEdit && disableDelete)"
                class="mt-data-table__table-settings-button"
                scope="col"
              >
                <mt-data-table-settings
                  v-if="!disableSettingsTable"
                  :columns="sortedColumns"
                  :show-outlines="showOutlines"
                  :show-stripes="showStripes"
                  :enable-outline-framing="enableOutlineFraming"
                  :enable-row-numbering="enableRowNumbering"
                  @change-show-outlines="(newValue) => $emit('change-show-outlines', newValue)"
                  @change-show-stripes="(newValue) => $emit('change-show-stripes', newValue)"
                  @change-outline-framing="(newValue) => $emit('change-outline-framing', newValue)"
                  @change-enable-row-numbering="
                    (newValue) => $emit('change-enable-row-numbering', newValue)
                  "
                  @reset-all-changes="resetAllChanges"
                  @change-column-order="
                    ({ itemId, dropId, dropZone }) => changeColumnPosition(itemId, dropId, dropZone)
                  "
                  @change-column-visibility="
                    (columnProperty, visibility) =>
                      changeColumnVisibility(columnProperty, visibility)
                  "
                />
              </th>
            </tr>
          </thead>

          <tbody>
            <template v-if="dataSource.length > 0 || isLoading">
              <!-- @vue-skip -->
              <tr
                v-for="(data, rowIndex) in isLoading ? emptyData : dataSource"
                :key="data.id"
                :class="getColumnDataRowClasses(data.id)"
              >
                <td
                  v-if="enableRowNumbering"
                  v-stickyColumn
                  class="mt-data-table__table-row-number"
                >
                  <span>
                    {{ getRealIndex(rowIndex) }}
                  </span>
                </td>

                <td v-if="allowRowSelection" v-stickyColumn class="mt-data-table__table-select-row">
                  <mt-checkbox
                    :checked="getSelectionValue(data.id)"
                    @change="onRowSelect(data.id)"
                  />
                </td>

                <template v-for="column in sortedColumns">
                  <td
                    v-if="isColumnVisible(column)"
                    :key="column.property + JSON.stringify(columnChanges[column.property])"
                    :ref="
                      (el) => {
                        setColumnDataCellRefs({ el, column, index: rowIndex });
                      }
                    "
                    :data-cell-column-property="column.property"
                    :style="renderColumnDataCellStyle(column)"
                    :class="getColumnDataCellClasses(column)"
                    @mouseenter="() => setCurrentHoveredCell(column.property, data.id)"
                    @mouseleave="() => setCurrentHoveredCell(null, null)"
                  >
                    <template v-if="isLoading">
                      <mt-skeleton-bar />
                    </template>

                    <template v-else>
                      <!-- Use the correct renderer for the column -->
                      <mt-data-table-number-renderer
                        v-if="column.renderer === 'number'"
                        :data="data"
                        :column-definition="column"
                        @click="$emit('open-details', data)"
                      />

                      <mt-data-table-text-renderer
                        v-else-if="column.renderer === 'text'"
                        :data="data"
                        :column-definition="column"
                        @click="$emit('open-details', data)"
                      />

                      <mt-data-table-badge-renderer
                        v-else-if="column.renderer === 'badge'"
                        :data="data"
                        :column-definition="column"
                        @click="$emit('open-details', data)"
                      />

                      <mt-data-table-price-renderer
                        v-else-if="column.renderer === 'price'"
                        :data="data"
                        :column-definition="column"
                        @click="$emit('open-details', data)"
                      />
                    </template>
                  </td>
                </template>

                <td
                  v-if="!(disableSettingsTable && disableEdit && disableDelete)"
                  class="mt-data-table__table-context-button"
                >
                  <a v-if="!disableEdit" href="#" @click.prevent="$emit('open-details', data)">
                    {{ t("contextButtons.edit") }}
                  </a>
                  <mt-context-button v-if="!(disableDelete && disableEdit)">
                    <template #default="{ toggleFloatingUi }">
                      <mt-context-menu-item
                        v-if="!disableEdit"
                        :label="t('contextButtons.edit')"
                        @click="
                          () => {
                            toggleFloatingUi();
                            $emit('open-details', data);
                          }
                        "
                      />

                      <mt-context-menu-item
                        v-if="!disableDelete"
                        type="critical"
                        :label="t('contextButtons.delete')"
                        @click="
                          () => {
                            $emit('item-delete', data);
                            toggleFloatingUi();
                          }
                        "
                      />
                    </template>
                  </mt-context-button>
                </td>
              </tr>
            </template>

            <template v-else>
              <div class="mt-data-table__empty-state">
                <slot name="empty-state">
                  <mt-empty-state
                    icon="solid-products"
                    :headline="t('emptyState.headline')"
                    :description="t('emptyState.description')"
                  />
                </slot>
              </div>
            </template>
          </tbody>
        </table>
      </div>

      <div
        :style="tableStylingVariables"
        class="mt-data-table__scroll-shadow mt-data-table__scroll-shadow-top"
      />
      <div
        :style="tableStylingVariables"
        class="mt-data-table__scroll-shadow mt-data-table__scroll-shadow-right"
      />
      <div
        :style="tableStylingVariables"
        class="mt-data-table__scroll-shadow mt-data-table__scroll-shadow-bottom"
      />
      <div
        :style="tableStylingVariables"
        class="mt-data-table__scroll-shadow mt-data-table__scroll-shadow-left"
      />
    </template>

    <template #footer>
      <mt-inset class="mt-data-table__footer-inset">
        <div class="mt-data-table__footer-left">
          <mt-select
            small
            hide-clearable-button
            :options="paginationOptionsConverted"
            :model-value="paginationLimit"
            :aria-label="t('itemsPerPage')"
            @change="emitPaginationLimitChange"
          />
          <span class="mt-data-table__pagination-info-text">
            {{ t("itemsPerPage") }}
          </span>
        </div>

        <div class="mt-data-table__footer-right">
          <mt-pagination
            :limit="paginationLimit"
            :current-page="currentPage"
            :total-items="paginationTotalItems"
            @change-current-page="emitPaginationCurrentPageChange"
          />

          <mt-button
            v-if="enableReload"
            v-tooltip="{
              message: t('reload.tooltip'),
              width: 'auto',
            }"
            square
            aria-label="reload-data"
            variant="secondary"
            @click="emitReload"
          >
            <mt-icon name="solid-undo-s" />
          </mt-button>
        </div>
      </mt-inset>
    </template>
  </mt-card>
</template>

<script lang="ts">
import useScrollPossibilitiesClasses from "./composables/useScrollPossibilitiesClasses";
import type { PropType, Ref } from "vue";
import { defineComponent, computed, onBeforeUpdate, onMounted, onBeforeUnmount, ref } from "vue";
import MtCard from "../../layout/mt-card/mt-card.vue";
import MtButton from "../../form/mt-button/mt-button.vue";
import MtSelect from "../../form/mt-select/mt-select.vue";
import MtIcon from "../../icons-media/mt-icon/mt-icon.vue";
import MtPagination from "../mt-pagination/mt-pagination.vue";
import MtSearch from "../../navigation/mt-search/mt-search.vue";
import MtContextButton from "../../context-menu/mt-context-button/mt-context-button.vue";
import MtContextMenuItem from "../../context-menu/mt-context-menu-item/mt-context-menu-item.vue";
import MtDataTableSettings from "./sub-components/mt-data-table-settings/mt-data-table-settings.vue";
import MtPopover from "../../overlay/mt-popover/mt-popover.vue";
import MtPopoverItem, {
  type MtPopoverItemType,
} from "../../overlay/mt-popover-item/mt-popover-item.vue";
import MtPopoverItemResult from "../../overlay/mt-popover-item-result/mt-popover-item-result.vue";
import MtSkeletonBar from "../../feedback-indicator/mt-skeleton-bar/mt-skeleton-bar.vue";
import MtCheckbox from "../../form/mt-checkbox/mt-checkbox.vue";
import type { DropConfig, DragConfig } from "../../../directives/dragdrop.directive";
import { draggable, droppable } from "../../../directives/dragdrop.directive";
import type { TextColumnDefinition } from "./renderer/mt-data-table-text-renderer.vue";
import MtDataTableTextRenderer from "./renderer/mt-data-table-text-renderer.vue";
import type { NumberColumnDefinition } from "./renderer/mt-data-table-number-renderer.vue";
import MtDataTableNumberRenderer from "./renderer/mt-data-table-number-renderer.vue";
import type { BadgeColumnDefinition } from "./renderer/mt-data-table-badge-renderer.vue";
import MtDataTableBadgeRenderer from "./renderer/mt-data-table-badge-renderer.vue";
import MtDataTablePriceRenderer from "./renderer/mt-data-table-price-renderer.vue";
import type { PriceColumnDefinition } from "./renderer/mt-data-table-price-renderer.vue";
import MtSegmentedControl from "../../navigation/mt-segmented-control/mt-segmented-control.vue";
import type { SegmentedControlActionsProp } from "../../navigation/mt-segmented-control/mt-segmented-control.vue";
import MtFloatingUi from "../../_internal/mt-floating-ui/mt-floating-ui.vue";
import MtTooltipDirective from "../../../directives/tooltip.directive";
import MtEmptyState from "../../layout/mt-empty-state/mt-empty-state.vue";
import StickyColumn from "../../../directives/stickyColumn.directive";
import MtDataTableResetFilterButton from "./sub-components/mt-data-table-reset-filter-button/mt-data-table-reset-filter-button.vue";
import MtDataTableFilter from "./sub-components/mt-data-table-filter/mt-data-table-filter.vue";
import MtInset from "@/components/layout/mt-inset/mt-inset.vue";
import { throttle } from "@/utils/throttle";
import { reactive } from "vue";
import type { Filter } from "./mt-data-table.interfaces";
import { useI18n } from "vue-i18n";
import { useDebounceFn } from "@vueuse/core";

export interface BaseColumnDefinition {
  label: string; // the label for the column
  property: string; // the value for each entry
  position: number; // the initial position of the column. Should be defined in 100 steps
  sortable?: boolean; // enable or disable sortability for this column (default=true)
  width?: number; // define the width value for this column
  allowResize?: boolean; // you can disable the possibility for the user to resize this column
  cellWrap?: "nowrap" | "normal";
  visible?: boolean; // you can hide a column by default
}

export type ColumnDefinition =
  | BadgeColumnDefinition
  | TextColumnDefinition
  | NumberColumnDefinition
  | PriceColumnDefinition;

export interface ColumnChanges {
  property?: ColumnDefinition["property"];
  position?: ColumnDefinition["position"];
  width?: ColumnDefinition["width"];
  visible?: ColumnDefinition["visible"];
}

type DataSourcePropType = {
  id: string;
  [key: string]: unknown;
}[];

type ColumnProperty = ColumnDefinition[];

/**
 * @experimental - This component can be used but there are no guarantees for API stability yet.
 */
export default defineComponent({
  directives: {
    draggable: draggable,
    droppable: droppable,
    tooltip: MtTooltipDirective,
    stickyColumn: StickyColumn,
  },
  components: {
    "mt-card": MtCard,
    "mt-button": MtButton,
    "mt-select": MtSelect,
    "mt-icon": MtIcon,
    "mt-pagination": MtPagination,
    "mt-search": MtSearch,
    "mt-checkbox": MtCheckbox,
    "mt-context-button": MtContextButton,
    "mt-data-table-settings": MtDataTableSettings,
    "mt-popover": MtPopover,
    "mt-popover-item": MtPopoverItem,
    "mt-popover-item-result": MtPopoverItemResult,
    "mt-skeleton-bar": MtSkeletonBar,
    "mt-context-menu-item": MtContextMenuItem,
    "mt-floating-ui": MtFloatingUi,
    "mt-segmented-control": MtSegmentedControl,
    "mt-empty-state": MtEmptyState,
    "mt-data-table-text-renderer": MtDataTableTextRenderer,
    "mt-data-table-number-renderer": MtDataTableNumberRenderer,
    "mt-data-table-badge-renderer": MtDataTableBadgeRenderer,
    "mt-data-table-price-renderer": MtDataTablePriceRenderer,
    "mt-data-table-reset-filter-button": MtDataTableResetFilterButton,
    "mt-data-table-filter": MtDataTableFilter,
    "mt-inset": MtInset,
  },
  props: {
    /**
     * The data source which contains the data for the current
     * state of the table.
     */
    dataSource: {
      type: Array as PropType<DataSourcePropType>,
      required: true,
    },
    /**
     * The defintions for the columns which should be displayed in the table.
     */
    columns: {
      type: Array as PropType<ColumnProperty>,
      required: true,
      validator: (columnsValue: Record<string, unknown>[]) => {
        /**
         * This validator checks if every colum entry is matching the definition.
         */
        const validValues = columnsValue.map((value) => {
          const hasLabel = typeof value.label === "string" && value.label;
          const hasProperty = typeof value.property === "string" && value.property;
          const hasRenderer =
            typeof value.renderer === "string" &&
            ["text", "number", "price", "badge"].includes(value.renderer);
          const hasPosition = typeof value.position === "number";
          const isInvalid = !hasLabel || !hasProperty || !hasRenderer || !hasPosition;
          return isInvalid ? false : true;
        });
        return validValues.every((value) => value);
      },
    },
    /**
     * Optional property. When you want to override the current column
     * information with the given changes, you can pass them here.
     * The changes will be applied to the current column information.
     * This is useful for saving and loading the current column configuration
     * when the user customizes the table.
     */
    columnChanges: {
      type: Object as PropType<Record<string, ColumnChanges>>,
      required: false,
      default: () => reactive({}),
    },
    /**
     * Define the title of the table.
     */
    title: {
      type: String,
      required: false,
      default: "",
    },
    /**
     * Define the subtitle of the table.
     */
    subtitle: {
      type: String,
      required: false,
      default: "",
    },
    /**
     * The layout of the data table.
     * @values default, full
     */
    layout: {
      type: String as PropType<"default" | "full">,
      required: false,
      default: "default",
    },
    /**
     * Activate the reload button at the top right corner of the table.
     */
    enableReload: {
      type: Boolean,
      required: false,
      default: false,
    },
    /**
     * Define the current page of the table.
     */
    currentPage: {
      type: Number,
      required: true,
    },
    /**
     * Define the limit of items per page.
     */
    paginationLimit: {
      type: Number,
      required: true,
    },
    /**
     * Define the total amount of items.
     */
    paginationTotalItems: {
      type: Number,
      required: true,
    },
    /**
     * Define the available pagination limits.
     */
    paginationOptions: {
      type: Array as PropType<number[]>,
      required: false,
      default: () => [5, 10, 25, 50],
    },
    /**
     * Define the current sort by property.
     */
    sortBy: {
      type: String,
      required: false,
      default: "",
    },
    /**
     * Define the current sort direction.
     */
    sortDirection: {
      type: String as PropType<"ASC" | "DESC">,
      required: false,
      default: "ASC",
    },
    /**
     * If active then the search input will be disabled.
     */
    disableSearch: {
      type: Boolean,
      required: false,
      default: false,
    },
    /**
     * Define the current search value.
     */
    searchValue: {
      type: String,
      required: false,
      default: "",
    },
    /**
     * If active then the table will be in loading state.
     */
    isLoading: {
      type: Boolean,
      required: false,
      default: false,
    },
    /**
     * If active user can select rows and can perform actions on them.
     */
    allowRowSelection: {
      type: Boolean,
      required: false,
      default: false,
    },

    selectedRows: {
      type: Array as PropType<string[]>,
      required: false,
      default: () => [],
    },

    /**
     * If active user can do bulk edit by selecting items
     */
    allowBulkEdit: {
      type: Boolean,
      required: false,
      default: false,
    },
    /**
     * If active user can do bulk delete by selecting items
     */
    allowBulkDelete: {
      type: Boolean,
      required: false,
      default: false,
    },

    /**
     * Add more custom bulk edit actions
     */
    bulkEditMoreActions: {
      type: Array as PropType<
        {
          id: string;
          label: string;
          onClick: () => void;
          icon?: "default" | "critical" | "active" | string;
          type?: MtPopoverItemType;
          metaCopy?: string;
          contextualDetail?: string;
        }[]
      >,
      required: false,
      default: () => [],
    },

    /***
     * Enable numbered rows
     */
    enableRowNumbering: {
      type: Boolean,
      required: false,
      default: false,
    },

    /**
     * Enable or disable the stripe design for the table.
     */
    showStripes: {
      type: Boolean,
      required: false,
      default: true,
    },

    /**
     * Enable or disable outlines for the table.
     */
    showOutlines: {
      type: Boolean,
      required: false,
      default: true,
    },

    /**
     * Enable or disable outline framing on hover
     */
    enableOutlineFraming: {
      type: Boolean,
      required: false,
      default: false,
    },

    /**
     * Disable the possibility to delete items
     */
    disableDelete: {
      type: Boolean,
      required: false,
      default: false,
    },

    /**
     * Disable the possibility to edit items
     */
    disableEdit: {
      type: Boolean,
      required: false,
      default: false,
    },

    /**
     * Disable the possibility to settings table
     */
    disableSettingsTable: {
      type: Boolean,
      required: false,
      default: false,
    },

    /**
     * Caption for accessibility
     */
    caption: {
      type: String,
      required: false,
      default: "Data table",
    },

    /**
     * All available filters
     */
    filters: {
      type: Array as PropType<Filter[]>,
      required: false,
      default: () => [],
    },

    /**
     * Filters in use by the user
     */
    appliedFilters: {
      type: Array as PropType<Filter[]>,
      required: false,
      default: () => [],
    },

    /**
     * Displays how many results are found
     */
    numberOfResults: {
      type: Number,
      required: false,
      default: undefined,
    },
  },
  emits: [
    "reload",
    "pagination-limit-change",
    "pagination-current-page-change",
    "search-value-change",
    "sort-change",
    "open-details",
    "selection-change",
    "multiple-selection-change",
    "bulk-edit",
    "bulk-delete",
    "change-show-outlines",
    "change-show-stripes",
    "change-outline-framing",
    "change-enable-row-numbering",
    "item-delete",
    "update:appliedFilters",
  ],
  setup(props, { emit }) {
    const { t } = useI18n({
      messages: {
        en: {
          itemsPerPage: "Items per page",
          filter: {
            numberOfResults: "No results found for | One result found for | {n} results found for",
            addFilter: "Add filter",
            fetchingFilteredResults: "Getting filtered results...",
          },
          columnSettings: {
            sortAscending: "Sort ascending",
            sortDescending: "Sort descending",
            hideColumn: "Hide column",
          },
          addColumnIndicator: {
            popoverTitle: "Add column content",
            tooltipMessage: "Add column",
          },
          contextButtons: {
            edit: "Edit",
            delete: "Delete",
          },
          emptyState: {
            headline: "Add your first item",
            description: "Currently no items are available yet.",
          },
          bulkEdit: {
            itemsSelected: "1 item selected | {n} items selected",
            edit: "Edit",
            delete: "Delete",
            more: "...",
          },
          reload: {
            tooltip: "Reload",
          },
        },
        de: {
          itemsPerPage: "Einträge pro Seite",
          filter: {
            numberOfResults:
              "Keine Einträge gefunden | Ein Eintrag gefunden | {n} Einträge gefunden",
            addFilter: "Filter hinzufügen",
            fetchingFilteredResults: "Filterergebnisse werden geladen...",
          },
          columnSettings: {
            sortAscending: "Aufsteigend sortieren",
            sortDescending: "Absteigend sortieren",
            hideColumn: "Spalte ausblenden",
          },
          addColumnIndicator: {
            popoverTitle: "Spalteninhalt hinzufügen",
            tooltipMessage: "Spalte hinzufügen",
          },
          contextButtons: {
            edit: "Bearbeiten",
            delete: "Löschen",
          },
          emptyState: {
            headline: "Füge dein erstes Element hinzu",
            description: "Aktuell sind noch keine Elemente vorhanden.",
          },
          bulkEdit: {
            itemsSelected: "1 Element ausgewählt | {n} Elemente ausgewählt",
            edit: "Bearbeiten",
            delete: "Löschen",
            more: "...",
          },
          reload: {
            tooltip: "Neu laden",
          },
        },
      },
    });

    const filterChildViews = computed(() => {
      return props.filters.map(({ id, label }) => ({ name: id, title: label }));
    });

    /**
     * General
     */
    const sortedColumns = computed(() => {
      return columnsWithChanges.value.slice().sort((a, b) => a.position - b.position);
    });

    const currentHoveredColumn = ref<string | null>(null);
    const currentHoveredRow = ref<string | null>(null);

    const setCurrentHoveredCell = (columnProperty: string | null, rowId: string) => {
      currentHoveredColumn.value = columnProperty;
      currentHoveredRow.value = rowId;
    };

    const visibleColumns = computed(() => {
      return sortedColumns.value.filter((column) => column.visible !== false);
    });

    const isFirstVisibleColumn = (column: ColumnDefinition) => {
      return visibleColumns.value[0].property === column.property;
    };

    const isPrimaryColumn = (column: ColumnDefinition) => {
      return props.columns[0].property === column.property;
    };

    /***
     * Add column indicator
     */
    const addColumnOptionsSearch = ref("");
    const onAddColumnSearch = (value: string) => {
      addColumnOptionsSearch.value = value;
    };
    const addColumnOptions = computed(() => {
      return sortedColumns.value
        .map((column) => {
          return {
            id: column.property,
            label: column.label,
            parentGroup: undefined,
            position: column.position,
            isVisible: column.visible ?? true,
            isClickable: column.visible === false ? true : false,
            isSortable: false,
            isHidable: false,
            disabled: column.visible === false ? false : true,
          };
        })
        .filter((column) => {
          return column.label.toLowerCase().includes(addColumnOptionsSearch.value.toLowerCase());
        });
    });

    const onAddColumnOptionClick = (columnProperty: string, previousColumnProperty: string) => {
      changeColumnPosition(columnProperty, previousColumnProperty, "after");
      changeColumnVisibility(columnProperty, true);
    };

    /***
     * Colum changes helper
     */
    const resetAllChanges = () => {
      Object.keys(props.columnChanges).forEach((key) => {
        // eslint-disable-next-line vue/no-mutating-props
        props.columnChanges[key] = {};
      });
    };

    const addToColumnChanges = (columnProperty: string, columnChanges: ColumnChanges) => {
      if (!props.columnChanges[columnProperty]) {
        // eslint-disable-next-line vue/no-mutating-props
        props.columnChanges[columnProperty] = {};
      }

      // save new width to columnChanges to make changes permanent

      // eslint-disable-next-line vue/no-mutating-props
      props.columnChanges[columnProperty] = {
        ...props.columnChanges[columnProperty],
        ...columnChanges,
      };
    };

    const columnsWithChanges = computed(() => {
      return props.columns.map((column) => {
        const columnChanges = props.columnChanges[column.property];

        if (!columnChanges) {
          return column;
        }

        return {
          ...column,
          ...columnChanges,
        };
      });
    });

    /***
     * Handle column resizing
     */

    // save all column and table refs
    const dataTable = ref<HTMLElement | null>(null);
    const columnHeaderRefs = ref<Record<string, HTMLElement>>({});
    const columnDataCellRefs = ref<Record<string, HTMLElement[]>>({});
    const setColumnDataCellRefs = ({
      el,
      column,
      index,
    }: {
      el?: HTMLElement;
      column: ColumnDefinition;
      index: number;
    }) => {
      if (el) {
        if (!Array.isArray(columnDataCellRefs.value[column.property])) {
          columnDataCellRefs.value[column.property] = [];
        }

        columnDataCellRefs.value[column.property][index] = el;
      }
    };

    // reset all column refs before each update
    onBeforeUpdate(() => {
      columnHeaderRefs.value = {};
      columnDataCellRefs.value = {};
    });

    /***
     * This method will be executed when the user press the mouse down on the hidden resize bar of the column
     */
    const startColumnResizing = (column: ColumnDefinition | null) => {
      if (!column) {
        return;
      }

      makeAllColumnsFixedWidth();

      // get the refs for the column header and all column data cells
      const currentColumnHeaderCell = columnHeaderRefs.value[column.property];
      const currentColumnDataCells = columnDataCellRefs.value[column.property];

      // stop resizing when resizing for the column is not allowed
      if (
        !currentColumnHeaderCell ||
        (typeof column.allowResize === "boolean" && !column.allowResize)
      ) {
        return;
      }

      // save the iniital position and width of the column header for later use
      const columnHeaderBoundingClientRect = currentColumnHeaderCell.getBoundingClientRect();
      const startColumnHeaderWidth = columnHeaderBoundingClientRect.width;

      // remove transition on table
      if (dataTable.value) {
        dataTable.value.classList.add("--no-transition");
        dataTable.value.classList.add("--resizing");
      }

      // set cursor globally to resize
      document.body.style.cursor = "col-resize";

      // this method gets executed when the mouse will be moved
      const mouseMoveHandler = (e: MouseEvent) => {
        // disable selection, etc. with mouse while dragging
        e.stopPropagation();
        e.preventDefault();

        // calculate the new width based on mouse position and position of the table header
        const newWidth = Math.ceil(e.pageX - columnHeaderBoundingClientRect.left);

        // set width for column header and column cells
        setColumnHeaderWidthInline(currentColumnHeaderCell, newWidth);
        setColumnDataCellsWidthInline(currentColumnDataCells, newWidth);

        // add additional padding to right so that the horizontal width don't change by reducing column size
        if (dataTable.value) {
          const paddingRight = startColumnHeaderWidth - newWidth;
          dataTable.value.style.paddingRight = paddingRight > 0 ? `${paddingRight}px` : "";
        }
      };

      // this method will be executed when the user stops pressing the mouse
      const mouseUpHandler = () => {
        // reset global cursor
        document.body.style.cursor = "";

        addToColumnChanges(column.property, {
          width: parseInt(currentColumnHeaderCell.style.width, 10),
        });

        // reset additional paddingRight after finished the resizing
        if (dataTable.value) {
          dataTable.value.classList.remove("--no-transition");
          dataTable.value.classList.remove("--resizing");
          dataTable.value.style.removeProperty("padding-right");
        }

        // Remove all handlers
        window.removeEventListener("mousemove", mouseMoveHandler);
        window.removeEventListener("mouseup", mouseUpHandler);
      };

      // Watcher for mouse position to calculate width of the column
      window.addEventListener("mousemove", mouseMoveHandler);
      window.addEventListener("mouseup", mouseUpHandler);
    };

    const makeAllColumnsFixedWidth = () => {
      const currentWidths: Record<string, number> = {};

      Object.entries(columnHeaderRefs.value).forEach(([columnProperty, columnHeaderElement]) => {
        const currentColumnDefinition = props.columns.find(
          (column) => column.property === columnProperty,
        );

        // skip the columns which shouldn't be resized and have fixed with
        if (
          currentColumnDefinition &&
          currentColumnDefinition.allowResize === false &&
          typeof currentColumnDefinition.width === "number"
        ) {
          return;
        }

        // save the current width
        const columnHeaderBoundingClientRect = columnHeaderElement.getBoundingClientRect();
        currentWidths[columnProperty] = columnHeaderBoundingClientRect.width;

        // set the current width
        setColumnHeaderWidthInline(columnHeaderElement, currentWidths[columnProperty]);
      });

      Object.entries(columnDataCellRefs.value).forEach(([columnProperty, columnDataCells]) => {
        if (currentWidths[columnProperty]) {
          setColumnDataCellsWidthInline(columnDataCells, currentWidths[columnProperty]);
        }
      });
    };

    const setColumnHeaderWidthInline = (columnHeader: HTMLElement, width: number) => {
      columnHeader.style.width = `${width}px`;
      columnHeader.style.minWidth = `${width}px`;
    };

    const setColumnDataCellsWidthInline = (columnDataCells: HTMLElement[], width: number) => {
      columnDataCells.forEach((columnDataCell) => {
        columnDataCell.style.width = `${width}px`;
        columnDataCell.style.minWidth = `${width}px`;
        columnDataCell.style.maxWidth = `${width}px`;
      });
    };

    const renderColumnDefaultStyle = (column: ColumnDefinition) => {
      const customColumnWidth = props.columnChanges[column.property]?.width;
      const defaultColumnWidth = "auto";
      const minimumColumnWidth = "100px";

      const width = (() => {
        if (customColumnWidth && column.allowResize !== false) {
          return `${customColumnWidth}px`;
        }

        return typeof column.width === "number" ? `${column.width}px` : defaultColumnWidth;
      })();

      const minWidth = (() => {
        if (customColumnWidth && column.allowResize !== false) {
          return `${customColumnWidth}px`;
        }

        return typeof column.width === "number" ? `${column.width}px` : minimumColumnWidth;
      })();

      const maxWidth = (() => {
        if (customColumnWidth && column.allowResize !== false) {
          return `${customColumnWidth}px`;
        }

        if (column.cellWrap === "normal") {
          return "auto";
        }

        if (typeof column.width === "number") {
          return `${column.width}px`;
        }
        // The maxWidth fallback is the minimum width. In table this behaves differently so it can be larger than the minWidth
        return minimumColumnWidth;
      })();
      const whiteSpace = typeof column.cellWrap === "string" ? column.cellWrap : "nowrap";

      return {
        width: width,
        "min-width": minWidth,
        "max-width": maxWidth,
        "white-space": whiteSpace,
      };
    };

    const renderColumnHeaderStyle = (column: ColumnDefinition) => {
      return {
        ...renderColumnDefaultStyle(column),
        "max-width": "fit-content",
      };
    };

    const renderColumnDataCellStyle = (column: ColumnDefinition) => {
      return {
        ...renderColumnDefaultStyle(column),
      };
    };

    const getColumnDataCellClasses = (column: ColumnDefinition) => {
      const classes = [];

      if (highlightedColumn.value === column.property) {
        classes.push("--highlighted");
      }

      if (currentHoveredColumn.value === column.property) {
        classes.push("--hovered");
      }

      return classes;
    };

    const getColumnHeaderClasses = (column: ColumnDefinition) => {
      const classes = [];

      if (highlightedColumn.value === column.property) {
        classes.push("--highlighted");
      }

      if (currentHoveredColumn.value === column.property) {
        classes.push("--hovered");
      }

      return classes;
    };

    const getColumnDataRowClasses = (rowId: string) => {
      const classes = [];

      if (currentHoveredRow.value === rowId) {
        classes.push("--hovered");
      }

      return classes;
    };

    const isColumnVisible = (column: ColumnDefinition) => {
      return column.visible ?? true;
    };

    const isMouseOver = ref<boolean>(false);
    const forceHighlightedColumn = ref<boolean>(false);
    const highlightedColumn = ref<string | null>(null);

    const setHighlightedColumn = (column: ColumnDefinition | null) => {
      if (dataTable.value?.classList.contains("--resizing")) {
        return;
      }

      if (!column) {
        if (forceHighlightedColumn.value) {
          return;
        }

        isMouseOver.value = false;

        window.setTimeout(() => {
          if (!isMouseOver.value) {
            highlightedColumn.value = null;
          }
        }, 100);
        return;
      }

      if (forceHighlightedColumn.value) {
        return;
      }

      isMouseOver.value = true;
      highlightedColumn.value = column.property;
    };

    /***
     * Pagination
     */
    const emitReload = () => emit("reload");

    const emitPaginationLimitChange = (limitValue: number) => {
      emit("pagination-limit-change", limitValue);
    };

    const emitPaginationCurrentPageChange = (currentPage: number) => {
      emit("pagination-current-page-change", currentPage);
    };

    /***
     * Search
     */
    const emitSearchValueChange = (searchValue: string) => {
      emit("search-value-change", searchValue);
    };

    const debouncedEmitSearchValueChange = useDebounceFn((value: string) => {
      emitSearchValueChange(value);
    }, 300); // 300ms debounce delay

    const handleSearchUpdate = (value: string) => {
      debouncedEmitSearchValueChange(value);
    };

    const paginationOptionsConverted = computed(() => {
      return props.paginationOptions.map((paginationNumber) => ({
        id: paginationNumber,
        label: paginationNumber.toString(),
        value: paginationNumber,
      }));
    });

    /***
     * Column Reordering
     */
    const changeColumnPosition = (
      columnId: string,
      targetColumnId: string,
      insertPosition: "before" | "after" = "before",
    ) => {
      const column = columnsWithChanges.value.find((column) => column.property === columnId);
      const targetColumn = columnsWithChanges.value.find(
        (column) => column.property === targetColumnId,
      );

      if (!column || !targetColumn) {
        return;
      }

      [...columnsWithChanges.value]
        .sort((columnA, columnB) => {
          return columnA.position - columnB.position;
        })
        .sort((columnA, columnB) => {
          // The logic for inserting the column before or after the target column
          if (columnB.property === column.property) {
            if (insertPosition === "after") {
              return columnA.position <= targetColumn.position ? -1 : 1;
            } else {
              return columnA.position < targetColumn.position ? -1 : 1;
            }
          }

          if (columnA.property === column.property) {
            if (insertPosition === "after") {
              return columnB.position > targetColumn.position ? -1 : 1;
            } else {
              return columnB.position >= targetColumn.position ? -1 : 1;
            }
          }

          return 0;
        })
        .forEach((column, index) => {
          addToColumnChanges(column.property, { position: index * 100 });
        });
    };

    const isDragging = ref<boolean>(false);
    const DRAG_GROUP_COLUMN = "drag-group-column";

    const dragConfig: Partial<DragConfig<ColumnDefinition & { dropZone?: "before" | "after" }>> = {
      dragGroup: DRAG_GROUP_COLUMN,
      preventEvent: false,
      validateDragStart: (dragConfigData, el, event) => {
        const allDragZones = document.querySelectorAll(".mt-data-table__table-head-dragzone");
        // @ts-expect-error - TS doesn't know that target is a valid element
        const isChild = [...allDragZones].some((dragZone) => dragZone.contains(event.target));

        return isChild;
      },
      onDragStart: () => {
        // add drag information to the table
        if (dataTable.value) {
          dataTable.value.classList.add("is--dragging-inside");
        }

        // set cursor globally to grabbing
        document.body.style.cursor = "grabbing";
        isDragging.value = true;
      },
      onDrop: (dragConfigData, dropConfigData) => {
        // remove drag information to the table
        if (dataTable.value) {
          dataTable.value.classList.remove("is--dragging-inside");
        }

        // reset global cursor
        document.body.style.cursor = "";
        isDragging.value = false;

        if (dragConfigData && dropConfigData) {
          changeColumnPosition(
            dragConfigData.property,
            dropConfigData.property,
            dropConfigData.dropZone,
          );
        }
      },
    };

    const dropConfig: Partial<DropConfig & { dropZone?: "before" | "after" }> = {
      dragGroup: DRAG_GROUP_COLUMN,
    };

    const changeColumnVisibility = (columnProperty: string, visibility: boolean) => {
      const column = columnsWithChanges.value.find((column) => column.property === columnProperty);

      if (!column) {
        return;
      }

      addToColumnChanges(columnProperty, {
        visible: visibility,
      });
    };

    /**
     * Methods for sorting and filtering the data
     */
    const emitSortChange = (property: string, direction: "ASC" | "DESC") => {
      emit("sort-change", property, direction);
    };

    const onColumnSettingsSortChange = (
      property: string,
      direction: "ASC" | "DESC",
      chainMethod?: () => void,
    ) => {
      emitSortChange(property, direction);

      if (chainMethod) {
        chainMethod();
      }
    };

    function removeFilter(id: string) {
      const updatedFilters = props.appliedFilters.filter((filter) => filter.id !== id);

      emit("update:appliedFilters", updatedFilters);
    }

    function addOption(filterId: string, optionId: string) {
      const filter = props.filters.find((filter) => filter.id === filterId);
      if (!filter)
        throw new Error(
          `Failed to add filter option: Filter with the id "${filterId}" is not correct`,
        );

      const filterAlreadyInUse = !!props.appliedFilters.find((appliedFilter) => {
        return appliedFilter.id === filter.id;
      });

      if (!filterAlreadyInUse) {
        emit("update:appliedFilters", [
          ...props.appliedFilters,
          {
            ...filter,
            type: {
              ...filter.type,
              options: [filter.type.options.find((option) => option.id === optionId)],
            },
          },
        ]);

        return;
      }

      emit("update:appliedFilters", [
        ...props.appliedFilters.map((appliedFilter) => {
          if (appliedFilter.id === filter.id) {
            return {
              ...appliedFilter,
              type: {
                ...appliedFilter.type,
                options: [
                  ...appliedFilter.type.options,
                  filter.type.options.find((option) => option.id === optionId),
                ],
              },
            };
          }

          return appliedFilter;
        }),
      ]);
    }

    function removeOption(filterId: string, optionId: string) {
      const removingLastOptionInFilter = props.appliedFilters.some((appliedFilter) => {
        if (appliedFilter.id === filterId) {
          if (appliedFilter.type.options.length === 1) {
            return true;
          }
        }

        return false;
      });

      if (removingLastOptionInFilter) {
        const newFilters = props.appliedFilters.filter(
          (appliedFilter) => appliedFilter.id !== filterId,
        );

        emit("update:appliedFilters", newFilters);

        return;
      }

      const newFilters = props.appliedFilters.map((appliedFilter) => {
        if (appliedFilter.id === filterId) {
          return {
            ...appliedFilter,
            type: {
              ...appliedFilter.type,
              options: appliedFilter.type.options.filter((option) => option.id !== optionId),
            },
          };
        }

        return appliedFilter;
      });

      emit("update:appliedFilters", newFilters);
    }

    function isOptionSelected(filterId: string, optionId: string) {
      const filterInUse = props.appliedFilters.find((appliedFilter) => {
        return appliedFilter.id === filterId;
      });

      if (!filterInUse) return false;
      return !!filterInUse.type.options.find((option) => option.id === optionId);
    }

    /***
     * Add scroll possibilities to tableWrapper
     */
    const tableWrapper = ref();
    useScrollPossibilitiesClasses(tableWrapper);

    /**
     * General classes for whole data table
     */
    const MtDataTableClasses = computed(() => {
      return {
        "mt-data-table__layout-default": props.layout === "default",
        "mt-data-table__layout-full": props.layout === "full",
        "mt-data-table__first-column-fixed": props.allowRowSelection,
        // could be relevant in the feature when you can disable the context button
        "mt-data-table__last-column-fixed": true,
        "mt-data-table__stripes": props.showStripes,
        "mt-data-table__outlines": props.showOutlines,
        "mt-data-table__column-outline-framing-active": props.enableOutlineFraming,
      };
    });

    const getColumnHeaderInnerWrapperClasses = (column: ColumnDefinition) => {
      return [`mt-data-table__table-head-inner-wrapper-${column.renderer}-renderer`];
    };

    const leftFixedColumnWidth = ref<number>(0);

    const calculateLeftFixedColumnWith = () => {
      if (dataTable.value) {
        const stickyColumns = dataTable.value.querySelectorAll("thead th[data-sticky-column]");

        const lastStickyColumn = stickyColumns[stickyColumns.length - 1] as HTMLElement;

        if (!lastStickyColumn) {
          return;
        }

        const lastStickyColumnRight = lastStickyColumn.dataset.stickyColumnRight;

        leftFixedColumnWidth.value = Number(lastStickyColumnRight);
      }
    };

    let tableMutationObserver: MutationObserver | undefined;

    const createTableMutationObserver = () => {
      if (dataTable.value) {
        tableMutationObserver = new MutationObserver(
          throttle(() => {
            calculateLeftFixedColumnWith();
          }, 60),
        );

        tableMutationObserver.observe(dataTable.value as HTMLElement, {
          childList: true,
          subtree: true,
          attributes: true,
        });
      }
    };

    onMounted(() => {
      createTableMutationObserver();
      calculateLeftFixedColumnWith();
    });

    onBeforeUnmount(() => {
      if (tableMutationObserver) {
        tableMutationObserver.disconnect();
      }
    });

    /**
     * Adjust table variables
     */
    const tableStylingVariables = computed(() => {
      return {
        "--fixed-left-column-width": `${leftFixedColumnWidth.value}px`,
        "--fixed-right-column-width": "105px",
      };
    });

    /**
     * Row selection
     */
    const getSelectionValue = (dataId: string) => {
      if (props.allowRowSelection) {
        return props.selectedRows.includes(dataId);
      }

      return false;
    };

    const onRowSelect = (dataId: string) => {
      if (props.allowRowSelection) {
        const previousValue = getSelectionValue(dataId);

        emit("selection-change", {
          id: dataId,
          value: !previousValue,
        });
      }
    };

    const somethingSelected = computed(() => {
      return props.selectedRows.length > 0;
    });

    const bulkEditSegmentedControlActions = computed(() => {
      const actions: SegmentedControlActionsProp = [
        {
          id: "item-selection-count",
          label: t("bulkEdit.itemsSelected", { n: props.selectedRows.length }),
          onClick: () => {
            emit("multiple-selection-change", {
              selections: props.selectedRows,
              value: false,
            });
          },
          isPressed: true,
          checked: true,
          hasCheckbox: true,
        },
      ];

      if (props.allowBulkEdit && !props.disableEdit) {
        actions.push({
          id: "edit",
          label: t("bulkEdit.edit"),
          onClick: () => emit("bulk-edit"),
        });
      }

      if (props.allowBulkDelete && !props.disableDelete) {
        actions.push({
          id: "delete",
          label: t("bulkEdit.delete"),
          onClick: () => emit("bulk-delete"),
          isCritical: true,
        });
      }

      if (props.bulkEditMoreActions.length > 0) {
        actions.push({
          id: "more",
          label: t("bulkEdit.more"),
          popover: {},
        });
      }

      return actions;
    });

    const handleSelectAll = () => {
      emit("multiple-selection-change", {
        selections: props.dataSource.map((r) => r.id),
        value: true,
      });
    };

    const getPreviousVisibleColumn = (column: ColumnDefinition): ColumnDefinition | null => {
      const visibleColumns = sortedColumns.value.filter((c) => isColumnVisible(c));

      const index = visibleColumns.findIndex((c) => c.property === column.property);

      if (index <= 0) {
        return null;
      }

      return visibleColumns[index - 1];
    };

    /**
     * Add empty data to source when data is loading
     */
    const emptyData = computed(() => {
      return Array.from({ length: props.paginationLimit }, () => ({}));
    });

    /**
     * Calculate the real index number based on page, limit and index
     */
    const getRealIndex = (index: number) => {
      return (props.currentPage - 1) * props.paginationLimit + index + 1;
    };

    return {
      t,
      sortedColumns,
      isFirstVisibleColumn,
      addColumnOptions,
      renderColumnDataCellStyle,
      renderColumnHeaderStyle,
      tableWrapper,
      emitReload,
      emitPaginationLimitChange,
      emitPaginationCurrentPageChange,
      emitSearchValueChange,
      paginationOptionsConverted,
      startColumnResizing,
      columnHeaderRefs,
      columnDataCellRefs,
      setColumnDataCellRefs,
      dataTable: dataTable as Ref<HTMLElement | null>,
      dragConfig,
      dropConfig,
      resetAllChanges,
      changeColumnPosition,
      isColumnVisible,
      changeColumnVisibility,
      emitSortChange,
      onColumnSettingsSortChange,
      MtDataTableClasses,
      tableStylingVariables,
      getSelectionValue,
      onRowSelect,
      somethingSelected,
      bulkEditSegmentedControlActions,
      handleSelectAll,
      highlightedColumn,
      setHighlightedColumn,
      getColumnDataCellClasses,
      getColumnHeaderClasses,
      getPreviousVisibleColumn,
      getColumnDataRowClasses,
      getColumnHeaderInnerWrapperClasses,
      forceHighlightedColumn,
      addColumnOptionsSearch,
      onAddColumnOptionClick,
      onAddColumnSearch,
      currentHoveredColumn,
      currentHoveredRow,
      setCurrentHoveredCell,
      isPrimaryColumn,
      emptyData,
      getRealIndex,
      isDragging,
      filterChildViews,
      removeFilter,
      addOption,
      removeOption,
      isOptionSelected,
      handleSearchUpdate: handleSearchUpdate, // Use explicit assignment
    };
  },
});
</script>

<style lang="scss">
/**
* Use inter-font instead of normal font for data-table. Also add the new variables to this file.
*/
$font-family-variables:
  "Inter var",
  -apple-system,
  BlinkMacSystemFont,
  "San Francisco",
  "Segoe UI",
  Roboto,
  "Helvetica Neue",
  sans-serif;
$font-family-default-feature-settings:
  "ss01" on,
  "ss02" on,
  "case" on,
  "cpsp" on,
  "zero" on,
  "cv09" on,
  "cv07" on,
  "cv06" on,
  "cv10" on,
  "cv11" on;

$color-card-headline: #1c1c1c;
$color-shopware-brand-vivacious-500: #0f76de;

$scrollShadowSize: 16px;
$scrollShadowColor: rgba(120, 120, 120, 0.1);
$tableHeaderSize: 51px;
$scrollShadowHeight: calc(100% - $tableHeaderSize - var(--scrollbar-height));

$tableCellPaddingTop: 18px;
$tableCellPaddingRight: 16px;
$tableCellPaddingBottom: 14px;
$tableCellPaddingLeft: 16px;
$tableCellPadding: $tableCellPaddingTop $tableCellPaddingRight $tableCellPaddingBottom
  $tableCellPaddingLeft;

.mt-data-table {
  display: flex;
  flex-direction: column;
  height: 100%;

  --table-header-size: $tableHeaderSize;

  &.mt-data-table__layout-default {
    height: 650px;
  }

  &.mt-data-table__layout-full {
    height: 100%;
    width: 100%;
    max-width: none;
  }

  // normalize the table styles across browsers
  table {
    border-collapse: collapse;
    width: 100%;
  }

  .mt-card__toolbar {
    flex-direction: column;
    gap: 0;

    &:has(.mt-data-table__toolbar:empty) {
      padding: 0;
    }
  }

  .mt-data-table__search {
    flex: 1;
  }

  .mt-card__content {
    height: auto;
    padding: 0;
    overflow: hidden;
  }

  .mt-search {
    .mt-field__label {
      display: none;
    }

    .mt-field__hint:empty {
      display: none;
    }
  }

  // add new Inter font to data table
  * {
    font-family: var(--font-family-body);
  }

  @supports (font-variation-settings: normal) {
    * {
      font-family: $font-family-variables;
      font-feature-settings: $font-family-default-feature-settings;
    }
  }

  // adjust font styling
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-regular);
  color: $color-darkgray-300;
  line-height: var(--font-line-height-xs);

  .mt-data-table__toolbar {
    width: 100%;
    display: flex;
    align-items: center;
    gap: var(--scale-size-8);

    &:empty {
      display: none;
    }
  }

  // TODO: improve the name of this css selector
  .mt-data-table__filter {
    color: var(--color-text-primary-default);
    padding-top: var(--scale-size-16);
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: var(--scale-size-12);
  }

  .mt-data-table__filter-list {
    display: flex;
    align-items: baseline;
    flex-wrap: wrap;
    gap: var(--scale-size-6);
  }

  &__caption {
    // Hide the caption visually but show it for screen readers
    position: absolute !important;
    height: 1px;
    width: 1px;
    overflow: hidden;
    clip: rect(1px, 1px, 1px, 1px);
  }

  .mt-data-table__table-wrapper {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: auto;
  }

  // add scroll shadows
  --scrollbar-height: 0px;
  --scrollbar-width: 0px;
  --fixed-left-column-width: 0px;
  --fixed-right-column-width: 0px;

  .mt-data-table__scroll-shadow {
    pointer-events: none;
    position: absolute;
    opacity: 0;
    transition: 0.1s ease opacity;
    z-index: 100;
  }

  .mt-data-table__scroll-shadow-top {
    background: linear-gradient($scrollShadowColor, transparent);
    top: calc($tableHeaderSize - 0.5px);
    width: calc(100% - var(--scrollbar-width));
    left: var(--fixed-left-column-width);
    left: 0;
    height: $scrollShadowSize;
  }

  .mt-data-table__scroll-shadow-right {
    background: linear-gradient(-90deg, $scrollShadowColor, transparent);
    top: calc($tableHeaderSize - 0.5px);
    right: calc(var(--scrollbar-width) + var(--fixed-right-column-width));
    height: $scrollShadowHeight;
    width: $scrollShadowSize;
  }

  .mt-data-table__scroll-shadow-bottom {
    background: linear-gradient(0deg, $scrollShadowColor, transparent);
    bottom: var(--scrollbar-height);
    width: calc(100% - var(--scrollbar-width));
    height: $scrollShadowSize;
  }

  .mt-data-table__scroll-shadow-left {
    background: linear-gradient(90deg, $scrollShadowColor, transparent);
    top: calc($tableHeaderSize - 0.5px);
    left: var(--fixed-left-column-width);
    height: $scrollShadowHeight;
    width: $scrollShadowSize;
  }

  &__first-column-fixed {
    .mt-data-table__scroll-shadow-left {
      top: 0.5px;
      height: calc($scrollShadowHeight + $tableHeaderSize);
    }
  }

  &__last-column-fixed {
    .mt-data-table__scroll-shadow-right {
      top: 0.5px;
      height: calc($scrollShadowHeight + $tableHeaderSize);
    }
  }

  .mt-data-table__table-wrapper[data-scroll-top] ~ .mt-data-table__scroll-shadow-top {
    opacity: 1;
  }
  .mt-data-table__table-wrapper[data-scroll-right] ~ .mt-data-table__scroll-shadow-right {
    opacity: 1;
  }
  .mt-data-table__table-wrapper[data-scroll-bottom] ~ .mt-data-table__scroll-shadow-bottom {
    opacity: 1;
  }
  .mt-data-table__table-wrapper[data-scroll-left] ~ .mt-data-table__scroll-shadow-left {
    opacity: 1;
  }

  // custom table styling
  th,
  td {
    padding: var(--scale-size-4);
    text-align: left;
    border: 1px solid #ccc;
  }

  table {
    margin: -0.5px;
    width: calc(100% + 0.5px);
    border-collapse: separate;
    border-spacing: 0;
    table-layout: auto;
    transition: 0.3s all ease;
  }

  table.--no-transition {
    transition: none;
  }

  &.mt-data-table__outlines td,
  &.mt-data-table__outlines th {
    border-right-color: var(--color-border-primary-default);
    border-left-color: var(--color-border-primary-default);
  }

  td,
  th {
    position: relative;
    padding: $tableCellPadding;
    // border needs to be half the size because they are getting combined with other cells
    border: 0.5px solid var(--color-border-primary-default);
    border-right-color: transparent;
    border-left-color: transparent;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    vertical-align: top;

    &.--highlighted {
      border-right: 1px solid var(--color-border-brand-selected);
      padding-right: calc($tableCellPaddingRight - 0.5px);
    }
  }

  th {
    // needed for resizable container outside of table header cell
    overflow: visible;
  }

  &__column-outline-framing-active th.--hovered,
  &__column-outline-framing-active td.--hovered {
    border-right-color: var(--color-border-brand-selected);
    border-left-color: var(--color-border-brand-selected);
  }

  &__column-outline-framing-active tr.--hovered td {
    border-top-color: var(--color-border-brand-selected);
    border-bottom-color: var(--color-border-brand-selected);
  }

  &.mt-data-table__stripes tr:nth-child(even) {
    background-color: var(--color-elevation-surface-sunken);
  }

  // remove duplicated border from header
  tr:first-child td {
    border-top-color: transparent;
  }

  thead tr {
    background-color: var(--color-elevation-surface-sunken);
  }

  thead th {
    font-weight: var(--font-weight-medium);
    line-height: var(--font-line-height-2xs);
    background-color: var(--color-elevation-surface-sunken);
    color: var(--color-text-secondary-default);
    min-width: 50px;
    height: $tableHeaderSize;
    // header is sticky so it needs to have the full border
    border-bottom-width: 1px;
    border-top: 0;
    position: sticky;
    top: -0.5px;
    text-transform: uppercase;
    cursor: default;
    z-index: 10;
  }

  // custom skeleton styling
  tbody td .mt-skeleton-bar {
    height: var(--scale-size-24);
  }

  // override default cursor when user is resizing the columns
  table.--resizing thead th {
    cursor: col-resize;
  }

  tr {
    background-color: var(--color-elevation-surface-raised);
  }

  /**
  * Empty state
  */
  &__empty-state {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  /**
  * Row selection
  */
  .mt-data-table__table-select-row,
  .mt-data-table__table-selection-head {
    min-width: 67px;
    max-width: 67px;
    width: 67px;
    padding-right: var(--scale-size-8);
    border-right: 0px;
    border-left-width: 0px;
  }

  .mt-data-table__table-row-number {
    min-width: 50px;
    width: 50px;
    text-align: center;
    border-left: 0px;

    + .mt-data-table__table-select-row {
      border-left-width: 1px;
    }
  }

  .mt-data-table__table-row-number-head {
    text-align: center;
    border-left: 0px;

    + .mt-data-table__table-selection-head {
      border-left-width: 1px;
    }
  }

  th[data-sticky-column],
  td[data-sticky-column] {
    position: sticky;
    // left value will be calculated dynamically in JS
    left: 0;
    z-index: 100;
    background-color: inherit;
  }

  th[data-sticky-column] {
    z-index: 110;
  }

  .mt-data-table__table-row-number,
  .mt-data-table__table-select-row {
    z-index: 1;
    background-color: inherit;
  }

  .mt-data-table__table-selection-head {
    z-index: 20;
  }

  .mt-data-table__table-select-row + td,
  .mt-data-table__table-selection-head + th {
    border-left: 0px;
    padding-left: var(--scale-size-8);
  }

  .mt-data-table__table-select-row,
  .mt-data-table__table-selection-head {
    .mt-field--checkbox {
      margin-bottom: 0;

      .mt-field--checkbox__content {
        display: flex;
        justify-content: center;
        margin-top: var(--scale-size-2);
      }

      .mt-field {
        display: none;
      }
    }
  }

  .mt-data-table__table-selection-bulk-edit {
    background-color: var(--color-elevation-surface-sunken);
    position: absolute;
    top: -0.5px;
    left: -0.5px;
    width: calc(100% - var(--scrollbar-width) - 105px);
    height: $tableHeaderSize;
    display: flex;
    align-items: center;
    padding: $tableCellPadding;
    border: 1px solid var(--color-border-primary-default);
    border-top: none;
    border-right: none;
    z-index: 120;
  }

  /***
  * Resizable
  */
  &__table-head-resizable {
    z-index: 10;
    cursor: col-resize;
    height: 100%;
    width: var(--scale-size-6);
    position: absolute;
    top: 0px;
  }

  &__table-head-resizable-before {
    left: -1px;
  }

  &__table-head-resizable-after {
    right: -1px;
  }

  /***
  * Add column indicator
  */
  .mt-data-table__table-head-add-column-indicator {
    position: absolute;
    top: 0;
    right: 0;
    transform: translate3d(50%, -150%, 0);
    width: var(--scale-size-14);
    height: var(--scale-size-16);
  }

  table.is--dragging-inside .mt-data-table__table-head-add-column-indicator {
    display: none;
  }

  /**
  * Column ordering
  */
  div[class^="mt-data-table__table-head-dropzone-"] {
    position: absolute;
    top: 0;
    height: 100%;
    width: 50%;
    opacity: 0;
    transition: 0.3s all ease;

    &.is--valid-drop {
      opacity: 1;
    }
  }

  $dropzone-highlight-width: 8px;
  $dropzone-highlight-negative-width: -8px;

  .mt-data-table__table-head-dropzone-before {
    left: 0;
    box-shadow: inset $dropzone-highlight-width 0px $dropzone-highlight-width
      $dropzone-highlight-negative-width $color-shopware-brand-900;
  }
  .mt-data-table__table-head-dropzone-after {
    right: 0;
    box-shadow: inset $dropzone-highlight-negative-width 0px $dropzone-highlight-width
      $dropzone-highlight-negative-width $color-shopware-brand-900;
  }

  /**
  * Column Settings
  */
  .mt-data-table__table-head-column-settings {
    position: absolute;
    top: var(--scale-size-16);
    left: 0;
    width: 100%;
    height: calc(100% - 16px);

    .mt-floating-ui__trigger,
    .mt-data-table__table-head-column-settings-trigger {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      cursor: pointer;
    }
  }

  table.is--dragging-inside {
    .mt-data-table__table-head-column-settings {
      display: none;
      pointer-events: none;
    }
  }

  /**
  * Table Settings
  */
  $settingsColumnWidth: 65px;

  .mt-data-table__table-settings-button {
    position: sticky;
    right: 0;
    padding: 0;
    text-align: center;
    vertical-align: middle;
    width: $settingsColumnWidth;

    #meteor-icon-kit__solid-cog-s {
      width: var(--scale-size-10);
      height: var(--scale-size-10);
    }
  }

  .mt-data-table__table-context-button {
    width: 105px;
    min-width: 105px;
    text-align: center;
    position: sticky;
    right: 0;
    background-color: inherit;

    a {
      position: relative;
      top: 1px;
      color: $color-shopware-brand-vivacious-500;
      text-decoration: none;
      font-weight: var(--font-weight-semibold);
      font-size: var(--font-size-xs);
      line-height: var(--font-line-height-xs);
      font-family: var(--font-family-body);
      margin-right: var(--scale-size-8);

      &:hover {
        text-decoration: underline;
      }
    }
  }

  /**
  * Footer styling
  */
  &__footer-left {
    display: flex;
    flex-wrap: nowrap;
    align-items: center;

    .mt-field__label {
      display: none;
    }

    .mt-select {
      margin-bottom: 0;
      width: 100px;
    }
  }

  &__footer-inset {
    display: flex;
    width: calc(100% + var(--mt-card-footer-padding) * 2);
    padding: var(--scale-size-16) var(--mt-card-footer-padding);
  }

  &__footer-right {
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
    gap: var(--scale-size-16);
    margin-left: auto;

    .mt-button[aria-label="reload-data"] {
      height: 34px;
      width: 34px;
    }

    .mt-button #meteor-icon-kit__solid-undo-s {
      width: var(--scale-size-12);
      height: var(--scale-size-12);
    }
  }

  &__pagination-info-text {
    white-space: nowrap;
    font-size: var(--font-size-2xs);
    line-height: var(--font-line-height-2xs);
    font-family: var(--font-family-body);
    margin-left: var(--scale-size-12);
  }
}

/**
* Non-scoped styling for elements inside and outside of the table (Drag & Drop, ...)
*/
.mt-data-table__table-head-inner-wrapper {
  display: flex;
  align-items: center;
  gap: var(--scale-size-8);
}

/**
* Sorting in columns
*/
.mt-data-table__table-head-sorting-icons {
  display: flex;
  flex-direction: column;

  .mt-data-table__table-head-sort {
    transition: 0.3s color ease;
    color: var(--color-icon-secondary-default);

    #meteor-icon-kit__solid-long-arrow-up,
    #meteor-icon-kit__solid-long-arrow-down {
      height: var(--scale-size-12);
    }
  }
}

/**
* Drag & Drop styling
*/
.mt-data-table__table-wrapper-table-head.is--drag-element {
  max-width: none !important;
  box-shadow: 0px 0px 4px 0px $scrollShadowColor;
  opacity: 0.8;

  // set the normal table header cell styling
  font-family: var(--font-family-body);
  @supports (font-variation-settings: normal) {
    font-family: $font-family-variables;
    font-feature-settings: $font-family-default-feature-settings;
  }
  text-align: left;
  font-size: var(--font-size-xs);
  padding: $tableCellPadding;
  border: 1px solid var(--color-border-brand-selected);
  border-radius: var(--border-radius-xs) var(--border-radius-xs) 0 0;
  border-top: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  vertical-align: top;
  font-weight: var(--font-weight-medium);
  line-height: var(--font-line-height-xs);
  background-color: var(--color-elevation-surface-sunken);
  color: var(--color-text-primary-default);
  min-width: 50px;
  text-transform: uppercase;

  transition: 0.3s rotate ease-in-out;
}

thead th.is--dragging {
  cursor: grabbing;
}

.mt-data-table__table-head-dragzone {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: var(--scale-size-16);
  z-index: 1;
  cursor: grab;

  .mt-data-table__table-head-dragzone-bar {
    pointer-events: none;
    transform: scale(1, 0);
  }

  /* simHover (simulate hover) is needed for interaction testing
  /* because the testing library has no support for css hover
  */
  &.simHover .mt-data-table__table-head-dragzone-bar,
  &:hover .mt-data-table__table-head-dragzone-bar {
    transform: scale(1, 1);
  }
}

.mt-data-table__table-wrapper-table-head.is--drag-element {
  .mt-data-table__table-head-dragzone-bar {
    transform: scale(1, 1);
  }

  .mt-data-table__table-head-column-settings {
    display: none;
    pointer-events: none;
  }
}

table.is--dragging-inside {
  -webkit-user-select: none; /* Safari */
  user-select: none;

  .mt-data-table__table-head-dragzone {
    display: none;
  }
}

.mt-data-table__table-head-dragzone-bar {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: var(--scale-size-8);
  background-color: $color-shopware-brand-900;
  border-radius: var(--border-radius-xs) var(--border-radius-xs) 0 0;
  transition: transform 0.2s ease;
  transform-origin: top center;
}

.mt-data-table__table-head-dragzone-indicator {
  position: absolute;
  width: var(--scale-size-28);
  height: var(--scale-size-16);
  left: calc(50% - 14px);
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: $color-shopware-brand-900;
  border-radius: 0 0 var(--border-radius-xs) var(--border-radius-xs);

  #meteor-icon-kit__regular-grip-horizontal-s {
    color: $color-white;
    width: 9px;
  }
}

.mt-floating-ui__content {
  &.mt-data-table__table-head-add-column-indicator {
    cursor: pointer;
    z-index: 10;

    .mt-icon {
      display: block;
      color: var(--color-elevation-surface-floating);
      background: var(--color-icon-inverse-default);
      border-radius: 999px;

      #meteor-icon-kit__solid-plus-square-s {
        width: var(--scale-size-14);
        height: var(--scale-size-14);
      }
    }
  }
}

.mt-data-table__add-filter-button {
  color: var(--color-icon-primary-default);
  height: 34px;
  width: 34px;

  // remove min-width later when we found a better solution
  min-width: 34px;
  cursor: pointer;
  outline: 0;
  border-radius: var(--border-radius-xs);

  &:hover,
  &:focus-visible {
    background-color: var(--color-background-primary-disabled);
    color: var(--color-icon-primary-hover);
  }
}
</style>
