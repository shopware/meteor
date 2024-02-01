import SwBanner from './sw-banner.vue';

const meta = {
  title: 'Components/Feedback Indicator/sw-banner',
  component: SwBanner,
  args: {
    title: 'This is a banner',
    default: 'I am in the default slot of the banner',
    variant: 'neutral',
  },
  render: (args, { argTypes }) => ({
    props: Object.keys(argTypes),
    components: { SwBanner },
    template: `
      <sw-banner
        v-bind="$props"
        @close="close"
      >
        <div v-html="$props.default"></div>
      </sw-banner>`,
  }),
  argTypes: {
    close: {
      action: 'close',
      table: {
        category: 'Events'
      }
    },
  },
}

export default meta;

export const defaultStory = {
  name: 'sw-banner',
};