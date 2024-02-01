import meta from './sw-segmented-control.stories';
import { userEvent, within } from '@storybook/testing-library';
import { expect } from '@storybook/jest';

export default {
    ...meta,
    title: 'Interaction Tests/Navigation/sw-segmented-control',
};

export const VisualTestRenderSegmentedControl = {
    name: 'Render segmented controls',
};

export const VisualTestRenderSegmentedControlWithContext = {
    name: 'Render segmented controls with context',
    args: {
        disableContext: false,
    },
};

export const VisualTestRenderSegmentedControlWithPopoverBase = {
    name: 'Render segmented controls with popover base',
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);

        const button = await canvas.getByText('Label F');

        await userEvent.click(button);

        // Look inside the popover
        const popover = within(
            document.getElementsByClassName('sw-popover__content')[0],
        );

        const firstLevel = await popover.getByText('First level');
        expect(firstLevel).toBeInTheDocument();
    },
};

export const VisualTestRenderSegmentedControlWithPopoverSecondLevel = {
    name: 'Render segmented controls with popover second level',
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);

        const button = await canvas.getByText('Label F');

        await userEvent.click(button);

        // Look inside the popover
        const popover = within(
            document.getElementsByClassName('sw-popover__content')[0],
        );

        const goToSecondLevel = await popover.getByText('Go to second level');
        await userEvent.click(goToSecondLevel);

        const secondLevel = await popover.getByText('Second level');
        expect(secondLevel).toBeInTheDocument();

        const goToThirdLevel = await popover.getByText('Go to third level');
        expect(goToThirdLevel).toBeInTheDocument();
    },
};
