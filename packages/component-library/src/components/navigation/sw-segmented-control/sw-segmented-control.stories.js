import SwSegmentedControl from './sw-segmented-control.vue';
import SwPopoverItem from '../../overlay/sw-popover-item/sw-popover-item.vue'

const meta = {
  title: 'Components/Navigation/sw-segmented-control',
  component: SwSegmentedControl,
  render: (args, { argTypes }) => ({
    components: { SwSegmentedControl, SwPopoverItem },
    props: Object.keys(argTypes),
    template: `
      <div style="max-width: 1000px; max-height: 400px; height: 500px; margin: 0 auto;">
        <sw-segmented-control
            v-bind="$props"
        >
          {{ $props.default }}

          <template #labelF--popover-items__base="{ toggleFloatingUi, changeView }">
            <sw-popover-item
                label="Go to second level"
                :on-label-click="() => changeView('secondLevel')"
            />
          </template>

          <template #labelF--popover-items__secondLevel="{ toggleFloatingUi, changeView }">
            <sw-popover-item
                label="Go to third level"
                :on-label-click="() => changeView('thirdLevel')"
            />
          </template>

          <template #labelF--popover-items__thirdLevel="{ toggleFloatingUi, changeView }">
            <sw-popover-item
                label="Go back to first level"
                :on-label-click="() => changeView('base')"
            />
          </template>
        </sw-segmented-control>
      </div>`
  }),
  argTypes: {},
  args: {
    disableContext: true,
    actions: [
      {
        id: 'lableStart',
        label: 'X products selected',
        onClick: ({ checkboxValue }) => console.log('Checked Label E', checkboxValue),
        isPressed: true,
        hasCheckbox: true
      },
      'divider',
      {
        id: 'labelA',
        label: 'Label A',
        onClick: () => alert('Label A'),
        iconName: 'regular-tag',
        disabled: true,
      },
      'divider',
      {
        id: 'labelB',
        label: 'Label B',
        onClick: () => alert('Label B'),
        isPressed: true
      },
      {
        id: 'labelC',
        label: 'Label C',
        onClick: () => alert('Label C'),
        isPressed: false,
        isCritical: true
      },
      {
        id: 'labelD',
        label: 'Label D',
        onClick: () => alert('Label D'),
        isPressed: true,
        isCritical: true
      },
      {
        id: 'labelF',
        label: 'Label F',
        iconName: 'regular-calendar',
        options: true,
        popover: {
          title: 'First level',
          childViews: [
            {
              name: 'secondLevel',
              title: 'Second level',
              childViews: [
                {
                  name: 'thirdLevel',
                  title: 'Third level',
                }
              ]
            }
          ]
        }
      },
    ]
  }
};

export default meta;

export const defaultStory = {
  name: 'sw-segmented-control',
}
