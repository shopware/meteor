import { within, userEvent } from '@storybook/testing-library';
import { expect } from '@storybook/jest';
import meta from './sw-search.stories';

export default {
    ...meta,
    title: 'Interaction Tests/Navigation/sw-search',
};

export const TestInputValue = {
    name: 'Should keep input value',
    play: async ({ args, canvasElement }) => {
        // we can't use canvasElement because it is not available anymore
        const canvas = within(canvasElement);

        await userEvent.type(canvas.getByRole('textbox'), 'Shopware');
        await userEvent.click(canvas.getByText('hidden'));

        expect(canvas.getByRole('textbox').value).toBe('Shopware');
        await expect(args.change).toHaveBeenCalledWith('Shopware');
    },
};

export const VisualTestDefaultSize = {
    name: 'Render the default sized search',
    args: {
        size: 'default',
    },
};

export const VisualTestSmallSize = {
    name: 'Render the small sized search',
    args: {
        size: 'small',
    },
};

export const VisualTestDefaultSizeDisabled = {
    name: 'Render the default sized search disabled',
    args: {
        size: 'default',
        disabled: true,
    },
};

export const VisualTestSmallSizeDisabled = {
    name: 'Render the small sized search disabled',
    args: {
        size: 'small',
        disabled: true,
    },
};
