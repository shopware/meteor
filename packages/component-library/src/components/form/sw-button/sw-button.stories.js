import SwButton from './sw-button.vue';


const meta = {
  title: 'Components/Form/sw-button',
  component: SwButton,
  render: (args, { argTypes }) => ({
    components: { SwButton },
    props: Object.keys(argTypes),
    template: `<sw-button @click="click" v-bind="$props">{{ $props.default}}</sw-button>`,
  }),
  argTypes: {
    click: {
      action: 'click',
      table: {
        category: 'Events'
      }
    },
    default: {
      control: { type: 'text' },
    },
  },
  args: {
    default: 'Button',
    variant: 'primary',
    size: 'small',
    disabled: false,
    square: false,
    block: false,
    isLoading: false,
  }
};

export default meta;

export const defaultStory = {
  name: 'sw-button',
};
