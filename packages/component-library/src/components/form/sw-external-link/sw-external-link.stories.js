import SwExternalLink from './sw-external-link.vue';


const meta = {
  title: 'Components/Form/sw-external-link',
  component: SwExternalLink,
  render: (args, { argTypes }) => ({
    props: Object.keys(argTypes),
    components: { SwExternalLink },
    template: `
      <sw-external-link 
        v-bind="$props"
        @click="click"
      >
        Click here
      </sw-external-link>`,
  }),
  args: {
    small: false,
    rel: 'noopener',
    href: 'https://www.shopware.com',
    disabled: false,
  },
  argTypes: {
    click: {
      action: 'click',
      table: {
        category: 'Events'
      }
    },
  },
};

export default meta;

export const defaultStory = {
  name: 'sw-external-link',
};
