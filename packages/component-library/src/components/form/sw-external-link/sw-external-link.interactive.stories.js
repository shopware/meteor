import { within, userEvent } from '@storybook/testing-library';
import { expect } from '@storybook/jest';


import meta from './sw-external-link.stories';

export default {
  ...meta,
  title: 'Interaction Tests/Form/sw-external-link',
};

export const VisualTestRenderExternalLink = {
  name: 'Render external link',
  args: {
    href: 'https://developers.shopware.com/',
  },
};

export const VisualTestRenderExternalLinkSmall = {
  name: 'Render external link in small',
  args: {
    small: true,
    href: 'https://developers.shopware.com/',
  },
};

export const VisualTestRenderExternalLinkDisabled = {
  name: 'Render disabled external link',
  args: {
    disabled: true,
  },
  play: ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const link = canvas.getByRole('link');

    expect(getComputedStyle(link).pointerEvents).toEqual('none');
  },
};

export const TestExternalLinkWithoutHref = {
  name: 'Render external link without href attribute',
  args: {
    href: null,
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole('link'));

    expect(args.click).toHaveBeenCalled();
  },
};
