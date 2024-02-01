import { within, userEvent } from '@storybook/testing-library';
import { expect } from '@storybook/jest';

import meta from './sw-banner.stories';

export default {
  ...meta,
  title: 'Interaction Tests/Feedback Indicator/sw-banner',
};

export const VisualTestBannerNeutral = {
  name: 'Banner neutral',
}

export const VisualTestBannerInfo = {
  name: 'Banner info',
  args: {
    variant: 'info'
  },
};

export const VisualTestBannerAttention = {
  name: 'Banner attention',
  args: {
    variant: 'attention'
  },
};

export const VisualTestBannerCritical = {
  name: 'Banner critical',
  args: {
    variant: 'critical'
  },
};

export const VisualTestBannerPositive = {
  name: 'Banner positive',
  args: {
    variant: 'positive'
  },
};

export const VisualTestBannerInherited = {
  name: 'Banner inherited',
  args: {
    variant: 'inherited'
  },
};

export const VisualTestRenderWithoutIcon = {
  name: 'Render banner without icon',
  args: {
    hideIcon: true,
  },
};

export const VisualTestCloseBannerBox = {
  name: 'Close the banner',
  args: {
    closable: true,
  },
  play:  async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
  
    expect(args.close).not.toHaveBeenCalled();
  
    await userEvent.click(canvas.getByRole('button'));
    expect(args.close).toHaveBeenCalledWith(null);
  }
};
