import { within, userEvent } from '@storybook/testing-library';
import { expect } from '@storybook/jest';


import meta from './sw-email-field.stories';

export default {
  ...meta,
  title: 'Interaction Tests/Form/sw-email-field',
};

export const TestInputValue = {
  name: 'Should keep input value',
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const TEST_EMAIL = 'admin@shopware.com';

    await userEvent.type(canvas.getByRole('textbox'), TEST_EMAIL);
    await userEvent.click(canvas.getByText('hidden'));

    expect(canvas.getByRole('textbox').value).toBe(TEST_EMAIL);

    // Input to be called once for each letter
    
    expect(args.input).toHaveBeenCalledTimes(18);
    
    expect(args.change).toHaveBeenCalledWith(TEST_EMAIL);
  }
};

export const VisualTestPrefix = {
  name: 'Should display prefix',
  args: {
    prefix: 'prefix',
  },
  play: ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    expect(canvas.getByText(args.prefix)).toBeDefined();
  }
};

export const VisualTestSuffix = {
  name: 'Should display suffix',
  args: {
    suffix: 'suffix',
  },
  play: ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    expect(canvas.getByText(args.suffix)).toBeDefined();
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
    error: {code: 500, detail: "Error while saving!"},
  },
  play: ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    expect(canvas.getByText(args.error.detail)).toBeDefined();
  }
};

export const VisualTestValidationError = {
  name: 'Should validate email',
  args: {
    value: 'admin@',
  },
  play: ({ canvasElement }) => {
    const canvas = within(canvasElement);

    expect(canvas.getByText("Please enter a part following '@'. 'admin@' is incomplete.")).toBeDefined();
  }
};
