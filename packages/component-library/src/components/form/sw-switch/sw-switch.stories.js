import SwSwitch from './sw-switch.vue';

const meta = {
  title: 'Components/Form/sw-switch',
  component: SwSwitch,
  render: (args, { argTypes }) => ({
    props: Object.keys(argTypes),
    components: { SwSwitch },
    template: '<sw-switch v-bind="$props" @change="change" @inheritance-remove="inheritanceRemove"></sw-switch>',
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
    label: 'Switchfield',
  },
};

export default meta;



export const defaultStory = {
  name: 'sw-switch',
};
