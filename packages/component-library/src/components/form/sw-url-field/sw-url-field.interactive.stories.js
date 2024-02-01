import { within, userEvent } from '@storybook/testing-library';
import { expect } from '@storybook/jest';

import meta from './sw-url-field.stories';

export default {
  ...meta,
  title: 'Interaction Tests/Form/sw-url-field',
};

export const Default = {
  name: 'sw-url-field',
};

export const VisualTestInputValue = {
  name: 'Should keep input value',
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    await userEvent.type(canvas.getByRole('textbox'), 'shopware.com');
    await userEvent.click(canvas.getByText('hidden'));
    await userEvent.click(canvas.getByText('hidden'));

    expect(canvas.getByRole('textbox').value).toBe('shopware.com');
    
    expect(args.input).toHaveBeenLastCalledWith('https://shopware.com');
  }
};

export const VisualTestHttpSwitch = {
  name: 'Should change the ssl switch to http',
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    await userEvent.type(canvas.getByRole('textbox'), 'shopware.com');
    await userEvent.click(canvas.getByText('hidden'));
    
    expect(canvas.getByText('https://').innerText).toContain('https://')
    
    expect(args.input).toHaveBeenLastCalledWith('https://shopware.com');

    await userEvent.click(canvas.getByRole('button'));
    
    expect(canvas.getByText('http://').innerText).toContain('http://')
    await userEvent.click(canvas.getByText('hidden'));
    
    expect(args.input).toHaveBeenLastCalledWith('http://shopware.com');
    expect(canvas.getByRole('textbox').value).toBe('shopware.com');
  }
};

export const TestNotOmitUrlHash = {
  name: 'Should not omit the url hash',
  args: {
    omitUrlHash: false,
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    await userEvent.type(canvas.getByRole('textbox'), 'shopware.com/#content');

    await userEvent.click(canvas.getByText('hidden'));
    
    expect(args.input).toHaveBeenLastCalledWith('https://shopware.com/#content');
    expect(canvas.getByRole('textbox').value).toBe('shopware.com/#content');
  }
};

export const TestOmitUrlHash = {
  name: 'Should omit the url hash',
  args: {
    omitUrlHash: true,
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    await userEvent.type(canvas.getByRole('textbox'), 'shopware.com/#content');

    await userEvent.click(canvas.getByText('hidden'));
    
    expect(args.input).toHaveBeenLastCalledWith('https://shopware.com');

    expect(canvas.getByRole('textbox').value).toBe('shopware.com');
  }
};

export const TestNotOmitUrlSearch = {
  name: 'Should not omit the url search',
  args: {
    omitUrlSearch: false,
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    await userEvent.type(canvas.getByRole('textbox'), 'shopware.com/?someValue=5');

    await userEvent.click(canvas.getByText('hidden'));
    
    expect(args.input).toHaveBeenLastCalledWith('https://shopware.com/?someValue=5');
    expect(canvas.getByRole('textbox').value).toBe('shopware.com/?someValue=5');
  }
};

export const TestOmitUrlSearch = {
  name: 'Should omit the url search',
  args: {
    omitUrlSearch: true,
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    await userEvent.type(canvas.getByRole('textbox'), 'shopware.com/?someValue=5');

    await userEvent.click(canvas.getByText('hidden'));
    
    expect(args.input).toHaveBeenLastCalledWith('https://shopware.com');
    expect(canvas.getByRole('textbox').value).toBe('shopware.com');
  }
};
