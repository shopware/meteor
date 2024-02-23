import SwSelect from "./sw-select.vue";
import type { StoryObj } from "@storybook/vue3";
import type { SlottedMeta } from "@/_internal/story-helper";

export type SwSelectMeta = SlottedMeta<
  typeof SwSelect,
  | "default"
  | "change"
  | "itemAdd"
  | "item-add"
  | "itemRemove"
  | "item-remove"
  | "paginate"
  | "displayValuesExpand"
  | "searchTermChange"
  | "inheritanceRestore"
  | "inheritanceRemove"
  | "inheritance-restore"
  | "inheritance-remove"
  | "v-model"
  | "prefix"
  | "suffix"
  | "hint"
  | "beforeItemList"
  | "selectionLabelProperty"
  | "resultItem"
  | "resultLabelProperty"
  | "afterItemList"
  | "after-item-list"
  | "before-item-list"
  | "selection-label-property"
  | "result-item"
  | "result-label-property"
  | "item-add"
  | "item-remove"
  | "search-term-change"
  | "inheritance-remove"
  | "inheritance-restore"
  | "display-values-expand"
  | "error"
  | "isInherited"
>;

export default {
  title: "Components/Form/sw-select",
  component: SwSelect,
  render: (args) => ({
    template: `
      <div>
        <sw-select
          v-bind="args"
          :modelValue="currentValue"
          :label="args.label"
          @change="onChange"
          @item-add="args.itemAdd"
          @item-remove="args.itemRemove"
          @paginate="args.paginate"
          @display-values-expand="args.displayValuesExpand"
          @search-term-change="args.searchTermChange"
          @inheritance-restore="inheritanceRestoreWrapper"
          @inheritance-remove="inheritanceRemoveWrapper"
        >
          <template
              v-if="args.prefix"
            #prefix
          >
            {{ args.prefix }}
          </template>
          <template
              v-if="args.suffix"
              #suffix
          >
            {{ args.suffix }}
          </template>
          <template
              v-if="args.hint"
              #hint
          >
            {{ args.hint }}
          </template>
          <template
              v-if="args.beforeItemList"
              #before-item-list
          >
            {{ args.beforeItemList }}
          </template>
          <template
              v-if="args.selectionLabelProperty"
              #selection-label-property
          >
            {{ args.selectionLabelProperty }}
          </template>
          <template
              v-if="args.resultItem"
              #result-item
          >
            {{ args.resultItem }}
          </template>
          <template
              v-if="args.resultLabelProperty"
              #result-label-property
          >
            {{ args.resultLabelProperty }}
          </template>
          <template
              v-if="args.afterItemList"
              #after-item-list
          >
            {{ args.afterItemList }}
          </template>
        </sw-select>
        <h4 style="display: none;">hidden</h4>
      </div>
    `,
    components: { SwSelect },
    data() {
      return { currentValue: [] };
    },
    watch: {
      "args.modelValue"(v) {
        if (this.currentValue === v) {
          return;
        }

        this.currentValue = v;
      },
    },
    created() {
      this.currentValue = args.modelValue;
    },
    methods: {
      onChange(value: string[]) {
        args.change(value);
        this.currentValue = value;
      },

      inheritanceRemoveWrapper() {
        args.inheritanceRemove();
        args.isInherited = false;
      },

      inheritanceRestoreWrapper() {
        args.inheritanceRestore();
        args.isInherited = true;
      },
    },
    setup: () => {
      return {
        args,
      };
    },
  }),
  args: {
    label: "Select",
    modelValue: "b",
    options: [
      {
        id: 1,
        label: "Option A",
        value: "a",
      },
      {
        id: 2,
        label: "Option B",
        value: "b",
      },
      {
        id: 3,
        label: "Option C",
        value: "c",
      },
      {
        id: 4,
        label: "Option D",
        value: "d",
      },
      {
        id: 5,
        label: "Option E",
        value: "e",
      },
      {
        id: 6,
        label: "Option F",
        value: "f",
      },
      {
        id: 7,
        label: "Option FF",
        value: "ff",
      },
      {
        id: 8,
        label: "Option long text",
        value: "Longer value text",
      },
    ],
  },
  argTypes: {
    change: {
      action: "change",
      table: {
        category: "Events",
      },
    },
    itemAdd: {
      action: "item-add",
      table: {
        category: "Events",
      },
    },
    itemRemove: {
      action: "item-remove",
      table: {
        category: "Events",
      },
    },
    searchTermChange: {
      action: "search-term-change",
      table: {
        category: "Events",
      },
    },
    paginate: {
      action: "paginate",
      table: {
        category: "Events",
      },
    },
    displayValuesExpand: {
      action: "display-values-expand",
      table: {
        category: "Events",
      },
    },
    inheritanceRemove: {
      action: "inheritance-remove",
      table: {
        category: "Events",
      },
    },
    inheritanceRestore: {
      action: "inheritance-restore",
      table: {
        category: "Events",
      },
    },
    prefix: {
      control: { type: "text" },
      table: {
        category: "Slots",
      },
    },
    suffix: {
      control: { type: "text" },
      table: {
        category: "Slots",
      },
    },
    hint: {
      control: { type: "text" },
      table: {
        category: "Slots",
      },
    },
    beforeItemList: {
      control: { type: "text" },
      table: {
        category: "Slots",
      },
    },
    selectionLabelProperty: {
      control: { type: "text" },
      table: {
        category: "Slots",
      },
    },
    resultItem: {
      control: { type: "text" },
      table: {
        category: "Slots",
      },
    },
    resultLabelProperty: {
      control: { type: "text" },
      table: {
        category: "Slots",
      },
    },
    afterItemList: {
      control: { type: "text" },
      table: {
        category: "Slots",
      },
    },

    "after-item-list": {
      table: {
        disable: true,
      },
    },
    "before-item-list": {
      table: {
        disable: true,
      },
    },
    "selection-label-property": {
      table: {
        disable: true,
      },
    },
    "result-item": {
      table: {
        disable: true,
      },
    },
    "result-label-property": {
      table: {
        disable: true,
      },
    },

    "item-add": {
      table: {
        disable: true,
      },
    },
    "item-remove": {
      table: {
        disable: true,
      },
    },
    "search-term-change": {
      table: {
        disable: true,
      },
    },
    "inheritance-remove": {
      table: {
        disable: true,
      },
    },
    "inheritance-restore": {
      table: {
        disable: true,
      },
    },
    "display-values-expand": {
      table: {
        disable: true,
      },
    },
    "v-model": {
      table: {
        disable: true,
      },
    },
  },
} as SwSelectMeta;

export type SwSelectStory = StoryObj<SwSelectMeta>;

export const DefaultStory: SwSelectStory = {
  name: "sw-select",
};
