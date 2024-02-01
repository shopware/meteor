import { within, userEvent, fireEvent } from '@storybook/testing-library';
import { expect } from '@storybook/jest';

import meta from './sw-colorpicker.stories';

export default {
  ...meta,
  title: 'Interaction Tests/Form/sw-colorpicker',
};

export const VisualTestRenderColorpicker = {
  name: 'Render colorpicker',
};

export const VisualTestOpenColorpicker = {
  name: 'Open colorpicker',
  args: {
    value: 'rgba(72, 228, 37, 0.81)'
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const pickerToggle = canvas.getByLabelText('colorpicker-toggle');

    await userEvent.click(pickerToggle);

    // todo: figure out what element this is
    // Look inside the popover
    const popover = within(document.getElementsByClassName('sw-popover-deprecated__wrapper')[0]);

    const colorRange = popover.getByLabelText('colorpicker-color-range');
    const alphaRange =  popover.getByLabelText('colorpicker-alpha-range');
    const hexInput = popover.getByLabelText('hex-value');
    const redInput = popover.getByLabelText('red-value');
    const greenInput = popover.getByLabelText('green-value');
    const blueInput = popover.getByLabelText('blue-value');
    const alphaInput = popover.getByLabelText('alpha-value');

    expect(colorRange).toBeDefined();
    expect(colorRange.value).toEqual('109');
    expect(alphaRange).toBeDefined();
    expect(alphaRange.value).toEqual('0.81');

    expect(hexInput).toBeDefined();
    expect(hexInput.value).toEqual('#48e425cf');
    expect(redInput).toBeDefined();
    expect(redInput.value).toEqual('72');
    expect(greenInput).toBeDefined();
    expect(greenInput.value).toEqual('228');
    expect(blueInput).toBeDefined();
    expect(blueInput.value).toEqual('37');
    expect(alphaInput).toBeDefined();
    expect(alphaInput.value).toEqual('81');
  }
}

export const VisualTestChangeColorpickerColor = {
  name: 'Change colorpicker color',
  args: {
    value: 'rgba(72, 228, 37, 0.81)'
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const pickerToggle = canvas.getByLabelText('colorpicker-toggle');

    await userEvent.click(pickerToggle);

    // Look inside the popover
    const popover = within(document.getElementsByClassName('sw-popover-deprecated__wrapper')[0]);

    const colorRange = popover.getByLabelText('colorpicker-color-range');
    const alphaRange = popover.getByLabelText('colorpicker-alpha-range');
    const hexInput = popover.getByLabelText('hex-value');
    const redInput = popover.getByLabelText('red-value');
    const greenInput = popover.getByLabelText('green-value');
    const blueInput = popover.getByLabelText('blue-value');
    const alphaInput = popover.getByLabelText('alpha-value');

    expect(colorRange).toBeDefined();
    expect(colorRange.value).toEqual('109');
    expect(alphaRange).toBeDefined();
    expect(alphaRange.value).toEqual('0.81');

    expect(hexInput).toBeDefined();
    expect(hexInput.value).toEqual('#48e425cf');
    expect(redInput).toBeDefined();
    expect(redInput.value).toEqual('72');
    expect(greenInput).toBeDefined();
    expect(greenInput.value).toEqual('228');
    expect(blueInput).toBeDefined();
    expect(blueInput.value).toEqual('37');
    expect(alphaInput).toBeDefined();
    expect(alphaInput.value).toEqual('81');

    // Change colors
    fireEvent.input(colorRange, { target: { value: 300 } })
    fireEvent.input(alphaRange, { target: { value: 1 } })

    expect(colorRange.value).toEqual('300');
    expect(alphaRange.value).toEqual('1');

    await userEvent.clear(redInput);
    await userEvent.type(redInput, '240');

    await userEvent.clear(greenInput);
    await userEvent.type(greenInput, '60');

    await userEvent.clear(blueInput);
    await userEvent.type(blueInput, '150');

    expect(redInput.value).toEqual('240');
    expect(greenInput.value).toEqual('60');
    expect(blueInput.value).toEqual('150');

    expect(hexInput.value).toEqual('#f03c96');
  }
}

export const VisualTestChangeColorpickerLabel = {
  name: 'Change colorpicker label',
  args: {
    label: 'Another label'
  },
};

