import { within, userEvent } from '@storybook/testing-library';
import { expect } from '@storybook/jest';


import meta from './sw-number-field.stories';

export default {
  ...meta,
  title: 'Interaction Tests/Form/sw-number-field',
};

export const TestInputValue = {
  name: 'Should keep input value',
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole('textbox'));
    await userEvent.type(canvas.getByRole('textbox'), '42');
    await userEvent.click(canvas.getByText('hidden'));

    // Notice that the value is of type string and the value of the event is of type number
    expect(canvas.getByRole('textbox').value).toBe('42');
    
    expect(args.change).toHaveBeenCalledWith(42);
  },
};

export const TestIncreaseByKeyStroke = {
  name: 'Should increase value by key stroke',
  args: {
    value: 10,
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole('textbox'));
    await userEvent.type(canvas.getByRole('textbox'), '{arrowup}');

    await userEvent.click(canvas.getByText('hidden'));

    // Notice that the value is of type string and the value of the event is of type number
    expect(canvas.getByRole('textbox').value).toBe('11');
    
    expect(args.change).toHaveBeenCalledWith(11);
  },
};

export const TestIncreaseByControl = {
  name: 'Should increase value by control',
  args: {
    value: 10,
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByTestId('sw-number-field-increase-button'));
    await userEvent.click(canvas.getByText('hidden'));

    // Notice that the value is of type string and the value of the event is of type number
    expect(canvas.getByRole('textbox').value).toBe('11');
    
    expect(args.change).toHaveBeenCalledWith(11);
  },
};

export const TestDecreaseByKeyStroke = {
  name: 'Should decrease value by key stroke',
  args: {
    value: 10,
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole('textbox'));
    await userEvent.type(canvas.getByRole('textbox'), '{arrowdown}');

    await userEvent.click(canvas.getByText('hidden'));

    // Notice that the value is of type string and the value of the event is of type number
    expect(canvas.getByRole('textbox').value).toBe('9');
    
    expect(args.change).toHaveBeenCalledWith(9);
  }
};

export const TestDecreaseByControl = {
  name: 'Should decrease value by control',
  args: {
    value: 10,
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByTestId('sw-number-field-decrease-button'));

    await userEvent.click(canvas.getByText('hidden'));

    // Notice that the value is of type string and the value of the event is of type number
    expect(canvas.getByRole('textbox').value).toBe('9');
    
    expect(args.change).toHaveBeenCalledWith(9);
  }
};

export const TestStepIncrease = {
  name: 'Should increase float step',
  args: {
    value: 10,
    step: 0.7,
    numberType: 'float',
    fillDigits: true,
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByTestId('sw-number-field-increase-button'));
    await userEvent.type(canvas.getByRole('textbox'), '{arrowup}');

    await userEvent.click(canvas.getByText('hidden'));

    // Notice that the value is of type string and the value of the event is of type number
    expect(canvas.getByRole('textbox').value).toBe('11.40');
    
    expect(args.change).toHaveBeenCalledWith(11.4);
  }
};

export const TestDecreaseConsidersMin = {
  name: 'Should not decrease below min',
  args: {
    value: 11,
    min: 10,
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByTestId('sw-number-field-decrease-button'));
    await userEvent.type(canvas.getByRole('textbox'), '{arrowdown}');

    await userEvent.click(canvas.getByText('hidden'));

    // Notice that the value is of type string and the value of the event is of type number
    expect(canvas.getByRole('textbox').value).toBe('10');
    
    expect(args.change).toHaveBeenCalledWith(10);
  }
};

export  const TestIncreaseConsiderMax = {
  name: 'Should not increase above max',
  args: {
    value: 9,
    max: 10,
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByTestId('sw-number-field-increase-button'));
    await userEvent.type(canvas.getByRole('textbox'), '{arrowup}');

    await userEvent.click(canvas.getByText('hidden'));

    // Notice that the value is of type string and the value of the event is of type number
    expect(canvas.getByRole('textbox').value).toBe('10');
    
    expect(args.change).toHaveBeenCalledWith(10);
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
  },
};

export const VisualTestSuffix = {
  name: 'Should display suffix',
  args: {
    suffix: 'suffix',
  },
  play: ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    
    expect(canvas.getByText(args.suffix)).toBeDefined();
  },
};

export const VisualTestHint = {
  name: 'Should display hint',
  args: {
    hint: 'hint',
  },
  play: ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    
    expect(canvas.getByText(args.hint)).toBeDefined();
  },
};

export const VisualTestDisabled = {
  name: 'Should disable',
  args: {
    disabled: true,
    value: 44,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.type(canvas.getByRole('textbox'), '1337');

    expect(canvas.getByRole('textbox').value).toBe('44')
  },
};

export const VisualTestError = {
  name: 'Should display error',
  args: {
    error: {
      code: 500, detail: "Error while saving!"
    },
  },
  play: ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    
    expect(canvas.getByText(args.error.detail)).toBeDefined();
  },
};

export const VisualTestInheritance = {
  name: 'Should remove and restore inheritance',
  args: {
    isInheritanceField: true,
    isInherited: false
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByTestId('sw-icon__regular-lock-open-s'));
    
    expect(args.inheritanceRestore).toBeCalled();

    expect(canvas.getByTestId('sw-inheritance-switch-icon')).toBeDefined();

    await userEvent.click(canvas.getByTestId('sw-inheritance-switch-icon'));
    
    expect(args.inheritanceRemove).toBeCalled();

    expect(canvas.getByTestId('sw-icon__regular-lock-open-s')).toBeDefined();
  }
};