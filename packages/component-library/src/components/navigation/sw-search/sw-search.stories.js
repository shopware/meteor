import SwSearch from './sw-search.vue'

const meta = {
  title: 'Components/Navigation/sw-search',
  component: SwSearch,
  argTypes: {
    size: {
      control: {
        type: 'select',
        options: ['default', 'small']
      }
    },
    // events
    change: {
      action: 'change',
      table: {
        category: 'Events'
      }
    },
    input: {
      action: 'input',
      table: {
        category: 'Events'
      }
    },
  },
  args: {
    value: '',
    size: 'default',
    placeholder: '',
    disabled: false,
  },
  render:
      (args, { argTypes }) => ({
        components: { SwSearch },
        props: Object.keys(argTypes),
        data() {
          return {
            currentValue: this.value
          }
        },
        watch: {
          value: {
            handler(v) {
              if (this.currentValue === v) {
                return;
              }

              this.currentValue = v;
            },
            immediate: true
          },
        },
        methods: {
          changeHandler(value) {
            this.change(value);
            this.currentValue = value;
          },
          inputHandler(value) {
            this.input(value);
            this.currentValue = value;
          }
        },
        template: `
  <div>
    <sw-search
      v-bind="$props"
      :value="currentValue"
      @change="changeHandler"
      @input="inputHandler"
    >
      {{ $props.default }}
    </sw-search>

    <!-- Element is used for storybook being able to lose focus of search component  -->
    <h4 style="display: none;">hidden</h4>
  </div>
  `,
      })
};

export default meta;

export const Default = {
  name: 'sw-search',
}
