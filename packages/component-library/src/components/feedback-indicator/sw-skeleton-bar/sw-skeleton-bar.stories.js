import SwSkeletonBar from './sw-skeleton-bar';

const meta = {
    title: 'Components/Feedback Indicator/sw-skeleton-bar',
    component: SwSkeletonBar,
    render: (args, { argTypes }) => ({
        props: Object.keys(argTypes),
        components: { SwSkeletonBar },
        template: `
          <div style="width: 500px; margin-top: 50px; margin-left: 50px;">
            <sw-skeleton-bar v-bind="$props"></sw-skeleton-bar>
          </div>
        `,
    }),
};

export default meta;

export const Default = {
    name: 'sw-skeleton-bar',
};
