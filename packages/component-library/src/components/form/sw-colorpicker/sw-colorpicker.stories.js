import SwColorpicker from './sw-colorpicker.vue';

const meta = {
  title: 'Components/Form/sw-colorpicker',
  component: SwColorpicker,
  render: (args, { argTypes }) => ({
    props: Object.keys(argTypes),
    components: { SwColorpicker },
    template: '<sw-colorpicker v-bind="$props"></sw-colorpicker>',
  }),
  args: {
    label: 'Colorpicker example',
    value: '#0fcff5',
    colorOutput: 'auto',
    disabled: false,
    readonly: false,
    alpha: true,
    colorLabels: true,
    zIndex: null,
    helpText: '',
    required: false,
    isInherited: false,
    isInheritanceField: false,
    disableInheritanceToggle: false,
  },
};

export default meta;

export const defaultStory = {
  name: 'sw-colorpicker',
};
