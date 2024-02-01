import SwIcon from './sw-icon.vue';

const meta = {
  title: 'Components/Icons & Media/sw-icon',
  component: SwIcon,
  render: (args, { argTypes }) => ({
    props: Object.keys(argTypes),
    components: { SwIcon },
    template: '<sw-icon v-bind="$props"></sw-icon>',
  }),
  argTypes: {
    name: {
      control: {
        type: 'text',
      },
    },
    color: {
      control: {
        type: 'color',
      },
    },
    decorative: {
      control: {
        type: 'boolean',
      },
    },
  },
  args: {
    name: 'regular-products',
    color: '#3498db',
    multicolor: false,
    decorative: false,
  },
};

export default meta;



export const Default = {
  name: 'sw-icon',
};
