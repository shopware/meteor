import SwLoader from './sw-loader.vue';

export default {
  title: 'Components/Feedback Indicator/sw-loader',
  component: SwLoader,
  render: (args, { argTypes }) => ({
    props: Object.keys(argTypes),
    components: { SwLoader },
    template: '<sw-loader v-bind="$props"></sw-loader>',
  }),
  args: {
    size: '50px',
  },
};

export const Default = {
  name: 'sw-loader',
};