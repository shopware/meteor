<template>
  <mt-popover
    class="mt-data-table-settings"
    :title="t('title')"
    :child-views="tableSettingsChildViews"
    width="large"
  >
    <template #trigger="{ toggleFloatingUi }">
      <mt-button
        v-tooltip="{
          message: t('tooltip'),
          width: 'auto',
        }"
        variant="secondary"
        square
        :aria-label="t('aria-toggle-table-settings')"
        @click="toggleFloatingUi"
      >
        <mt-icon name="solid-cog-s" />
      </mt-button>
    </template>

    <template #popover-items__base="{ changeView }">
      <mt-popover-item
        :label="t('columnOrder.title')"
        border-bottom
        show-options
        :on-label-click="() => changeView('columnOrder')"
        :options-count="columns.length"
        @click-options="() => changeView('columnOrder')"
      />

      <mt-popover-item
        :label="t('showNumberedColumn')"
        show-switch
        :switch-value="enableRowNumbering"
        icon="solid-hashtag"
        @change-switch="($event) => $emit('change-enable-row-numbering', $event)"
      />

      <mt-popover-item
        :label="t('showStripedRows')"
        show-switch
        :switch-value="showStripes"
        icon="solid-bars"
        @change-switch="($event) => $emit('change-show-stripes', $event)"
      />

      <!-- TODO: the icon in figma solid-grip-lines was rotated and is not available -->
      <mt-popover-item
        :label="t('showOutlines')"
        show-switch
        :switch-value="showOutlines"
        icon="solid-table"
        @change-switch="($event) => $emit('change-show-outlines', $event)"
      />

      <mt-popover-item
        :label="t('frameOutlines')"
        :meta-copy="t('frameOutlinesMetaCopy')"
        show-switch
        :switch-value="enableOutlineFraming"
        icon="solid-highlight"
        @change-switch="($event) => $emit('change-outline-framing', $event)"
      />

      <!--
        More popover items will be added in the future.
        Some examples can be found in the mt-popover story.
      -->

      <mt-popover-item
        :label="t('resetAllChanges')"
        border-top
        icon="solid-undo"
        :on-label-click="resetAllChanges"
      />
    </template>

    <template #popover-items__columnOrder>
      <mt-popover-item-result
        :groups="columnGroups"
        :options="columnOrderOptions"
        draggable
        hide-search
        hidable
        @change-visibility="onColumnChangeVisibility"
        @click-group-action="onColumnClickGroupAction"
        @change-order="onColumnChangeOrder"
      />
    </template>
  </mt-popover>
</template>

<script lang="ts">
import type { PropType } from "vue";
import { defineComponent, computed } from "vue";
import MtButton from "../../../../form/mt-button/mt-button.vue";
import MtIcon from "../../../../icons-media/mt-icon/mt-icon.vue";
import MtPopover from "../../../../overlay/mt-popover/mt-popover.vue";
import MtPopoverItem from "../../../../overlay/mt-popover-item/mt-popover-item.vue";
import MtPopoverItemResult from "../../../../overlay/mt-popover-item-result/mt-popover-item-result.vue";
import MtTooltipDirective from "../../../../../directives/tooltip.directive";
import type { ColumnDefinition } from "../../mt-data-table.vue";
import type { Option as ItemResultOption } from "../../../../overlay/mt-popover-item-result/mt-popover-item-result.vue";
import { useI18n } from "vue-i18n";

