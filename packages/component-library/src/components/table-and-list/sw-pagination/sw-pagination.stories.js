import SwPagination from './sw-pagination.vue';

export default {
  title: 'Components/Table and list/sw-pagination',
  component: SwPagination,
  argTypes: {
    'change-current-page': {
      action: 'change-current-page',
      table: {
        category: 'Events'
      }
    },
  },
};

const Template = (args, { argTypes }) => ({
  components: { SwPagination },
  props: Object.keys(argTypes),
  template: `<sw-pagination v-bind="$props" :current-page="page" @change-current-page="page = $event" />`,
  data() {
    return { page: 1 };
  },
});

export const Default = Template.bind();
Default.args = {
  totalItems: 100,
  limit: 25,
};
Default.storyName = 'sw-pagination';
