import SwCheckbox from './sw-checkbox.vue';

const meta = {
  title: 'Components/Form/sw-checkbox',
  component: SwCheckbox,
  render: (args, { argTypes }) => ({
    props: Object.keys(argTypes),
    components: { SwCheckbox },
    template: '<sw-checkbox v-bind="$props" @change="change" @inheritance-remove="inheritanceRemove"></sw-checkbox>',
  }),
  argTypes: {
    change: {
      action: 'change',
      table: {
        category: 'Events'
      }
    },
    'inheritance-restore': {
      action: 'inheritance-restore',
      table: {
        category: 'Events'
      }
    },
    'inheritanceRemove': {
      action: 'inheritance-remove',
      table: {
        category: 'Events'
      }
    },
    label: {
      control: { type: 'text' },
    },
  },
  args: {
    label: 'Checkbox',
    disabled: false,
    bordered: false,
  },
};

export default meta;

export const defaultStory = {
  name: 'sw-checkbox',
};