export const VisualTestChangeColorpickerOutputHex = {
  name: 'Change colorpicker output to HEX',
  args: {
    label: 'Should output HEX',
    colorOutput: 'hex'
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const pickerToggle = canvas.getByLabelText('colorpicker-toggle');

    await userEvent.click(pickerToggle);

    // Look inside the popover
    const popover = within(document.getElementsByClassName('sw-popover-deprecated__wrapper')[0]);

    const hexInput = popover.getByLabelText('hex-value');
    expect(hexInput).toBeDefined();
    expect(hexInput.value).toEqual('#0fcff5');

    const colorValue = canvas.getByLabelText('colorpicker-color-value');
    expect(colorValue).toBeDefined();
    expect(colorValue.value).toEqual('#0fcff5');
  }
}

export const VisualTestChangeColorpickerOutputHsl = {
  name: 'Change colorpicker output to HSL',
  args: {
    label: 'Should output HSL',
    colorOutput: 'hsl'
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const pickerToggle = canvas.getByLabelText('colorpicker-toggle');

    await userEvent.click(pickerToggle);

    // Look inside the popover
    const popover = within(document.getElementsByClassName('sw-popover-deprecated__wrapper')[0]);

    const hexInput = popover.getByLabelText('hex-value');
    expect(hexInput).toBeDefined();
    expect(hexInput.value).toEqual('#0fcff5');

    const colorValue = canvas.getByLabelText('colorpicker-color-value');
    expect(colorValue).toBeDefined();
    expect(colorValue.value).toEqual('hsl(190, 92%, 51%)');
  }
}

export const VisualTestChangeColorpickerOutputRgb = {
  name: 'Change colorpicker output to RGB',
  args: {
    label: 'Should output RGB',
    colorOutput: 'rgb'
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const pickerToggle = canvas.getByLabelText('colorpicker-toggle');

    await userEvent.click(pickerToggle);

    // Look inside the popover
    const popover = within(document.getElementsByClassName('sw-popover-deprecated__wrapper')[0]);

    const hexInput = popover.getByLabelText('hex-value');
    expect(hexInput).toBeDefined();
    expect(hexInput.value).toEqual('#0fcff5');

    const colorValue = canvas.getByLabelText('colorpicker-color-value');
    expect(colorValue).toBeDefined();
    expect(colorValue.value).toEqual('rgb(15, 207, 245)');
  }
}

export const VisualTestChangeColorpickerOutputHexAlpha = {
  name: 'Change colorpicker output to HEX alpha',
  args: {
    value: '#0fcff582',
    label: 'Should output HEX',
    colorOutput: 'hex'
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const pickerToggle = canvas.getByLabelText('colorpicker-toggle');

    await userEvent.click(pickerToggle);

    // Look inside the popover
    const popover = within(document.getElementsByClassName('sw-popover-deprecated__wrapper')[0]);

    const hexInput = popover.getByLabelText('hex-value');
    expect(hexInput).toBeDefined();
    expect(hexInput.value).toEqual('#0fcff582');

    const colorValue = canvas.getByLabelText('colorpicker-color-value');
    expect(colorValue).toBeDefined();
    expect(colorValue.value).toEqual('#0fcff582');
  }
}

export const VisualTestChangeColorpickerOutputHslAlpha = {
  name: 'Change colorpicker output to HSL alpha',
  args: {
    value: '#0fcff582',
    label: 'Should output HSL',
    colorOutput: 'hsl'
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const pickerToggle = canvas.getByLabelText('colorpicker-toggle');

    await userEvent.click(pickerToggle);

    // Look inside the popover
    const popover = within(document.getElementsByClassName('sw-popover-deprecated__wrapper')[0]);

    const hexInput = popover.getByLabelText('hex-value');
    expect(hexInput).toBeDefined();
    expect(hexInput.value).toEqual('#0fcff582');

    const colorValue = canvas.getByLabelText('colorpicker-color-value');
    expect(colorValue).toBeDefined();
    expect(colorValue.value).toEqual('hsla(190, 92%, 51%, 0.51)');
  }
}

export const VisualTestChangeColorpickerOutputRgbAlpha = {
  name: 'Change colorpicker output to RGB alpha',
  args: {
    label: 'Should output RGB',
    value: '#0fcff582',
    colorOutput: 'rgb'
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const pickerToggle = canvas.getByLabelText('colorpicker-toggle');

    await userEvent.click(pickerToggle);

    // Look inside the popover
    const popover = within(document.getElementsByClassName('sw-popover-deprecated__wrapper')[0]);

    const hexInput = popover.getByLabelText('hex-value');
    expect(hexInput).toBeDefined();
    expect(hexInput.value).toEqual('#0fcff582');

    const colorValue = canvas.getByLabelText('colorpicker-color-value');
    expect(colorValue).toBeDefined();
    expect(colorValue.value).toEqual('rgba(15, 207, 245, 0.51)');
  }
}

