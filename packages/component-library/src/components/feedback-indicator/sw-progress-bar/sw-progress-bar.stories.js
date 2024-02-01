import SwProgressBar from './sw-progress-bar.vue';

export default {
  title: 'Components/Feedback Indicator/sw-progress-bar',
  component: SwProgressBar,
  render: (args, { argTypes }) => ({
    props: Object.keys(argTypes),
    components: { SwProgressBar },
    template: '<sw-progress-bar v-bind="$props"></sw-progress-bar>',
  }),
  args: {
    value: 121,
    maxValue: 356,
    label: 'Example progress bar',
    error: null,
    progressLabelType: '',
  },
};

export const Default = {
  name: 'Minimal',
};

export const Extended = {
  name: 'Extended',
  args: {
    value: 277,
    error: {
      code: 500,
      detail: 'Error while loading'
    },
    progressLabelType: 'kb'
  }
}
