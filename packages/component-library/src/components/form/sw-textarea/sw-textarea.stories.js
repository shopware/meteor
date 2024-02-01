import SwTextarea from './sw-textarea.vue';

const meta = {
  title: 'Components/Form/sw-textarea',
  component: SwTextarea,
  render: (args, { argTypes }) => ({
    template: '<div><sw-textarea v-bind="$props" v-model="currentValue" @input="input" @change="change" @inheritance-restore="inheritanceRestore" @inheritance-remove="inheritanceRemove"><template #hint>{{ hint }}</template></sw-textarea><p style="display: none">hidden</p></div>',
    props: Object.keys(argTypes),
    components: { SwTextarea },
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
    label: 'Textareafield',
  },
  argTypes: {
    input: {
      action: 'input',
      table: {
        category: 'Events'
      }
    },
    change: {
      action: 'change',
      table: {
        category: 'Events'
      }
    },
    inheritanceRestore: {
      action: 'inheritance-restore',
      table: {
        category: 'Events'
      }
    },
    inheritanceRemove: {
      action: 'inheritance-remove',
      table: {
        category: 'Events'
      }
    },
    hint: {
      control: { type: 'text' },
    },
  },
};

export default meta;



export const defaultStory = {
  name: 'sw-textarea',
};