export const VisualTestColorpickerWithoutAlpha = {
  name: 'Render colorpicker without alpha',
  args: {
    label: 'Should render without alpha value',
    alpha: false,
  },
  play: async ({ canvasElement }) => {
      const canvas = within(canvasElement);

    const pickerToggle = canvas.getByLabelText('colorpicker-toggle');

    await userEvent.click(pickerToggle);

    // Look inside the popover
    const popover = within(document.getElementsByClassName('sw-popover-deprecated__wrapper')[0]);

    const hexInput = popover.getByLabelText('hex-value');
    expect(hexInput).toBeDefined();
    expect(hexInput.value).toEqual('#0fcff5');

    const alphaInput = popover.queryByLabelText('alpha-value');
    expect(alphaInput).toEqual(null);
  }
}

export const VisualTestColorpickerDisabled = {
  name: 'Render disabled colorpicker',
  args: {
    label: 'Should render disabled colorpicker',
    disabled: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const pickerToggle = canvas.getByLabelText('colorpicker-toggle');

    await userEvent.click(pickerToggle);

    // Expect no popover
    expect(document.getElementsByClassName('sw-popover-deprecated__wrapper').length).toEqual(0);
  }
}

export const VisualTestColorpickerClearValue = {
  name: 'Clear colorpicker value',
  args: {
    label: 'Should clear colorpicker value',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const colorValue = canvas.getByLabelText('colorpicker-color-value');
    await userEvent.clear(colorValue)

    expect(colorValue.value).toEqual('');
  }
}

export const VisualTestColorpickerReadonly = {
  name: 'Render readonly colorpicker',
  args: {
    label: 'Should render readonly colorpicker',
    readonly: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const colorValue = canvas.getByLabelText('colorpicker-color-value');

    expect(colorValue).toHaveAttribute('readonly');

    await userEvent.click(colorValue);
  }
}

export const VisualTestColorpickerDisabledColorLabels = {
  name: 'Render colorpicker without color labels',
  args: {
    label: 'Should render colorpicker without color labels',
    colorLabels: false,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const pickerToggle = canvas.getByLabelText('colorpicker-toggle');

    await userEvent.click(pickerToggle);

    // Look inside the popover
    const popover = within(document.getElementsByClassName('sw-popover-deprecated__wrapper')[0]);

    const hexInput = popover.getByLabelText('hex-value');
    expect(hexInput).toBeDefined();
    expect(hexInput.value).toEqual('#0fcff5');

    const hexLabel = popover.queryByText('HEX');
    const rLabel = popover.queryByText('R');
    const gLabel = popover.queryByText('G');
    const bLabel = popover.queryByText('B');
    const alphaLabel = popover.queryByText('Alpha');


    expect(hexLabel).toEqual(null);
    expect(rLabel).toEqual(null);
    expect(gLabel).toEqual(null);
    expect(bLabel).toEqual(null);
    expect(alphaLabel).toEqual(null);
  }
}

export const VisualTestColorpickerWithHelpText = {
  name: 'Render colorpicker with help text',
  args: {
    helpText: 'Text for helping you',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const tooltip = canvas.getByRole('tooltip');

    await userEvent.hover(tooltip);

    // wait until tooltip gets rendered
    await (() => {
      return new Promise((resolve, reject) => {
        const waitUntilElementLoad = (retryTime = 0) => {
          // do not wait longer than 2.5 seconds
          if (retryTime > 100) {
            reject();
          }

          // check for tooltip
          const result = document.querySelector('[aria-label="currently-opened-tooltip"]');

          // retry selection when not found otherwise resolve it
          if (!result) {
            window.setTimeout(() => waitUntilElementLoad(retryTime + 1), 25)
          } else {

            resolve();
          }
        }

        waitUntilElementLoad();
      })
    })()


    const tooltipElement = within(document.querySelector('[aria-label="currently-opened-tooltip"]').parentElement);

    const openedTooltip = tooltipElement.getByLabelText('currently-opened-tooltip');

    expect(openedTooltip).not.toEqual(null);
    expect(openedTooltip.innerText).toEqual('Text for helping you');
  }
}
