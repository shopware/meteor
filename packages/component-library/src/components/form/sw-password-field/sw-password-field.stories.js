

import SwPasswordField from './sw-password-field.vue';
import baseFieldArgTypes from '../_internal/sw-base-field/arg-types';

const meta = {
  title: 'Components/Form/sw-password-field',
  component: SwPasswordField,
  render: (args, { argTypes }) => ({
    template: `
      <div>
        <sw-password-field
          v-bind="$props"
          v-model="currentValue"
          @change="$props.change"
          @inheritance-restore="inheritanceRestoreWrapper"
          @inheritance-remove="inheritanceRemoveWrapper"
        >
          <template
              v-if="$props.prefix"
              #prefix>
            {{ $props.prefix }}
          </template>
          <template
              v-if="$props.suffix"
              #suffix>
            {{ $props.suffix }}
          </template>
          <template
              v-if="$props.hint"
              #hint>
            {{ $props.hint }}
          </template>
        </sw-password-field>
        <h4 style="display: none;">hidden</h4>
      </div>`,
    props: Object.keys(argTypes),
    components: { SwPasswordField },
    data() {
      return { currentValue: '' }
    },
    watch: {
      value(v) {
        if (this.currentValue === v) {
          return;
        }
  
        this.currentValue = v;
      }
    },
    created() {
      
      this.currentValue = this.value;
    },
    methods: {
      inheritanceRemoveWrapper() {
        this.inheritanceRemove(...arguments);
        this.isInherited = false;
      },
  
      inheritanceRestoreWrapper() {
        this.inheritanceRestore(...arguments);
        this.isInherited = true;
      }
    }
  }),
  args: {
    label: 'Passwordfield',
  },
  argTypes: {
    ...baseFieldArgTypes
  }
}

export default meta;



export const defaultStory = {
  name: 'sw-password-field',
};
