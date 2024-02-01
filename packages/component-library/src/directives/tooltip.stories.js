import SwIcon from '../components/icons-media/sw-icon/sw-icon.vue';
import TooltipDirective from './tooltip.directive';

const meta = {
  title: 'Directives/Tooltip',
  component: SwIcon,
  render: (args, { argTypes }) => ({
    props: Object.keys(argTypes),
    components: { SwIcon },
    directives: {
      tooltip: TooltipDirective,
    },
    template: `<div>
      <sw-icon
        name="regular-question-circle"
          v-tooltip="{
          ...$props
        }">
      </sw-icon>
    </div>`,
  }),
  args: {
    message: 'Help text',
    width: 200,
    showDelay: 100,
    hideDelay: 100,
    disabled: false,
    appearance: 'dark',
    showOnDisabledElements: false,
  },
  argTypes: {
    appearance: {
      control: {
        type: 'radio',
        options: ['dark', 'light'],
      },
    },
    /**
     * Disable name, color and decorative because they
     * are automatically generated and don't belong to
     * the directive
     */
    name: {
      table: {
        disable: true,
      }
    },
    color: {
      table: {
        disable: true,
      }
    },
    decorative: {
      table: {
        disable: true,
      }
    },
  }
};

export default meta;

export const Default = {
  name: 'Tooltip',
};