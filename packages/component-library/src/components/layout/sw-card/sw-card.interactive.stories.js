import { within, userEvent } from '@storybook/testing-library';
import { expect } from '@storybook/jest';

import { minimalStory, extendedStory } from './sw-card.stories';

export default {
  title: 'Interaction Tests/Layout/sw-card',
};

export const VisualTestMinimalPage = {
  ...minimalStory,
  name: 'Render a minimal card',
  args: {
    ...minimalStory.args,
  },
};

export const VisualTestExtendedPage = {
  ...extendedStory,
  name: 'Render a extended card',
  args: {
    ...extendedStory.args,
  },
};

export const VisualTestExtendedPageWithoutToolbar = {
  ...extendedStory,
  name: 'Render a extended card without toolbar',
  args: {
    ...extendedStory.args,
    toolbar: null,
  },
};

export const VisualTestExtendedPageWithHero = {
  ...extendedStory,
  name: 'Render a extended card with hero',
  args: {
    ...extendedStory.args,
    hero: true,
  },
};

export const VisualTestExtendedPageWithoutHeaderRight = {
  ...extendedStory,
  name: 'Render a extended card without headerRight',
  args: {
    ...extendedStory.args,
    headerRight: null,
  },
};

export const VisualTestExtendedPageWithoutTabs = {
  ...extendedStory,
  name: 'Render a extended card without Tabs',
  args: {
    ...extendedStory.args,
    tabs: null,
  },
};

export const VisualTestExtendedPageWithoutAvatar = {
  ...extendedStory,
  name: 'Render a extended card without Avatar',
  args: {
    ...extendedStory.args,
    avatar: null,
  },
};

export const VisualTestExtendedPageWithoutFooter = {
  ...extendedStory,
  name: 'Render a extended card without Footer',
  args: {
    ...extendedStory.args,
    footer: null,
  },
};

export const VisualTestExtendedPageWithoutContextActions = {
  ...extendedStory,
  name: 'Render a extended card without Context Actions',
  args: {
    ...extendedStory.args,
    contextActions: null,
  },
};

export const VisualTestExtendedPageWithOpenedContextActions = {
  ...extendedStory,
  name: 'Render a extended card with opened Context Actions',
  args: {
    ...extendedStory.args,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const button = canvas.getByLabelText('Context menu');

    await userEvent.click(button);

    // Look inside the popover
    const popover = within(document.getElementsByClassName('sw-popover__content')[0]);

    const menuItem = popover.getAllByRole('menuitem');

    await expect(menuItem[0]).toHaveTextContent('Menu Item A');

    await expect(menuItem[1]).toHaveTextContent('Menu Item B');

    await expect(menuItem[2]).toHaveTextContent('Menu Item C');
  },
}
