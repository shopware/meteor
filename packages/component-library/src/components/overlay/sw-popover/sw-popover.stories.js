import SwPopover from './sw-popover.vue';
import SwPopoverItem from '../sw-popover-item/sw-popover-item.vue';
import SwPopoverItemResult from '../sw-popover-item-result/sw-popover-item-result.vue';
import SwFloatingUi from '../../_internal/sw-floating-ui/sw-floating-ui.vue';
import SwButton from '../../form/sw-button/sw-button.vue';

const meta = {
  title: 'Components/Overlay/sw-popover',
  component: SwPopover,
  argTypes: {
    'go-back': {
      action: 'go-back',
      table: {
        disable: true,
      },
    },
    goBack: {
      action: 'go-back',
      table: {
        category: 'Events',
      },
    },
    'click-options': {
      table: {
        disable: true,
      },
    },
    clickOptions: {
      action: 'click-options',
      table: {
        category: 'Events',
      },
    },
  },
  args: {
    title: 'Popover example',
    disableFloat: false,
    childViews: [
      { name: 'columnOrder', title: 'Columns' },
      {
        name: 'complex',
        title: 'Complex example',
        childViews: [
          {
            name: 'simple',
            childViews: [{ name: 'child_of_simple' }],
          },
        ],
      },
    ],
  },
  render: (args, { argTypes }) => ({
    components: {
      SwPopover,
      SwPopoverItem,
      SwPopoverItemResult,
      SwFloatingUi,
      SwButton,
    },
    props: Object.keys(argTypes),
    data() {
      return {
        itemVisible: true,
        itemSwitchValue: false,
        columnGroups: [
          {
            id: 'visible',
            label: 'Shown in table',
            actionLabel: 'Hide all',
          },
          {
            id: 'hidden',
            label: 'Hidden in table',
            actionLabel: 'Show all',
          },
        ],
        columnOrderOptions: [
          {
            id: 'name',
            label: 'Name',
            position: 0,
            isVisible: true,
            parentGroup: 'visible',
            isSortable: false,
            isHidable: false,
          },
          {
            id: 'manufacturer',
            label: 'Manufacturer',
            position: 1,
            isVisible: true,
            parentGroup: 'visible',
            isSortable: true,
            isHidable: true,
          },
          {
            id: 'active',
            label: 'Active',
            position: 2,
            isVisible: true,
            parentGroup: 'visible',
            isSortable: true,
            isHidable: true,
          },
          {
            id: 'price',
            label: 'Price',
            position: 3,
            isVisible: true,
            parentGroup: 'visible',
            isSortable: true,
            isHidable: true,
          },
          {
            id: 'stock',
            label: 'Stock',
            position: 4,
            isVisible: false,
            parentGroup: 'hidden',
            isSortable: true,
            isHidable: true,
          },
          {
            id: 'available',
            label: 'Available',
            position: 5,
            isVisible: false,
            parentGroup: 'hidden',
            isSortable: true,
            isHidable: true,
          },
        ],
        numberedColumn: false,
        showStripes: false,
        showOutlines: false,
        frameOutlines: false,
        openContentInPeekMode: false,
      };
    },
    watch: {},
    computed: {
      console() {
        return console;
      },
    },
    methods: {
      onColumnChangeVisibility(itemId) {
        const item = this.columnOrderOptions.find((i) => i.id === itemId);

        if (item) {
          item.isVisible = !item.isVisible;
        }

        item.parentGroup = item.isVisible ? 'visible' : 'hidden';
      },
      onColumnClickGroupAction(groupId) {
        this.columnOrderOptions.forEach((item) => {
          if (groupId === 'visible') {
            item.isVisible = false;
            item.parentGroup = 'hidden';
          }

          if (groupId === 'hidden') {
            item.isVisible = true;
            item.parentGroup = 'visible';
          }
        });
      },
      onColumnChangeOrder({ itemId, dropZone, dropId }) {
        const item = this.columnOrderOptions.find((i) => i.id === itemId);
        const dropItem = this.columnOrderOptions.find((i) => i.id === dropId);

        if (item && dropItem) {
          item.parentGroup = dropItem.parentGroup;
          item.isVisible = dropItem.isVisible;

          this.columnOrderOptions = [...this.columnOrderOptions]
              .sort((optionA, optionB) => {
                return optionA.position - optionB.position;
              })
              .sort((optionA, optionB) => {
                // The logic for inserting the column before or after the target column
                if (optionB.id === itemId) {
                  if (dropZone === 'after') {
                    return optionA.position <= dropItem.position ? -1 : 1;
                  } else {
                    return optionA.position < dropItem.position ? -1 : 1;
                  }
                }

                if (optionA.id === itemId) {
                  if (dropZone === 'after') {
                    return optionB.position > dropItem.position ? -1 : 1;
                  } else {
                    return optionB.position >= dropItem.position ? -1 : 1;
                  }
                }

                return 0;
              })
              .map((option, index) => {
                return { ...option, position: index * 100 };
              });
        }
      },
    },
    template: `
      <div style="max-width: 1000px; max-height: 350px; height: 350px; margin: 0 auto;">
        <sw-popover v-bind="$props">
          <template #trigger="{ toggleFloatingUi }">
            <sw-button @click.stop="toggleFloatingUi">Toggle popover</sw-button>
          </template>

          {{ $props.default}}

          <template #popover-items__base="{ changeView }">
            <sw-popover-item
                label="Columns"
                showOptions
                :onLabelClick="() => changeView('columnOrder')"
                @click-options="() => changeView('columnOrder')"
                :optionsCount="5"
            />

            <sw-popover-item
                label="Numbered column"
                icon="solid-hashtag"
                showSwitch
                border-top
                :switchValue="numberedColumn"
                @change-switch="(switchValue) => numberedColumn = switchValue"
            />

            <sw-popover-item
                label="Show stripes"
                icon="solid-bars"
                showSwitch
                :switchValue="showStripes"
                @change-switch="(switchValue) => showStripes = switchValue"
            />

            <sw-popover-item
                label="Show outlines"
                icon="solid-grip-lines"
                showSwitch
                :switchValue="showOutlines"
                @change-switch="(switchValue) => showOutlines = switchValue"
            />

            <sw-popover-item
                label="Frame outlines"
                icon="solid-highlight"
                showSwitch
                metaCopy="Highlight column outlines on mouse hover."
                border-bottom
                :switchValue="frameOutlines"
                @change-switch="(switchValue) => frameOutlines = switchValue"
            />

            <sw-popover-item
                label="Open content in peek mode"
                icon="solid-sidebar-overlay"
                showSwitch
                metaCopy="Open content on the side. Keeps the view behind interactive."
                border-bottom
                :switchValue="openContentInPeekMode"
                @change-switch="(switchValue) => openContentInPeekMode = switchValue"
            />

            <sw-popover-item
                label="Complex popover items"
                border-bottom
                showOptions
                @click-options="() => changeView('complex')"
            />

            <sw-popover-item
                type="critical"
                label="Reset all changes"
                icon="solid-undo"
                :onLabelClick="() => console.log('Clicked on reset all changes')"
            />

          </template>

          <template #popover-items__complex="{ changeView }">
            <sw-popover-item
                label="Item with all features enabled and a long label"
                showCheckbox
                icon="solid-sidebar-overlay"
                metaCopy="Features over features"
                contextualDetail="Z->A"
                shortcut="Ctrl + O"
                showVisibility
                :visible="itemVisible"
                @change-visibility="(visibility) => itemVisible = visibility"
                showSwitch
                :switchValue="itemSwitchValue"
                @change-switch="(switchValue) => itemSwitchValue = switchValue"
                showOptions
                @click-options="() => changeView('simple')"
                :optionsCount="17"
            />
          </template>

          <template #popover-items__simple>
            <sw-popover-item
                label="A simple item"
                icon="solid-sidebar-overlay"
            />
          </template>

          <template #popover-items__columnOrder>
            <sw-popover-item-result
                :groups="columnGroups"
                :options="columnOrderOptions"
                draggable
                hidable
                @change-visibility="onColumnChangeVisibility"
                @click-group-action="onColumnClickGroupAction"
                @change-order="onColumnChangeOrder"
            />
          </template>
        </sw-popover>
      </div>
    `,
  }),
};

export default meta;

export const defaultStory = {
  name: 'sw-popover',
};
