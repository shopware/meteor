import SwDatepicker from './sw-datepicker.vue';

const meta = {
  title: 'Components/Form/sw-datepicker',
  component: SwDatepicker,
  render: (args, { argTypes }) => ({
    template: '<sw-datepicker v-bind="$props" v-model="currentValue" @input="input"></sw-datepicker>',
    props: Object.keys(argTypes),
    components: { SwDatepicker },
    data() {
      return { currentValue: '' }
    },
    watch: {
      value(v) {
        this.currentValue = v;
      }
    },
    created() {
      this.currentValue = this.value;
    },
  }),
  args: {
    label: 'Datepicker',
  },
  argTypes: {
    input: {
      action: 'input',
      table: {
        category: 'Events'
      }
    },
  },
};

export default meta;

export const defaultStory = {
  name: 'sw-datepicker',
};
