<template>
  <sw-popover
    class="sw-data-table-settings"
    :title="$t('sw-data-table-settings.title')"
    :child-views="tableSettingsChildViews"
    width="large"
  >
    <template #trigger="{ toggleFloatingUi }">
      <sw-button
        v-tooltip="{
          message: $t('sw-data-table-settings.tooltip'),
          width: 'auto',
        }"
        variant="secondary"
        square
        :aria-label="$t('sw-data-table-settings.aria-toggle-table-settings')"
        @click="toggleFloatingUi"
      >
        <sw-icon name="solid-cog-s" />
      </sw-button>
    </template>

    <template #popover-items__base="{ changeView }">
      <sw-popover-item 
        :label="$t('sw-data-table-settings.columnOrder.title')"
        border-bottom
        show-options
        :on-label-click="() => changeView('columnOrder')"
        :options-count="columns.length"
        @click-options="() => changeView('columnOrder')"
      />

      <sw-popover-item
        :label="$t('sw-data-table-settings.showNumberedColumn')"
        show-switch
        :switch-value="enableRowNumbering"
        icon="solid-hashtag"
        @change-switch="($event) => $emit('change-enable-row-numbering', $event)"
      />

      <sw-popover-item
        :label="$t('sw-data-table-settings.showStripedRows')"
        show-switch
        :switch-value="showStripes"
        icon="solid-bars"
        @change-switch="($event) => $emit('change-show-stripes', $event)"
      />

      <!-- TODO: the icon in figma solid-grip-lines was rotated and is not available -->
      <sw-popover-item
        :label="$t('sw-data-table-settings.showOutlines')"
        show-switch
        :switch-value="showOutlines"
        icon="solid-table"
        @change-switch="($event) => $emit('change-show-outlines', $event)"
      />

      <sw-popover-item
        :label="$t('sw-data-table-settings.frameOutlines')"
        :meta-copy="$t('sw-data-table-settings.frameOutlinesMetaCopy')"
        show-switch
        :switch-value="enableOutlineFraming"
        icon="solid-highlight"
        @change-switch="($event) => $emit('change-outline-framing', $event)"
      />

      <!-- 
        More popover items will be added in the future. 
        Some examples can be found in the sw-popover story.
      -->

      <sw-popover-item
        :label="$t('sw-data-table-settings.resetAllChanges')"
        border-top
        icon="solid-undo"
        :on-label-click="resetAllChanges"
      />
    </template>

    <template #popover-items__columnOrder>
      <sw-popover-item-result
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
  </sw-popover>
</template>

<script lang="ts">
import type { PropType } from "vue";
import { getCurrentInstance, defineComponent, computed } from "vue";
import SwButton from "../../../../form/sw-button/sw-button.vue";
import SwIcon from "../../../../icons-media/sw-icon/sw-icon.vue";
import SwPopover from '../../../../overlay/sw-popover/sw-popover.vue';
import SwPopoverItem from '../../../../overlay/sw-popover-item/sw-popover-item.vue';
import SwPopoverItemResult from '../../../../overlay/sw-popover-item-result/sw-popover-item-result.vue';
import SwTooltipDirective from '../../../../../directives/tooltip.directive';
import type { ColumnDefinition } from '../../sw-data-table.vue';
import type { Option as ItemResultOption } from '../../../../overlay/sw-popover-item-result/sw-popover-item-result.vue';

