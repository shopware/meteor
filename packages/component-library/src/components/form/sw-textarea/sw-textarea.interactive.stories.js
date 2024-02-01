import { within, userEvent } from '@storybook/testing-library';
import { expect } from '@storybook/jest';


import meta from './sw-textarea.stories';

export default {
  ...meta,
  title: 'Interaction Tests/Form/sw-textarea',
};

export const TestInputValue = {
  name: 'Should keep input value',
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    await userEvent.type(canvas.getByRole('textbox'), 'Shopware');
    await userEvent.click(canvas.getByText('hidden'));

    expect(canvas.getByRole('textbox').value).toBe('Shopware');
    
    expect(args.change).toHaveBeenCalledWith('Shopware');
  }
};

export const VisualTestHint = {
  name: 'Should display hint',
  args: {
    hint: 'hint',
  },
  play: ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    
    expect(canvas.getByText(args.hint)).toBeDefined();
  }
};

export const TestLabel = {
  name: 'Should display label',
  args: {
    label: 'label',
  },
  play: ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    expect(canvas.getByText(args.label)).toBeDefined();
  }
};

export const VisualTestDisabled = {
  name: 'Should disable',
  args: {
    disabled: true,
    value: 'Shopware'
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.type(canvas.getByRole('textbox'), '1337');

    expect(canvas.getByRole('textbox').value).toBe('Shopware')
  }
};

export const TestPlaceholder = {
  name: 'Should display placeholder',
  args: {
    placeholder: 'Placeholder',
  },
  play: ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    expect(canvas.getByPlaceholderText(args.placeholder)).toBeDefined();
  }
};

export const VisualTestError = {
  name: 'Should display error',
  args: {
    error: {
      code: 500,
      detail: "Error while saving!"
    },
  },
  play: ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    expect(canvas.getByText(args.error.detail)).toBeDefined();
  }
};