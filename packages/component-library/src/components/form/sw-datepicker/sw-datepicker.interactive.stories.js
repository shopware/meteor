import { within, userEvent } from '@storybook/testing-library';
import { expect } from '@storybook/jest';

import meta from './sw-datepicker.stories';
import { waitUntilRendered } from '../../../_internal/test-helper';

export default {
  ...meta,
  title: 'Interaction Tests/Form/sw-datepicker',
};

export const VisualTestDatepickerShouldOpen = {
  name: 'Should open datepicker',
  args: {
    value: new Date(Date.UTC(2012, 1, 21)).toISOString(),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Open datepicker
    await userEvent.click(canvas.getByRole('textbox'));
    await waitUntilRendered(() => document.getElementsByClassName('flatpickr-calendar').length > 0);

    const calendar = within(document.getElementsByClassName('flatpickr-calendar')[0]);

    // Expect input event is triggered
    expect(calendar).toBeDefined();
  }
};

export const VisualTestDateInputValue = {
  name: 'Should input date value',
  args: {
    label: 'Date value',
    dateType: 'date',
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    const calendar = within(document.getElementsByClassName('flatpickr-calendar')[0]);

    // Open datepicker
    await userEvent.click(canvas.getByRole('textbox'));
    await waitUntilRendered(() => document.getElementsByClassName('flatpickr-calendar').length > 0);

    // Click the 24th of month XYZ
    await userEvent.click(calendar.getByText('24'));

    // Click label to close datepicker
    await userEvent.click(canvas.getByText(args.label));

    // Expect input value to be the 24th of month XYZ
    expect(canvas.getByRole('textbox').value).toMatch(/\d{4}-\d{2}-24/);

    // Expect input event is triggered
    
    expect(args.input).toHaveBeenCalled();
  }
};

export const VisualTestDateTimeInputValue = {
  name: 'Should input datetime value',
  args: {
    label: 'Date value',
    dateType: 'time',
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const calendar = within(document.getElementsByClassName('flatpickr-calendar')[0]);

    // Open datepicker
    await userEvent.click(canvas.getByRole('textbox'));
    await waitUntilRendered(() => document.getElementsByClassName('flatpickr-calendar').length > 0);

    // Enter 22 as hour
    const hourInput = calendar.getByLabelText('Hour')
    await userEvent.clear(hourInput);
    await userEvent.type(hourInput, '22');

    // Enter 22 as minute
    const minuteInput = calendar.getByLabelText('Minute');
    await userEvent.clear(minuteInput);
    await userEvent.type(minuteInput, '22');

    // Click label to close datepicker
    await userEvent.click(canvas.getByText(args.label));

    // Expect input value to be the 24th of month XYZ
    expect(canvas.getByRole('textbox').value).toBe('22:22');
  }
}

export const VisualTestTimeInputValue = {
  name: 'Should input time value',
  args: {
    label: 'Time value',
    dateType: 'time',
    config: {
      'time_24hr': true,
    }
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const calendar = within(document.getElementsByClassName('flatpickr-calendar')[0]);

    // Open datepicker
    await userEvent.click(canvas.getByRole('textbox'));
    await waitUntilRendered(() => document.getElementsByClassName('flatpickr-calendar').length > 0);

    // Enter 22 as hour
    await userEvent.clear(calendar.getByLabelText('Hour'));
    await userEvent.type(calendar.getByLabelText('Hour'), '22');

    // Enter 22 as minute
    await userEvent.clear(calendar.getByLabelText('Minute'));
    await userEvent.type(calendar.getByLabelText('Minute'), '22');

    // Click label to close datepicker
    await userEvent.click(canvas.getByText(args.label));

    // Expect input value to be the 24th of month XYZ
    expect(canvas.getByRole('textbox').value).toBe('22:22');
  }
}

export const TestClearInputValue = {
  name: 'Should clear input value',
  args: {
    label: 'Datepicker',
    value: new Date (Date.UTC(2012, 1, 21)).toISOString(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    // The 21st of February 2012 is correct because the Date constructor takes the month as 0-based
    expect(canvas.getByRole('textbox').value).toBe('2012-02-21');

    await userEvent.click(canvas.getByTestId('sw-datepicker-clear-button'));

    // We need to loose focus
    await userEvent.click(canvas.getByText(args.label));

    expect(canvas.getByRole('textbox').value).toBe('');
  }
};

export const TestDisabledDoesNotOpenFlatpickr = {
  name: 'Should not open flatpickr when disabled',
  args: {
    label: 'Disabled',
    disabled: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Try to open datepicker
    await userEvent.click(canvas.getByRole('textbox'));

    expect(canvas.getByRole('textbox').disabled).toBe(true);
  }
};