export default defineComponent({
  name: 'SwDataTableSettings',
  components: {
    "sw-button": SwButton,
    "sw-icon": SwIcon,
    'sw-popover': SwPopover,
    'sw-popover-item': SwPopoverItem,
    'sw-popover-item-result': SwPopoverItemResult,
  },
  directives: {
    'tooltip': SwTooltipDirective,
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
    'reset-all-changes',
    'change-column-order',
    'change-column-visibility',
    'change-show-outlines',
    'change-show-stripes',
    'change-outline-framing',
    'change-enable-row-numbering'
  ],
  i18n: {
    messages: {
      en: {
        "sw-data-table-settings": {
          title: "Settings",
          resetAllChanges: "Reset all changes",
          columnOrder: {
            title: 'Columns',
            columnGroups: {
              labelShown: 'Shown in table',
              actionLabelShown: 'Hide all',
              labelHidden: 'Hidden in table',
              actionLabelHidden: 'Show all',
            }
          },
          showNumberedColumn: 'Show numbered column',
          showStripedRows: 'Show striped rows',
          showOutlines: 'Show outlines',
          frameOutlines: 'Frame outlines',
          frameOutlinesMetaCopy: 'Highlight column and row outlines on mouse hover',
          tooltip: "View settings",
          'aria-toggle-table-settings': 'Toggle view settings',
        },
      },
      de: {
        "sw-data-table-settings": {
          title: "Einstellungen",
          resetAllChanges: "Alle Änderungen zurücksetzen",
          columnOrder: {
            title: 'Spalten',
            columnGroups: {
              labelShown: 'In Tabelle sichtbar',
              actionLabelShown: 'Alle ausblenden',
              labelHidden: 'In Tabelle ausgeblendet',
              actionLabelHidden: 'Alle einblenden',
            }
          },
          showNumberedColumn: 'Zeige nummerierte Spalte an',
          showStripedRows: 'Zeige gestreifte Zeilen an',
          showOutlines: 'Zeige Umrisse an',
          frameOutlines: 'Hebe Umrisse vor',
          frameOutlinesMetaCopy: 'Hervorhebung von Spalten- und Zeilenumrissen bei Mausüberlagerung',
          tooltip: "Tabelleneinstellungen",
          'aria-toggle-table-settings': 'Tabelleneinstellungen umschalten',
        },
      },
    },
  },
  setup(props, { emit }) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion, @typescript-eslint/no-non-null-asserted-optional-chain
    const $t = getCurrentInstance()?.proxy.$t.bind(getCurrentInstance()?.proxy)!;

    /***
     * Table settings
     */
    const tableSettingsChildViews = computed(() => {
      return [
        {
          name: 'columnOrder',
          title: $t('sw-data-table-settings.columnOrder.title'),
        },
      ]
    });

    /**
    * Column order view 
    */
    const columnGroups = computed(() => {
      return [
        {
          id: 'visible',
          label: $t('sw-data-table-settings.columnOrder.columnGroups.labelShown') as string,
          actionLabel: $t('sw-data-table-settings.columnOrder.columnGroups.actionLabelShown') as string,
        },
        {
          id: 'hidden',
          label: $t('sw-data-table-settings.columnOrder.columnGroups.labelHidden') as string,
          actionLabel: $t('sw-data-table-settings.columnOrder.columnGroups.actionLabelHidden') as string,
        }
      ]
    })

    const columnOrderOptions = computed<ItemResultOption[]>(() => {
      return props.columns.map((column) => {
        return {
          id: column.property,
          label: column.label,
          parentGroup: (column.visible ?? true) ? 'visible' : 'hidden',
          position: column.position,
          isVisible: column.visible ?? true,
          isHidable: isPrimaryColumn(column) ? false : true,
          isSortable: isPrimaryColumn(column) ? false : true,
        }
      });
    })

    const onColumnChangeVisibility = (columnProperty: string, visibility: boolean) => {
      emit('change-column-visibility', columnProperty, visibility);
    }

    const onColumnClickGroupAction = (groupId: string) => {
      props.columns.forEach((column) => {
        if (isPrimaryColumn(column)) {
          return;
        }

        onColumnChangeVisibility(column.property, groupId === 'visible' ? false : true);
      })
    }

    const onColumnChangeOrder = ({ itemId, dropZone, dropId }: {
      itemId?: string,
      dropZone: 'before' | 'after',
      dropId?: string,
    }) => {
      const targetColumn = props.columns.find((column) => column.property === dropId);

      if (!itemId) {
        return;
      }

      onColumnChangeVisibility(itemId, (targetColumn?.visible ?? true));
      emit('change-column-order', { itemId, dropZone, dropId });
    };

    /**
    * Base view
    */

    const resetAllChanges = () => {
      emit('reset-all-changes')
    }

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
    };
  },
});
</script>

<style lang="scss">
@import "../../../../assets/scss/variables.scss";

.sw-data-table-settings {

}
</style>
