import SwSelect from './sw-select.vue';

const meta = {
    title: 'Components/Form/sw-select',
    component: SwSelect,
    render: (args, { argTypes }) => ({
    template: `
      <div>
        <sw-select
          v-bind="$props"
          v-model="currentValue"
          :label="label"
          @change="change"
          @item-add="itemAdd"
          @item-remove="itemRemove"
          @paginate="paginate"
          @display-values-expand="displayValuesExpand"
          @search-term-change="searchTermChange"
          @inheritance-restore="inheritanceRestoreWrapper"
          @inheritance-remove="inheritanceRemoveWrapper"
        >
          <template
              v-if="$props.prefix"
            #prefix
          >
            {{ prefix }}
          </template>
          <template
              v-if="$props.suffix"
              #suffix
          >
            {{ suffix }}
          </template>
          <template
              v-if="$props.hint"
              #hint
          >
            {{ hint }}
          </template>
          <template
              v-if="$props.beforeItemList"
              #before-item-list
          >
            {{ $props.beforeItemList }}
          </template>
          <template
              v-if="$props.selectionLabelProperty"
              #selection-label-property
          >
            {{ $props.selectionLabelProperty }}
          </template>
          <template
              v-if="$props.resultItem"
              #result-item
          >
            {{ $props.resultItem }}
          </template>
          <template
              v-if="$props.resultLabelProperty"
              #result-label-property
          >
            {{ $props.resultLabelProperty }}
          </template>
          <template
              v-if="$props.afterItemList"
              #after-item-list
          >
            {{ $props.afterItemList }}
          </template>
        </sw-select>
        <h4 style="display: none;">hidden</h4>
      </div>
    `,
    props: Object.keys(argTypes),
    components: { SwSelect },
    data() {
      return { currentValue: [] }
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
    label: 'Select',
    value: 'b',
    options: [
      {
        id: 1,
        label: 'Option A',
        value: 'a',
      },
      {
        id: 2,
        label: 'Option B',
        value: 'b',
      },
      {
        id: 3,
        label: 'Option C',
        value: 'c',
      },
      {
        id: 4,
        label: 'Option D',
        value: 'd',
      },
      {
        id: 5,
        label: 'Option E',
        value: 'e',
      },
      {
        id: 6,
        label: 'Option F',
        value: 'f',
      },
      {
        id: 7,
        label: 'Option FF',
        value: 'ff',
      },
      {
        id: 8,
        label: 'Option long text',
        value: 'Longer value text'
      }
    ],
  },
  argTypes: {
    change: {
      action: 'change',
      table: {
        category: 'Events'
      }
    },
    itemAdd: {
      action: 'item-add',
      table: {
        category: 'Events'
      }
    },
    itemRemove: {
      action: 'item-remove',
      table: {
        category: 'Events'
      }
    },
    searchTermChange: {
      action: 'search-term-change',
      table: {
        category: 'Events'
      }
    },
    paginate: {
      action: 'paginate',
      table: {
        category: 'Events'
      }
    },
    displayValuesExpand: {
      action: 'display-values-expand',
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
    inheritanceRestore: {
      action: 'inheritance-restore',
      table: {
        category: 'Events'
      }
    },
    prefix: {
      control: { type: 'text' },
      table: {
        category: 'Slots'
      }
    },
    suffix: {
      control: { type: 'text' },
      table: {
        category: 'Slots'
      }
    },
    hint: {
      control: { type: 'text' },
      table: {
        category: 'Slots'
      }
    },
    beforeItemList: {
      control: { type: 'text' },
      table: {
        category: 'Slots'
      }
    },
    selectionLabelProperty: {
      control: { type: 'text' },
      table: {
        category: 'Slots'
      }
    },
    resultItem: {
      control: { type: 'text' },
      table: {
        category: 'Slots'
      }
    },
    resultLabelProperty: {
      control: { type: 'text' },
      table: {
        category: 'Slots'
      }
    },
    afterItemList: {
      control: { type: 'text' },
      table: {
        category: 'Slots'
      }
    },

    'after-item-list': {
      table: {
        disable: true,
      }
    },
    'before-item-list': {
      table: {
        disable: true,
      }
    },
    'selection-label-property': {
      table: {
        disable: true,
      }
    },
    'result-item': {
      table: {
        disable: true,
      }
    },
    'result-label-property': {
      table: {
        disable: true,
      }
    },

    'item-add': {
      table: {
        disable: true,
      }
    },
    'item-remove': {
      table: {
        disable: true,
      }
    },
    'search-term-change': {
      table: {
        disable: true,
      }
    },
    'inheritance-remove': {
      table: {
        disable: true,
      }
    },
    'inheritance-restore': {
      table: {
        disable: true,
      }
    },
    'display-values-expand': {
      table: {
        disable: true,
      }
    },
    'v-model': {
      table: {
        disable: true,
      }
    },
  },
};

export default meta;



export const defaultStory = {
  name: 'sw-select',
};