export default defineComponent({
  name: "MtDataTableSettings",
  components: {
    "mt-button": MtButton,
    "mt-icon": MtIcon,
    "mt-popover": MtPopover,
    "mt-popover-item": MtPopoverItem,
    "mt-popover-item-result": MtPopoverItemResult,
  },
  directives: {
    tooltip: MtTooltipDirective,
  },
  props: {
    columns: {
      type: Array as PropType<ColumnDefinition[]>,
      required: true,
    },
    showOutlines: {
      type: Boolean,
      required: false,
      default: false,
    },
    showStripes: {
      type: Boolean,
      required: false,
      default: false,
    },
    enableOutlineFraming: {
      type: Boolean,
      required: false,
      default: false,
    },
    enableRowNumbering: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  emits: [
    "reset-all-changes",
    "change-column-order",
    "change-column-visibility",
    "change-show-outlines",
    "change-show-stripes",
    "change-outline-framing",
    "change-enable-row-numbering",
  ],
  setup(props, { emit }) {
    const { t } = useI18n({
      messages: {
        en: {
          title: "Settings",
          resetAllChanges: "Reset all changes",
          columnOrder: {
            title: "Columns",
            columnGroups: {
              labelShown: "Shown in table",
              actionLabelShown: "Hide all",
              labelHidden: "Hidden in table",
              actionLabelHidden: "Show all",
            },
          },
          showNumberedColumn: "Show numbered column",
          showStripedRows: "Show striped rows",
          showOutlines: "Show outlines",
          frameOutlines: "Frame outlines",
          frameOutlinesMetaCopy: "Highlight column and row outlines on mouse hover",
          tooltip: "View settings",
          "aria-toggle-table-settings": "Toggle view settings",
        },
        de: {
          title: "Einstellungen",
          resetAllChanges: "Alle Änderungen zurücksetzen",
          columnOrder: {
            title: "Spalten",
            columnGroups: {
              labelShown: "In Tabelle sichtbar",
              actionLabelShown: "Alle ausblenden",
              labelHidden: "In Tabelle ausgeblendet",
              actionLabelHidden: "Alle einblenden",
            },
          },
          showNumberedColumn: "Zeige nummerierte Spalte an",
          showStripedRows: "Zeige gestreifte Zeilen an",
          showOutlines: "Zeige Umrisse an",
          frameOutlines: "Hebe Umrisse vor",
          frameOutlinesMetaCopy:
            "Hervorhebung von Spalten- und Zeilenumrissen bei Mausüberlagerung",
          tooltip: "Tabelleneinstellungen",
          "aria-toggle-table-settings": "Tabelleneinstellungen umschalten",
        },
      },
    });

    /***
     * Table settings
     */
    const tableSettingsChildViews = computed(() => {
      return [
        {
          name: "columnOrder",
          title: t("columnOrder.title"),
        },
      ];
    });

    /**
     * Column order view
     */
    const columnGroups = computed(() => {
      return [
        {
          id: "visible",
          label: t("columnOrder.columnGroups.labelShown"),
          actionLabel: t("columnOrder.columnGroups.actionLabelShown"),
        },
        {
          id: "hidden",
          label: t("columnOrder.columnGroups.labelHidden"),
          actionLabel: t("columnOrder.columnGroups.actionLabelHidden"),
        },
      ];
    });

    const columnOrderOptions = computed<ItemResultOption[]>(() => {
      return props.columns.map((column) => {
        return {
          id: column.property,
          label: column.label,
          parentGroup: column.visible ?? true ? "visible" : "hidden",
          position: column.position,
          isVisible: column.visible ?? true,
          isHidable: isPrimaryColumn(column) ? false : true,
          isSortable: isPrimaryColumn(column) ? false : true,
        };
      });
    });

    const onColumnChangeVisibility = (columnProperty: string, visibility: boolean) => {
      emit("change-column-visibility", columnProperty, visibility);
    };

    const onColumnClickGroupAction = (groupId: string) => {
      props.columns.forEach((column) => {
        if (isPrimaryColumn(column)) {
          return;
        }

        onColumnChangeVisibility(column.property, groupId === "visible" ? false : true);
      });
    };

    const onColumnChangeOrder = ({
      itemId,
      dropZone,
      dropId,
    }: {
      itemId?: string;
      dropZone: "before" | "after";
      dropId?: string;
    }) => {
      const targetColumn = props.columns.find((column) => column.property === dropId);

      if (!itemId) {
        return;
      }

      onColumnChangeVisibility(itemId, targetColumn?.visible ?? true);
      emit("change-column-order", { itemId, dropZone, dropId });
    };

    /**
     * Base view
     */

    const resetAllChanges = () => {
      emit("reset-all-changes");
    };

    const isPrimaryColumn = (column: ColumnDefinition) => {
      return props.columns[0].property === column.property;
    };

    return {
      tableSettingsChildViews,
      resetAllChanges,
      columnGroups,
      columnOrderOptions,
      onColumnChangeVisibility,
      onColumnClickGroupAction,
      onColumnChangeOrder,
      isPrimaryColumn,
      t,
    };
  },
});
</script>
