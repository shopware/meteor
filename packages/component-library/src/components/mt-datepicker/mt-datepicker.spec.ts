import { defineComponent } from "vue";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/vue";
import MtDatepicker from "./mt-datepicker.vue";
import {
  dateOnlyStringToUtcIso,
  isDateOnlyString,
  resolveTimeZone,
  toDateOnlyString,
} from "./date-only";
import {
  AROUND_MIDNIGHT,
  browserTimeZones,
  clearValue,
  clickDay,
  closeCalendar,
  deleteText,
  getAmPmSwitch,
  getClearButton,
  getDayMarkedAsToday,
  getInput,
  getShownMonth,
  getShownTime,
  getShownValue,
  getShownWeekdays,
  getTimeOptions,
  hasCalendar,
  hasTimePicker,
  increaseTime,
  isCalendarOpen,
  isDayDisabled,
  openCalendar,
  renderDatepicker,
  resetPage,
  selectMonth,
  selectTime,
  selectYear,
  setBrowserTimeZone,
  setCurrentTime,
  timeZonePairs,
  typeValue,
  user,
} from "./mt-datepicker.test-helper";

// The tests come in five groups: the picker as a form field, the values of a date-only picker,
// plain date values, the values of a picker with date and time, and the day conversion.

beforeEach(() => {
  // A known "now" makes the month the calendar opens on predictable. It is 09:00 UTC, so a
  // "current time" that leaks into a value is visible in every tested time zone.
  setCurrentTime("2024-07-15T09:00:00Z");
});

afterEach(resetPage);

const REQUIRED_ERROR = "This field is required";

describe("mt-datepicker", () => {
  describe("field", () => {
    it("can be disabled", () => {
      renderDatepicker({ disabled: true });

      expect(getInput()).toBeDisabled();
    });

    it("opens the calendar when the label is clicked", async () => {
      renderDatepicker({ label: "Publish date" });

      await user().click(screen.getByText("Publish date"));

      await expect.poll(isCalendarOpen).toBe(true);
    });

    it("names the input after its label for assistive technology", () => {
      renderDatepicker({ label: "Publish date" });

      expect(getInput()).toHaveAccessibleName("Publish date");
    });

    it("connects each label to its own picker", () => {
      render(
        defineComponent({
          components: { MtDatepicker },
          template: `<div><MtDatepicker label="Start" /><MtDatepicker label="End" /></div>`,
        }),
      );

      const [start, end] = screen.getAllByRole("textbox");

      // A label points at its input by id, so every picker needs an id of its own
      expect(start.id).not.toBe(end.id);
      expect(screen.getByText("Start").closest("label")).toHaveAttribute("for", start.id);
      expect(screen.getByText("End").closest("label")).toHaveAttribute("for", end.id);
    });

    it("shows the help text in a tooltip", async () => {
      renderDatepicker({ helpText: "Shown to customers" });

      await user().hover(screen.getByTestId("mt-help-text__icon"));

      expect(await screen.findByRole("tooltip")).toHaveTextContent("Shown to customers");
    });

    it("has no help button without a help text", () => {
      renderDatepicker();

      expect(screen.queryByTestId("mt-help-text__icon")).not.toBeInTheDocument();
    });

    it("is small only when the size is small", async () => {
      const { container, setProps } = renderDatepicker();
      expect(container.firstElementChild).not.toHaveClass("mt-datepicker__wrapper--small");

      await setProps({ size: "small" });

      expect(container.firstElementChild).toHaveClass("mt-datepicker__wrapper--small");
    });

    it('has the placeholder "Y-m-d ..." by default', () => {
      renderDatepicker();

      expect(getInput()).toHaveAttribute("placeholder", "Y-m-d ...");
    });

    it("shows the placeholder when provided", () => {
      renderDatepicker({ placeholder: "Stop! Hammertime!" });

      expect(getInput()).toHaveAttribute("placeholder", "Stop! Hammertime!");
    });

    it("marks the input as required only when it is required", async () => {
      const { setProps } = renderDatepicker({ modelValue: "2024-03-20T00:00:00.000Z" });
      expect(getInput()).not.toBeRequired();

      await setProps({ required: true });

      expect(getInput()).toBeRequired();
    });
  });

  describe("hint", () => {
    it("displays a hint passed via the hint prop", () => {
      renderDatepicker({ hint: "Hint from prop" });

      expect(screen.getByText("Hint from prop")).toBeVisible();
    });

    it("renders markup passed via the hint slot", () => {
      render(MtDatepicker, {
        slots: {
          hint: '<span data-testid="custom-hint">Hint from slot</span>',
        },
      });

      expect(screen.getByTestId("custom-hint")).toBeVisible();
      expect(screen.getByTestId("custom-hint")).toHaveTextContent("Hint from slot");
    });

    it("shows the time zone as the hint of a datetime picker", () => {
      renderDatepicker({ dateType: "datetime", timeZone: "Europe/Berlin" });

      expect(screen.getByTestId("time-zone-hint")).toHaveTextContent("Europe/Berlin");
    });

    it("shows UTC as the time zone hint by default", () => {
      renderDatepicker({ dateType: "datetime" });

      expect(screen.getByTestId("time-zone-hint")).toHaveTextContent("UTC");
    });

    it("shows UTC as the time zone hint when the time zone does not exist", () => {
      // The picker works in UTC then, so that is what the hint has to say
      renderDatepicker({ dateType: "datetime", timeZone: "Not/A_Zone" });

      expect(screen.getByTestId("time-zone-hint")).toHaveTextContent("UTC");
    });

    it("replaces the time zone hint with the custom hint when one is provided", () => {
      renderDatepicker({
        dateType: "datetime",
        timeZone: "Europe/Berlin",
        hint: "Hint from prop",
      });

      expect(screen.getByText("Hint from prop")).toBeVisible();
      expect(screen.queryByTestId("time-zone-hint")).not.toBeInTheDocument();
    });

    it.each(["date", "time"] as const)(
      "shows the time zone hint of a %s picker only once it becomes a datetime picker",
      async (dateType) => {
        const { setProps } = renderDatepicker({ dateType, timeZone: "Europe/Berlin" });
        expect(screen.queryByTestId("time-zone-hint")).not.toBeInTheDocument();

        await setProps({ dateType: "datetime" });

        expect(screen.getByTestId("time-zone-hint")).toHaveTextContent("Europe/Berlin");
      },
    );

    describe("added and removed after mounting", () => {
      const Host = defineComponent({
        components: { Field: MtDatepicker },
        props: {
          showHint: { type: Boolean, default: false },
          hint: { type: String, default: null },
        },
        setup: () => ({ fieldProps: { dateType: "date" } }),
        template: `
          <Field v-bind="fieldProps" :hint="hint">
            <template v-if="showHint" #hint>
              <span data-testid="custom-hint">Original value</span>
            </template>
          </Field>
        `,
      });

      // The box around the hint. It has to go with the hint, or an empty box stays behind.
      function getHintBox() {
        const box = screen.getByTestId("custom-hint").closest(".mt-datepicker__hint");
        if (!box) throw new Error("The hint is not inside a hint box");

        return box;
      }

      it("renders a hint slot added after mounting and removes it again", async () => {
        const { rerender } = render(Host);
        expect(screen.queryByTestId("custom-hint")).not.toBeInTheDocument();

        await rerender({ showHint: true });
        expect(screen.getByTestId("custom-hint")).toBeVisible();
        const hintBox = getHintBox();

        await rerender({ showHint: false });
        expect(hintBox).not.toBeInTheDocument();
      });

      it("removes a hint slot that was present when mounting", async () => {
        const { rerender } = render(Host, { props: { showHint: true } });
        const hintBox = getHintBox();

        await rerender({ showHint: false });

        expect(hintBox).not.toBeInTheDocument();
      });

      it("falls back to the hint prop when the slot is removed", async () => {
        const { rerender } = render(Host, { props: { hint: "Hint from prop" } });

        expect(screen.getByText("Hint from prop")).toBeVisible();

        await rerender({ showHint: true });
        expect(screen.getByTestId("custom-hint")).toBeVisible();
        expect(screen.queryByText("Hint from prop")).not.toBeInTheDocument();

        await rerender({ showHint: false });
        expect(screen.getByText("Hint from prop")).toBeVisible();
      });
    });
  });

  describe("inheritance", () => {
    it("has no inheritance switch by default", () => {
      renderDatepicker({ label: "Publish date" });

      expect(screen.queryByRole("button", { name: /inheritance/ })).not.toBeInTheDocument();
    });

    it("emits inheritance-remove when the switch of an inherited picker is clicked", async () => {
      const onRemove = vi.fn();
      const onRestore = vi.fn();
      renderDatepicker({
        isInheritanceField: true,
        isInherited: true,
        "onInheritance-remove": onRemove,
        "onInheritance-restore": onRestore,
      });

      await user().click(screen.getByRole("button", { name: "Unlink inheritance" }));

      expect(onRemove).toHaveBeenCalledOnce();
      expect(onRestore).not.toHaveBeenCalled();
    });

    it("emits inheritance-restore when the switch of a picker with its own value is clicked", async () => {
      const onRemove = vi.fn();
      const onRestore = vi.fn();
      renderDatepicker({
        isInheritanceField: true,
        isInherited: false,
        "onInheritance-remove": onRemove,
        "onInheritance-restore": onRestore,
      });

      await user().click(screen.getByRole("button", { name: "Link inheritance" }));

      expect(onRestore).toHaveBeenCalledOnce();
      expect(onRemove).not.toHaveBeenCalled();
    });

    it("disables the datepicker while inherited", () => {
      renderDatepicker({ isInherited: true });

      expect(getInput()).toBeDisabled();
    });

    it("disables the inheritance switch only when asked to", async () => {
      const { setProps } = renderDatepicker({ isInheritanceField: true, isInherited: true });
      expect(screen.getByRole("button", { name: "Unlink inheritance" })).toBeEnabled();

      await setProps({ disableInheritanceToggle: true });

      expect(screen.getByRole("button", { name: "Unlink inheritance" })).toBeDisabled();
    });
  });

  describe("error", () => {
    const error = { code: 500, detail: "Error message" };

    it("shows the error and marks the field", () => {
      const { container } = renderDatepicker({ error });

      expect(container.firstElementChild).toHaveClass("has-error");
      expect(screen.getByText("Error message")).toBeInTheDocument();
    });

    it("shows no error by default", () => {
      const { container } = renderDatepicker();

      expect(container.firstElementChild).not.toHaveClass("has-error");
      expect(getInput()).not.toHaveAttribute("aria-invalid", "true");
    });

    it("marks the input as invalid for assistive technology", () => {
      renderDatepicker({ error });

      expect(getInput()).toHaveAttribute("aria-invalid", "true");
    });

    it("describes the input by the error message for assistive technology", () => {
      renderDatepicker({ error });

      expect(getInput()).toHaveAccessibleDescription(expect.stringContaining("Error message"));
    });
  });

  describe("required", () => {
    // The error is feedback on what the user did. A picker the user has not touched never shows
    // it, however empty it is.
    const required = { required: true, dateType: "date" } as const;
    const requiredWithValue = { ...required, modelValue: "2024-07-10T00:00:00.000Z" } as const;

    // In a datetime picker the focus moves into the calendar when it opens, which is not leaving
    it.each(["date", "datetime"] as const)(
      "shows the error for an empty %s picker only after the user closed it without a choice",
      async (dateType) => {
        renderDatepicker({ required: true, dateType });

        await openCalendar();
        expect(screen.queryByText(REQUIRED_ERROR)).not.toBeInTheDocument();

        await closeCalendar();
        expect(await screen.findByText(REQUIRED_ERROR)).toBeVisible();
      },
    );

    it.each([
      ["moved on with the keyboard", () => user().tab()],
      ["clicked somewhere else", () => user().click(document.body)],
    ])(
      "shows the error for an empty picker only after the user was in it and %s",
      async (_, leave) => {
        renderDatepicker(required);

        await user().tab();
        expect(getInput()).toHaveFocus();
        expect(screen.queryByText(REQUIRED_ERROR)).not.toBeInTheDocument();

        await leave();
        expect(await screen.findByText(REQUIRED_ERROR)).toBeVisible();
      },
    );

    it("shows no error when the value is removed from the outside in an untouched picker", async () => {
      const { setProps } = renderDatepicker(requiredWithValue);
      await expect.poll(getShownValue).toBe("2024/07/10");

      await setProps({ modelValue: null });

      await expect.poll(getShownValue).toBe("");
      expect(screen.queryByText(REQUIRED_ERROR)).not.toBeInTheDocument();
    });

    it("shows no error when the user leaves a picker that has a value", async () => {
      renderDatepicker(requiredWithValue);
      await expect.poll(getShownValue).toBe("2024/07/10");

      await openCalendar();
      await closeCalendar();

      expect(screen.queryByText(REQUIRED_ERROR)).not.toBeInTheDocument();
    });

    it("shows an error when the value is cleared, until a value is picked again", async () => {
      renderDatepicker(requiredWithValue);
      await expect.poll(getShownValue).toBe("2024/07/10");

      await clearValue();
      expect(await screen.findByText(REQUIRED_ERROR)).toBeVisible();

      await clickDay("2024-07-20");
      await expect.poll(() => screen.queryByText(REQUIRED_ERROR)).toBeNull();
    });

    it("marks the input as invalid while the error shows", async () => {
      renderDatepicker(requiredWithValue);
      await expect.poll(getShownValue).toBe("2024/07/10");

      await clearValue();
      await expect.poll(() => getInput().getAttribute("aria-invalid")).toBe("true");
      expect(getInput()).toHaveAccessibleDescription(expect.stringContaining(REQUIRED_ERROR));

      await clickDay("2024-07-20");
      await expect.poll(() => getInput().getAttribute("aria-invalid")).toBeNull();
      expect(getInput()).not.toHaveAttribute("aria-describedby");
    });
  });

  describe("clearing", () => {
    it("empties the input, emits null and takes the clear button away", async () => {
      const { emittedValues } = renderDatepicker({ modelValue: "2024-03-20T14:30:00Z" });
      await expect.poll(getShownValue).toBe("2024/03/20, 14:30");

      await clearValue();

      await expect.poll(getShownValue).toBe("");
      expect(emittedValues()).toEqual([null]);
      expect(getClearButton()).not.toBeInTheDocument();
      // The picker is optional, so an empty value is not an error
      expect(screen.queryByText(REQUIRED_ERROR)).not.toBeInTheDocument();
    });

    it("emits null when a range is cleared", async () => {
      const { emittedValues } = renderDatepicker({
        range: true,
        modelValue: ["2024-03-20T14:30:00Z", "2024-03-21T14:30:00Z"],
      });
      await expect.poll(getShownValue).toBe("2024/03/20, 14:30 - 2024/03/21, 14:30");

      await clearValue();

      await expect.poll(getShownValue).toBe("");
      expect(emittedValues()).toEqual([null]);
    });
  });

  describe("calendar", () => {
    it("opens when the input is clicked", async () => {
      renderDatepicker();
      expect(isCalendarOpen()).toBe(false);

      await user().click(getInput());

      await expect.poll(isCalendarOpen).toBe(true);
    });

    it.each(["date", "time"] as const)(
      "closes the %s picker when Escape is pressed",
      async (dateType) => {
        renderDatepicker({ dateType });
        await openCalendar();

        await closeCalendar();

        expect(isCalendarOpen()).toBe(false);
      },
    );

    it("can be opened and closed with the keyboard", async () => {
      renderDatepicker();

      await user().tab();
      expect(getInput()).toHaveFocus();

      await user().keyboard("{Enter}");
      await expect.poll(isCalendarOpen).toBe(true);

      await closeCalendar();
      expect(isCalendarOpen()).toBe(false);
    });

    it("closes when a day is picked", async () => {
      renderDatepicker({ dateType: "date" });

      await clickDay("2024-07-20");

      await expect.poll(isCalendarOpen).toBe(false);
    });

    it("emits a day again when it is picked again after the value was reset from the outside", async () => {
      const { emittedValues, setProps } = renderDatepicker({
        dateType: "date",
        modelValue: "2024-07-10T00:00:00.000Z",
      });
      await clickDay("2024-07-20");
      await expect.poll(getShownValue).toBe("2024/07/20");

      await setProps({ modelValue: "2024-07-10T00:00:00.000Z" });
      await expect.poll(getShownValue).toBe("2024/07/10");
      await clickDay("2024-07-20");

      await expect.poll(getShownValue).toBe("2024/07/20");
      expect(emittedValues()).toEqual(["2024-07-20T00:00:00.000Z", "2024-07-20T00:00:00.000Z"]);
    });

    it("is removed from the page together with the picker", async () => {
      const { unmount } = renderDatepicker();
      await openCalendar();

      unmount();

      await expect.poll(isCalendarOpen).toBe(false);
    });

    it("opens on the current month when the picker is empty", async () => {
      renderDatepicker({ dateType: "date", locale: "en-US" });

      await openCalendar();

      await expect.poll(getShownMonth).toBe("Jul");
    });

    it("opens on the month of the value", async () => {
      renderDatepicker({
        dateType: "date",
        locale: "en-US",
        modelValue: "2024-03-20T00:00:00.000Z",
      });

      await openCalendar();

      await expect.poll(getShownMonth).toBe("Mar");
    });

    it("disables the days before minDate and after maxDate", async () => {
      renderDatepicker({
        dateType: "date",
        modelValue: "2024-03-20T00:00:00.000Z",
        minDate: new Date("2024-03-19T00:00:00.000Z"),
        maxDate: new Date("2024-03-21T00:00:00.000Z"),
      });

      await openCalendar();

      expect(isDayDisabled("2024-03-18")).toBe(true);
      expect(isDayDisabled("2024-03-19")).toBe(false);
      expect(isDayDisabled("2024-03-21")).toBe(false);
      expect(isDayDisabled("2024-03-22")).toBe(true);
    });

    it("does not emit a disabled day", async () => {
      const { emittedValues } = renderDatepicker({
        dateType: "date",
        modelValue: "2024-03-20T00:00:00.000Z",
        minDate: "2024-03-20T00:00:00.000Z",
      });

      await clickDay("2024-03-19");
      expect(isCalendarOpen()).toBe(true);

      // The enabled day clicked afterwards is the only value that may arrive
      await clickDay("2024-03-21");
      await expect.poll(isCalendarOpen).toBe(false);
      expect(emittedValues()).toEqual(["2024-03-21T00:00:00.000Z"]);
    });
  });

  describe("language", () => {
    const march = { dateType: "date", modelValue: "2024-03-15T00:00:00.000Z" } as const;

    it.each([
      ["de", "Mär", ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"]],
      ["fr", "mars", ["lu", "ma", "me", "je", "ve", "sa", "di"]],
      ["en-US", "Mar", ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"]],
    ])("shows month and weekday names for the locale %s", async (locale, month, weekdays) => {
      renderDatepicker({ ...march, locale });

      await openCalendar();

      await expect.poll(getShownMonth).toBe(month);
      expect(getShownWeekdays()).toEqual(weekdays);
    });

    it("uses German by default", async () => {
      renderDatepicker(march);

      await openCalendar();

      await expect.poll(getShownMonth).toBe("Mär");
    });

    it.each([
      ["a locale written with an underscore", "de_DE", "Mär"],
      ["the language of an unknown region", "de-XX", "Mär"],
      ["English for an unknown language", "xx", "Mar"],
      ["English for an empty locale", "", "Mar"],
    ])("falls back to %s", async (_, locale, month) => {
      // Start in French: the picker is English until a locale is loaded, so a fallback to English
      // would otherwise look the same as doing nothing
      const { setProps } = renderDatepicker({ ...march, locale: "fr" });
      await openCalendar();
      await expect.poll(getShownMonth).toBe("mars");

      await setProps({ locale });

      await expect.poll(getShownMonth).toBe(month);
    });
  });

  describe("format", () => {
    it.each([
      ["date", "2024/03/20"],
      ["datetime", "2024/03/20, 13:30"],
      ["time", "13:30"],
    ] as const)("shows a %s value as %s by default", async (dateType, expected) => {
      renderDatepicker({ dateType, modelValue: "2024-03-20T13:30:00Z" });

      await expect.poll(getShownValue).toBe(expected);
    });

    it("shows and reads the value in a custom format", async () => {
      const { onUpdate } = renderDatepicker({
        dateType: "date",
        format: "dd.MM.yyyy",
        textInput: true,
        modelValue: "2024-03-20T00:00:00.000Z",
      });
      await expect.poll(getShownValue).toBe("20.03.2024");

      await typeValue("24.12.2024");

      await expect.poll(getShownValue).toBe("24.12.2024");
      expect(onUpdate).toHaveBeenLastCalledWith("2024-12-24T00:00:00.000Z");
    });
  });

  describe("model value", () => {
    it("shows an ISO string with an offset", async () => {
      renderDatepicker({ dateType: "datetime", modelValue: "2024-03-20T14:30:00+01:00" });

      await expect.poll(getShownValue).toBe("2024/03/20, 13:30");
    });

    it("shows a Date object", async () => {
      renderDatepicker({
        dateType: "datetime",
        modelValue: new Date("2024-03-20T14:30:00+01:00"),
      });

      await expect.poll(getShownValue).toBe("2024/03/20, 13:30");
    });

    it("shows both ends of a range", async () => {
      renderDatepicker({
        dateType: "datetime",
        range: true,
        modelValue: ["2024-03-20T14:30:00+01:00", "2024-03-21T14:30:00+01:00"],
      });

      await expect.poll(getShownValue).toBe("2024/03/20, 13:30 - 2024/03/21, 13:30");
    });

    it("shows a range that has no end yet", async () => {
      renderDatepicker({
        dateType: "datetime",
        range: true,
        modelValue: ["2024-03-20T13:30:00Z", null] as unknown as string[],
      });

      await expect.poll(getShownValue).toBe("2024/03/20, 13:30 - ");
    });

    it("follows a value that is set, changed and removed from the outside without emitting", async () => {
      const { setProps, onUpdate } = renderDatepicker({ dateType: "datetime" });

      await setProps({ modelValue: "2024-03-20T13:30:00Z" });
      await expect.poll(getShownValue).toBe("2024/03/20, 13:30");

      await setProps({ modelValue: "2025-01-02T08:05:00Z" });
      await expect.poll(getShownValue).toBe("2025/01/02, 08:05");

      await setProps({ modelValue: null });
      await expect.poll(getShownValue).toBe("");

      expect(onUpdate).not.toHaveBeenCalled();
    });

    it.each([
      ["date", {}],
      ["date with plain days", { valueFormat: "date" }],
      ["datetime", {}],
      ["time", {}],
    ] as const)("shows nothing for a value that is not a %s", async (name, props) => {
      const dateType = name === "date with plain days" ? "date" : name;
      const { setProps } = renderDatepicker({
        dateType,
        ...props,
        modelValue: "2024-03-20T13:30:00Z",
      });
      await expect.poll(getShownValue).not.toBe("");

      await setProps({ modelValue: "not a date" });

      await expect.poll(getShownValue).toBe("");
    });
  });

  describe("typing", () => {
    // A typed value counts once the user confirms it with Enter or by leaving the field. Until
    // then the picker emits nothing: not the unfinished text and not the finished one.
    const typable = { dateType: "date", textInput: true } as const;

    it("ignores typing by default", async () => {
      const { onUpdate } = renderDatepicker({ dateType: "date" });

      await typeValue("2025/01/01");

      expect(getInput()).toHaveValue("");
      expect(onUpdate).not.toHaveBeenCalled();
    });

    it("emits nothing while the user is typing", async () => {
      const { onUpdate } = renderDatepicker(typable);

      await typeValue("2025/01/01", { confirm: "none" });

      expect(getInput()).toHaveValue("2025/01/01");
      expect(onUpdate).not.toHaveBeenCalled();
    });

    it.each(["enter", "blur"] as const)(
      "emits the typed date once when the user confirms with %s",
      async (confirm) => {
        const { emittedValues } = renderDatepicker(typable);

        await typeValue("2025/01/01", { confirm });

        await expect.poll(getShownValue).toBe("2025/01/01");
        expect(emittedValues()).toEqual(["2025-01-01T00:00:00.000Z"]);
      },
    );

    it("emits the typed date once when the user clicks somewhere else", async () => {
      const { emittedValues } = renderDatepicker(typable);
      await typeValue("2025/01/01", { confirm: "none" });

      await user().click(document.body);

      await expect.poll(getShownValue).toBe("2025/01/01");
      expect(emittedValues()).toEqual(["2025-01-01T00:00:00.000Z"]);
    });

    it.each([
      ["datetime", "2025/01/01, 08:05", "2025-01-01T08:05:00.000Z"],
      ["time", "08:05", "08:05"],
    ] as const)(
      "emits a typed %s once when the user confirms",
      async (dateType, typed, emitted) => {
        const { emittedValues } = renderDatepicker({ dateType, textInput: true });

        await typeValue(typed);

        await expect.poll(getShownValue).toBe(typed);
        expect(emittedValues()).toEqual([emitted]);
      },
    );

    it("emits nothing when the typed date does not exist", async () => {
      const { onUpdate } = renderDatepicker(typable);

      await typeValue("2025/13/45");

      // The text was typed, it just is not a date
      expect(getInput()).toHaveValue("2025/13/45");
      expect(onUpdate).not.toHaveBeenCalled();
    });

    it("replaces the value with the typed date in one step", async () => {
      const { emittedValues } = renderDatepicker({
        ...typable,
        modelValue: "2024-03-20T00:00:00.000Z",
      });
      await expect.poll(getShownValue).toBe("2024/03/20");

      await typeValue("2025/01/01");

      // Deleting the old text on the way is not a value of its own
      await expect.poll(getShownValue).toBe("2025/01/01");
      expect(emittedValues()).toEqual(["2025-01-01T00:00:00.000Z"]);
    });

    it("emits only the picked day when the user types and then picks a day in the calendar", async () => {
      const { emittedValues } = renderDatepicker(typable);
      await typeValue("2025/01/01", { confirm: "none" });

      await clickDay("2025-01-15");

      await expect.poll(getShownValue).toBe("2025/01/15");
      expect(emittedValues()).toEqual(["2025-01-15T00:00:00.000Z"]);
    });

    it("discards what was typed when Escape is pressed", async () => {
      const { onUpdate } = renderDatepicker({
        ...typable,
        modelValue: "2024-03-20T00:00:00.000Z",
      });
      await expect.poll(getShownValue).toBe("2024/03/20");
      await typeValue("2025/01/01", { confirm: "none" });

      await user().keyboard("{Escape}");
      await user().tab();

      await expect.poll(getShownValue).toBe("2024/03/20");
      expect(onUpdate).not.toHaveBeenCalled();
    });

    it("emits null once when the user deletes the text and confirms", async () => {
      const { emittedValues } = renderDatepicker({
        ...typable,
        modelValue: "2024-03-20T00:00:00.000Z",
      });
      await expect.poll(getShownValue).toBe("2024/03/20");

      await deleteText({ confirm: "none" });
      expect(emittedValues()).toEqual([]);

      await deleteText({ confirm: "enter" });
      await expect.poll(getShownValue).toBe("");
      expect(emittedValues()).toEqual([null]);
    });

    it("does not emit a typed day outside minDate and maxDate", async () => {
      const { onUpdate } = renderDatepicker({
        ...typable,
        minDate: "2024-03-20T00:00:00.000Z",
        maxDate: "2024-03-25T00:00:00.000Z",
      });

      await typeValue("2024/03/19");
      await typeValue("2024/03/26");
      expect(onUpdate).not.toHaveBeenCalledWith(expect.stringMatching(/^2024-03-(19|26)/));

      // A day inside the limits still arrives, so the limits are what held the others back
      await typeValue("2024/03/22");
      expect(onUpdate).toHaveBeenLastCalledWith("2024-03-22T00:00:00.000Z");
    });
  });

  describe("time picker", () => {
    const afternoon = {
      dateType: "datetime",
      locale: "en-US",
      modelValue: "2024-03-20T13:30:00Z",
    } as const;

    const everyTwoDigitNumberBelow = (limit: number, step: number) =>
      Array.from({ length: Math.ceil(limit / step) }, (_, index) =>
        String(index * step).padStart(2, "0"),
      );

    it("is part of a datetime picker but not of a date-only picker", async () => {
      const { setProps } = renderDatepicker(afternoon);
      await openCalendar();
      expect(hasCalendar()).toBe(true);
      expect(hasTimePicker()).toBe(true);

      await setProps({ dateType: "date" });

      await expect.poll(hasTimePicker).toBe(false);
      expect(hasCalendar()).toBe(true);
    });

    it.each([
      ["every hour", "hours", {}, everyTwoDigitNumberBelow(24, 1)],
      ["every minute", "minutes", {}, everyTwoDigitNumberBelow(60, 1)],
      [
        "hours in steps of hourIncrement",
        "hours",
        { hourIncrement: 2 },
        everyTwoDigitNumberBelow(24, 2),
      ],
      [
        "minutes in steps of minuteIncrement",
        "minutes",
        { minuteIncrement: 4 },
        everyTwoDigitNumberBelow(60, 4),
      ],
    ] as const)("offers %s", async (_, unit, props, expected) => {
      renderDatepicker({ ...afternoon, ...props });
      await openCalendar();

      expect(await getTimeOptions(unit)).toEqual(expected);
    });

    it("uses a 24-hour clock by default", async () => {
      renderDatepicker(afternoon);

      await openCalendar();

      expect(getShownTime()).toBe("13:30");
      expect(getAmPmSwitch()).not.toBeInTheDocument();
    });

    it("uses a 12-hour clock with an AM/PM switch when is24 is false", async () => {
      renderDatepicker({ ...afternoon, is24: false });

      await openCalendar();

      expect(getShownTime()).toBe("01:30");
      expect(getAmPmSwitch()).toHaveTextContent("PM");
    });

    it("emits the afternoon hour picked on a 12-hour clock", async () => {
      const { onUpdate } = renderDatepicker({ ...afternoon, is24: false });
      await openCalendar();

      await selectTime("hours", "05");

      await expect.poll(() => onUpdate.mock.lastCall?.[0]).toBe("2024-03-20T17:30:00.000Z");
    });

    // The input and the time picker show the same clock
    it.each([
      ["datetime", "2024/03/20, 01:30 PM"],
      ["time", "01:30 PM"],
    ] as const)(
      "shows a %s value on a 12-hour clock in the input when is24 is false",
      async (dateType, expected) => {
        renderDatepicker({ ...afternoon, dateType, is24: false });

        await expect.poll(getShownValue).toBe(expected);
      },
    );

    it("reads a time typed on a 12-hour clock in the time zone of the picker", async () => {
      setBrowserTimeZone("Asia/Tokyo");
      const { onUpdate } = renderDatepicker({
        dateType: "datetime",
        locale: "en-US",
        timeZone: "America/New_York",
        is24: false,
        textInput: true,
      });

      await typeValue("2025/01/01, 08:05 PM");

      // 8:05 in the evening in New York, which is 5 hours behind UTC in winter
      await expect.poll(getShownValue).toBe("2025/01/01, 08:05 PM");
      expect(onUpdate).toHaveBeenLastCalledWith("2025-01-02T01:05:00.000Z");
    });

    it("reads a typed 12-hour time of a time-only picker and emits it on a 24-hour clock", async () => {
      const { onUpdate } = renderDatepicker({
        dateType: "time",
        locale: "en-US",
        is24: false,
        textInput: true,
      });

      await typeValue("08:05 PM");

      await expect.poll(getShownValue).toBe("08:05 PM");
      expect(onUpdate).toHaveBeenLastCalledWith("20:05");
    });

    it("keeps a custom format when is24 is false", async () => {
      renderDatepicker({ ...afternoon, is24: false, format: "dd.MM.yyyy HH:mm" });

      await expect.poll(getShownValue).toBe("20.03.2024 13:30");
    });
  });

  describe("time-only picker", () => {
    it("shows a time", async () => {
      renderDatepicker({ dateType: "time", modelValue: "14:30" });

      await expect.poll(getShownValue).toBe("14:30");
    });

    it("has a time picker and no calendar", async () => {
      renderDatepicker({ dateType: "time", modelValue: "14:30" });

      await openCalendar();

      expect(getShownTime()).toBe("14:30");
      expect(hasCalendar()).toBe(false);
    });

    it("emits the time with leading zeros when it is changed with the arrows", async () => {
      const { emittedValues } = renderDatepicker({ dateType: "time", modelValue: "07:05" });
      await openCalendar();

      await increaseTime("hours");
      await increaseTime("minutes");

      await expect.poll(emittedValues).toEqual(["08:05", "08:06"]);
    });

    it("emits 24-hour times even when it shows a 12-hour clock", async () => {
      const { emittedValues } = renderDatepicker({
        dateType: "time",
        is24: false,
        modelValue: "13:05",
      });
      await openCalendar();

      await increaseTime("hours");

      await expect.poll(emittedValues).toEqual(["14:05"]);
    });
  });
});

// The values of a date-only picker (dateType="date") in different time zones.
// See https://github.com/shopware/meteor/issues/1483
//
// A date-only picker has no visible time, so the emitted value must not depend on a hidden one.
// Contract: picking a day emits midnight of that day in the time zone of the picker, regardless of
// whether the day was clicked or typed, and regardless of the previous value, the current time or
// the time zone of the browser.
describe("mt-datepicker date-only values", () => {
  // What is expected in each time zone the picker can be set to
  const expectedIn: Record<string, { januaryThe15th: string; julyThe20th: string; today: string }> =
    {
      UTC: {
        // Midnight of the picked day, in winter and in summer
        januaryThe15th: "2000-01-15T00:00:00.000Z",
        julyThe20th: "2024-07-20T00:00:00.000Z",
        // The day it is at AROUND_MIDNIGHT
        today: "2024-07-15",
      },
      "Europe/Berlin": {
        januaryThe15th: "2000-01-14T23:00:00.000Z",
        julyThe20th: "2024-07-19T22:00:00.000Z",
        today: "2024-07-16",
      },
      "America/New_York": {
        januaryThe15th: "2000-01-15T05:00:00.000Z",
        julyThe20th: "2024-07-20T04:00:00.000Z",
        today: "2024-07-15",
      },
      "Asia/Tokyo": {
        januaryThe15th: "2000-01-14T15:00:00.000Z",
        julyThe20th: "2024-07-19T15:00:00.000Z",
        today: "2024-07-16",
      },
    };

  describe.each(timeZonePairs)(
    "with the picker in $timeZone and the browser in $browserTimeZone",
    ({ browserTimeZone, timeZone }) => {
      const { januaryThe15th, julyThe20th, today } = expectedIn[timeZone];
      const dateOnly = { dateType: "date", locale: "en-US", timeZone } as const;

      beforeEach(() => {
        setBrowserTimeZone(browserTimeZone);
      });

      it("emits midnight of the clicked day when the field is empty", async () => {
        const { onUpdate } = renderDatepicker(dateOnly);

        await clickDay("2024-07-20");

        await expect.poll(getShownValue).toBe("2024/07/20");
        expect(onUpdate).toHaveBeenLastCalledWith(julyThe20th);
      });

      it("emits midnight of the clicked day whatever time the previous value had", async () => {
        const { onUpdate } = renderDatepicker({
          ...dateOnly,
          modelValue: "2000-01-10T13:37:42.000Z",
        });

        await clickDay("2000-01-15");

        await expect.poll(getShownValue).toBe("2000/01/15");
        expect(onUpdate).toHaveBeenLastCalledWith(januaryThe15th);
      });

      it("emits midnight of the typed day", async () => {
        const { onUpdate } = renderDatepicker({ ...dateOnly, textInput: true });

        await typeValue("2024/07/20");

        await expect.poll(getShownValue).toBe("2024/07/20");
        expect(onUpdate).toHaveBeenLastCalledWith(julyThe20th);
      });

      it("emits midnight for both ends of a clicked range", async () => {
        const { emittedValues } = renderDatepicker({ ...dateOnly, range: true });
        const twoDaysInMs = 2 * 24 * 60 * 60 * 1000;
        const julyThe22nd = new Date(Date.parse(julyThe20th) + twoDaysInMs).toISOString();

        // The first click emits a range without an end and leaves the calendar open
        await clickDay("2024-07-20");
        expect(isCalendarOpen()).toBe(true);
        await clickDay("2024-07-22");

        await expect.poll(getShownValue).toBe("2024/07/20 - 2024/07/22");
        expect(emittedValues()).toEqual([
          [julyThe20th, null],
          [julyThe20th, julyThe22nd],
        ]);
      });

      it("marks the current day in the time zone of the picker as today", async () => {
        setCurrentTime(AROUND_MIDNIGHT);
        renderDatepicker(dateOnly);

        await openCalendar();

        expect(getDayMarkedAsToday()).toBe(today);
      });
    },
  );

  it.each([
    // The same moment is the day before in New York and the day after in Tokyo
    ["2000-01-10T00:00:00.000Z", "America/New_York", "2000/01/09"],
    ["2000-01-10T15:00:00.000Z", "Asia/Tokyo", "2000/01/11"],
  ])("shows %s as the day it is in %s", async (modelValue, timeZone, expected) => {
    renderDatepicker({ dateType: "date", timeZone, modelValue });

    await expect.poll(getShownValue).toBe(expected);
  });

  it("shows the day in the new time zone when the time zone changes", async () => {
    const { setProps, onUpdate } = renderDatepicker({
      dateType: "date",
      timeZone: "Europe/Berlin",
      modelValue: "2000-01-10T00:00:00.000Z",
    });
    await expect.poll(getShownValue).toBe("2000/01/10");

    await setProps({ timeZone: "America/New_York" });

    await expect.poll(getShownValue).toBe("2000/01/09");
    expect(onUpdate).not.toHaveBeenCalled();
  });

  it("shows both days of a range as the days they are in the time zone", async () => {
    // 03:00 UTC is still the evening before in New York
    renderDatepicker({
      dateType: "date",
      timeZone: "America/New_York",
      range: true,
      modelValue: ["2024-07-20T03:00:00.000Z", "2024-07-22T03:00:00.000Z"],
    });

    await expect.poll(getShownValue).toBe("2024/07/19 - 2024/07/21");
  });

  it("passes the shown day to a custom format function", async () => {
    setBrowserTimeZone("America/Los_Angeles");
    renderDatepicker({
      dateType: "date",
      timeZone: "Asia/Tokyo",
      modelValue: "2000-01-10T15:00:00.000Z",
      format: (date: Date) =>
        `Year: ${date.getFullYear()}, Month: ${date.getMonth() + 1}, Day: ${date.getDate()}`,
    });

    await expect.poll(getShownValue).toBe("Year: 2000, Month: 1, Day: 11");
  });

  // The picker hands the limits to the library as days on the clock of the browser
  it.each(browserTimeZones)(
    "applies minDate and maxDate to the day they fall on in the time zone, with the browser in %s",
    async (browserTimeZone) => {
      setBrowserTimeZone(browserTimeZone);
      // Both limits are midnight in Europe/Berlin: March 20 and March 22
      renderDatepicker({
        dateType: "date",
        timeZone: "Europe/Berlin",
        modelValue: "2024-03-20T23:00:00.000Z",
        minDate: "2024-03-19T23:00:00.000Z",
        maxDate: "2024-03-21T23:00:00.000Z",
      });

      await openCalendar();

      expect(isDayDisabled("2024-03-19")).toBe(true);
      expect(isDayDisabled("2024-03-20")).toBe(false);
      expect(isDayDisabled("2024-03-22")).toBe(false);
      expect(isDayDisabled("2024-03-23")).toBe(true);
    },
  );

  describe("with a time zone that does not exist", () => {
    const unknownTimeZone = { dateType: "date", timeZone: "Not/A_Zone" } as const;

    beforeEach(() => {
      // Far from UTC, so falling back to UTC and falling back to the browser are told apart
      setBrowserTimeZone("Asia/Tokyo");
    });

    it("shows the value as its day in UTC", async () => {
      renderDatepicker({ ...unknownTimeZone, modelValue: "2000-01-10T23:00:00.000Z" });

      await expect.poll(getShownValue).toBe("2000/01/10");
    });

    it("emits midnight UTC of the clicked day", async () => {
      const { onUpdate } = renderDatepicker(unknownTimeZone);

      await clickDay("2024-07-20");

      await expect.poll(getShownValue).toBe("2024/07/20");
      expect(onUpdate).toHaveBeenLastCalledWith("2024-07-20T00:00:00.000Z");
    });
  });
});

// With valueFormat="date" a date-only picker works with plain calendar days ("yyyy-MM-dd"). Such a
// day is the same everywhere, so neither the time zone of the picker nor the browser may
// influence it.
describe("mt-datepicker plain date values", () => {
  const plainDate = { dateType: "date", valueFormat: "date", locale: "en-US" } as const;

  // A plain day is read as midnight UTC, so a picker behind UTC is what would move it by mistake
  describe.each([
    { browserTimeZone: "UTC", timeZone: "America/New_York" },
    { browserTimeZone: "America/Los_Angeles", timeZone: "Asia/Tokyo" },
    { browserTimeZone: "Asia/Tokyo", timeZone: "America/New_York" },
  ])(
    "with the picker in $timeZone and the browser in $browserTimeZone",
    ({ browserTimeZone, timeZone }) => {
      beforeEach(() => {
        setBrowserTimeZone(browserTimeZone);
      });

      it("shows the day of the value and emits the clicked day", async () => {
        const { onUpdate } = renderDatepicker({ ...plainDate, timeZone, modelValue: "2000-01-10" });
        await expect.poll(getShownValue).toBe("2000/01/10");

        await clickDay("2000-01-15");

        await expect.poll(getShownValue).toBe("2000/01/15");
        expect(onUpdate).toHaveBeenLastCalledWith("2000-01-15");
      });

      it("emits the typed day", async () => {
        const { onUpdate } = renderDatepicker({ ...plainDate, timeZone, textInput: true });

        await typeValue("2000/01/15");

        await expect.poll(getShownValue).toBe("2000/01/15");
        expect(onUpdate).toHaveBeenLastCalledWith("2000-01-15");
      });

      it("emits both days of a clicked range", async () => {
        const { emittedValues } = renderDatepicker({ ...plainDate, timeZone, range: true });

        await clickDay("2024-07-20");
        await clickDay("2024-07-22");

        await expect.poll(getShownValue).toBe("2024/07/20 - 2024/07/22");
        expect(emittedValues()).toEqual([
          ["2024-07-20", null],
          ["2024-07-20", "2024-07-22"],
        ]);
      });
    },
  );

  // A date and time is read as the day it is in UTC. That is how a backend returns a stored day.
  it.each([
    ["2000-01-10T00:00:00.000Z", "America/New_York"],
    ["2000-01-10T23:59:59.000Z", "Asia/Tokyo"],
  ])("shows %s as January 10 with the picker in %s", async (modelValue, timeZone) => {
    renderDatepicker({ ...plainDate, timeZone, modelValue });

    await expect.poll(getShownValue).toBe("2000/01/10");
  });

  it("shows both days of a range", async () => {
    renderDatepicker({
      ...plainDate,
      timeZone: "America/New_York",
      range: true,
      modelValue: ["2024-07-20", "2024-07-22"],
    });

    await expect.poll(getShownValue).toBe("2024/07/20 - 2024/07/22");
  });

  it("applies minDate and maxDate as plain days", async () => {
    setBrowserTimeZone("America/Los_Angeles");
    renderDatepicker({
      ...plainDate,
      timeZone: "America/New_York",
      modelValue: "2024-03-21",
      minDate: "2024-03-20",
      maxDate: "2024-03-22",
    });

    await openCalendar();

    expect(isDayDisabled("2024-03-19")).toBe(true);
    expect(isDayDisabled("2024-03-20")).toBe(false);
    expect(isDayDisabled("2024-03-22")).toBe(false);
    expect(isDayDisabled("2024-03-23")).toBe(true);
  });

  // A plain day has no time zone, so today is the day on the clock of the user. In both cases it
  // is another day in the time zone of the picker.
  it.each([
    { browserTimeZone: "America/Los_Angeles", timeZone: "Europe/Berlin", today: "2024-07-15" },
    { browserTimeZone: "Asia/Tokyo", timeZone: "America/New_York", today: "2024-07-16" },
  ])(
    "marks the current day of a user in $browserTimeZone as today",
    async ({ browserTimeZone, timeZone, today }) => {
      setBrowserTimeZone(browserTimeZone);
      setCurrentTime(AROUND_MIDNIGHT);
      renderDatepicker({ ...plainDate, timeZone });

      await openCalendar();

      expect(getDayMarkedAsToday()).toBe(today);
    },
  );

  it.each([
    ["datetime", "2026/04/03, 14:00", "2026-04-03T14:00:00.000Z"],
    ["time", "08:05", "08:05"],
  ] as const)("has no effect on a %s picker", async (dateType, typed, emitted) => {
    const { onUpdate } = renderDatepicker({ dateType, valueFormat: "date", textInput: true });

    await typeValue(typed);

    expect(onUpdate).toHaveBeenLastCalledWith(emitted);
  });
});

// The values of a picker with date and time (dateType="datetime") in different time zones.
//
// Contract: the picker shows and reads everything in its own time zone. The value it emits is that
// moment as a UTC ISO string. The time zone of the browser must not influence either.
//
// The time zone handling of this mode is done by the underlying library. These tests are the
// safety net for updating or replacing it.
describe("mt-datepicker date and time values", () => {
  // What is expected in each time zone the picker can be set to
  const expectedIn: Record<
    string,
    {
      shownNoon: string;
      typedMorning: string;
      timeAroundMidnight: string;
      today: string;
      thatTimeOnThe20th: string;
      minDate: string;
      maxDate: string;
    }
  > = {
    UTC: {
      // How 2000-01-10T12:00:00.000Z is shown
      shownNoon: "2000/01/10, 12:00",
      // What "2000/01/15, 08:30" typed into the picker is as a UTC value
      typedMorning: "2000-01-15T08:30:00.000Z",
      // The time and day it is at AROUND_MIDNIGHT, and that time on July 20
      timeAroundMidnight: "23:30",
      today: "2024-07-15",
      thatTimeOnThe20th: "2024-07-20T23:30:00.000Z",
      // 00:30 on March 20 and 23:30 on March 22
      minDate: "2024-03-20T00:30:00.000Z",
      maxDate: "2024-03-22T23:30:00.000Z",
    },
    "Europe/Berlin": {
      shownNoon: "2000/01/10, 13:00",
      typedMorning: "2000-01-15T07:30:00.000Z",
      timeAroundMidnight: "01:30",
      today: "2024-07-16",
      thatTimeOnThe20th: "2024-07-19T23:30:00.000Z",
      minDate: "2024-03-19T23:30:00.000Z",
      maxDate: "2024-03-22T22:30:00.000Z",
    },
    "America/New_York": {
      shownNoon: "2000/01/10, 07:00",
      typedMorning: "2000-01-15T13:30:00.000Z",
      timeAroundMidnight: "19:30",
      today: "2024-07-15",
      thatTimeOnThe20th: "2024-07-20T23:30:00.000Z",
      minDate: "2024-03-20T04:30:00.000Z",
      maxDate: "2024-03-23T03:30:00.000Z",
    },
    "Asia/Tokyo": {
      shownNoon: "2000/01/10, 21:00",
      typedMorning: "2000-01-14T23:30:00.000Z",
      timeAroundMidnight: "08:30",
      today: "2024-07-16",
      thatTimeOnThe20th: "2024-07-19T23:30:00.000Z",
      minDate: "2024-03-19T15:30:00.000Z",
      maxDate: "2024-03-22T14:30:00.000Z",
    },
  };

  describe.each(timeZonePairs)(
    "with the picker in $timeZone and the browser in $browserTimeZone",
    ({ browserTimeZone, timeZone }) => {
      const expected = expectedIn[timeZone];
      const dateTime = { dateType: "datetime", locale: "en-US", timeZone } as const;

      beforeEach(() => {
        setBrowserTimeZone(browserTimeZone);
      });

      it("shows the value as the time it is in the time zone of the picker", async () => {
        renderDatepicker({ ...dateTime, modelValue: "2000-01-10T12:00:00.000Z" });

        await expect.poll(getShownValue).toBe(expected.shownNoon);

        await openCalendar();
        expect(getShownTime()).toBe(expected.shownNoon.split(", ")[1]);
      });

      it("reads a typed date and time in the time zone of the picker", async () => {
        const { onUpdate } = renderDatepicker({ ...dateTime, textInput: true });

        await typeValue("2000/01/15, 08:30");

        await expect.poll(getShownValue).toBe("2000/01/15, 08:30");
        expect(onUpdate).toHaveBeenLastCalledWith(expected.typedMorning);
      });

      it("keeps the time when another day is clicked", async () => {
        const { onUpdate } = renderDatepicker({
          ...dateTime,
          modelValue: "2000-01-10T12:00:00.000Z",
        });
        await expect.poll(getShownValue).toBe(expected.shownNoon);

        await clickDay("2000-01-15");

        await expect.poll(getShownValue).toBe(expected.shownNoon.replace("01/10", "01/15"));
        expect(onUpdate).toHaveBeenLastCalledWith("2000-01-15T12:00:00.000Z");
      });

      it("uses the current time when a day is clicked in an empty picker", async () => {
        setCurrentTime(AROUND_MIDNIGHT);
        const { onUpdate } = renderDatepicker(dateTime);
        await openCalendar();
        expect(getShownTime()).toBe(expected.timeAroundMidnight);

        await clickDay("2024-07-20");

        await expect.poll(getShownValue).toBe(`2024/07/20, ${expected.timeAroundMidnight}`);
        expect(onUpdate).toHaveBeenLastCalledWith(expected.thatTimeOnThe20th);
      });

      it("marks the current day in the time zone of the picker as today", async () => {
        setCurrentTime(AROUND_MIDNIGHT);
        renderDatepicker(dateTime);

        await openCalendar();

        expect(getDayMarkedAsToday()).toBe(expected.today);
      });

      it("applies minDate and maxDate to the day they fall on in the time zone", async () => {
        renderDatepicker({
          ...dateTime,
          modelValue: "2024-03-21T12:00:00.000Z",
          minDate: expected.minDate,
          maxDate: expected.maxDate,
        });

        await openCalendar();

        expect(isDayDisabled("2024-03-19")).toBe(true);
        expect(isDayDisabled("2024-03-20")).toBe(false);
        expect(isDayDisabled("2024-03-22")).toBe(false);
        expect(isDayDisabled("2024-03-23")).toBe(true);
      });
    },
  );

  it("shows the time in the new time zone when the time zone changes", async () => {
    const { setProps, onUpdate } = renderDatepicker({
      dateType: "datetime",
      timeZone: "UTC",
      modelValue: "2024-12-31T13:00:00Z",
    });
    await expect.poll(getShownValue).toBe("2024/12/31, 13:00");

    // Sydney is 11 hours ahead of UTC in December, so it is already the next year there
    await setProps({ timeZone: "Australia/Sydney" });

    await expect.poll(getShownValue).toBe("2025/01/01, 00:00");
    expect(onUpdate).not.toHaveBeenCalled();
  });

  it("emits the date and time picked in the calendar as the moment it is in the time zone", async () => {
    const { onUpdate } = renderDatepicker({
      dateType: "datetime",
      locale: "en-US",
      timeZone: "America/New_York",
      modelValue: "2023-07-18T09:15:00.000Z",
    });
    await openCalendar();

    await selectTime("hours", "00");
    await selectTime("minutes", "00");
    await selectMonth("Mar");
    await selectYear(2025);
    await clickDay("2025-03-15");

    // Midnight on March 15 in New York, which is 4 hours behind UTC in summer time
    await expect.poll(isCalendarOpen).toBe(false);
    await expect.poll(getShownValue).toBe("2025/03/15, 00:00");
    expect(onUpdate).toHaveBeenLastCalledWith("2025-03-15T04:00:00.000Z");
  });

  it("emits a clicked range with the current time on both days", async () => {
    const { emittedValues } = renderDatepicker({
      dateType: "datetime",
      locale: "en-US",
      range: true,
    });

    // The first click emits a range without an end and leaves the calendar open
    await clickDay("2024-07-20");
    expect(isCalendarOpen()).toBe(true);
    await clickDay("2024-07-22");

    await expect.poll(getShownValue).toBe("2024/07/20, 09:00 - 2024/07/22, 09:00");
    expect(emittedValues()).toEqual([
      ["2024-07-20T09:00:00.000Z", null],
      ["2024-07-20T09:00:00.000Z", "2024-07-22T09:00:00.000Z"],
    ]);
  });

  it("passes the time in the time zone of the picker to a custom format function", async () => {
    setBrowserTimeZone("Asia/Tokyo");
    // 02:30 UTC is 22:30 on the day before in New York
    renderDatepicker({
      dateType: "datetime",
      timeZone: "America/New_York",
      modelValue: "2024-03-20T02:30:00Z",
      format: (date: Date) => `Day ${date.getDate()} at ${date.getHours()}:${date.getMinutes()}`,
    });

    await expect.poll(getShownValue).toBe("Day 19 at 22:30");
  });

  // Clocks in Europe/Berlin went from 02:00 to 03:00 on March 29, 2026
  it.each([
    ["on the day the clocks change", "2026/03/29, 03:30", "2026-03-29T01:30:00.000Z"],
    ["in summer time", "2026/04/03, 14:00", "2026-04-03T12:00:00.000Z"],
  ])("keeps a time typed %s when the picker is opened again", async (_, typed, emitted) => {
    const { onUpdate } = renderDatepicker({
      dateType: "datetime",
      locale: "en-US",
      timeZone: "Europe/Berlin",
      textInput: true,
    });

    await typeValue(typed);

    await expect.poll(getShownValue).toBe(typed);
    expect(onUpdate).toHaveBeenLastCalledWith(emitted);

    // Opening and closing the picker without a change must not move the time
    await openCalendar();
    await closeCalendar();

    await expect.poll(getShownValue).toBe(typed);
    expect(onUpdate).toHaveBeenLastCalledWith(emitted);
  });

  describe("with a time zone that does not exist", () => {
    const unknownTimeZone = { dateType: "datetime", timeZone: "Not/A_Zone" } as const;

    beforeEach(() => {
      // Far from UTC, so falling back to UTC and falling back to the browser are told apart
      setBrowserTimeZone("Asia/Tokyo");
    });

    it("shows the value as its time in UTC", async () => {
      renderDatepicker({ ...unknownTimeZone, modelValue: "2000-01-10T12:00:00.000Z" });

      await expect.poll(getShownValue).toBe("2000/01/10, 12:00");
    });

    it("reads a typed date and time as UTC", async () => {
      const { onUpdate } = renderDatepicker({ ...unknownTimeZone, textInput: true });

      await typeValue("2000/01/15, 08:30");

      await expect.poll(getShownValue).toBe("2000/01/15, 08:30");
      expect(onUpdate).toHaveBeenLastCalledWith("2000-01-15T08:30:00.000Z");
    });
  });
});

// The conversion between a calendar day and a moment, which the date-only picker is built on.
// These tests call the functions of date-only.ts directly, without a picker.
describe("mt-datepicker day conversion", () => {
  describe("toDateOnlyString", () => {
    it.each([
      ["2000-01-10T00:00:00.000Z", "UTC", "2000-01-10"],
      ["2000-01-10T00:00:00.000Z", "Europe/Berlin", "2000-01-10"],
      ["2000-01-10T00:00:00.000Z", "America/New_York", "2000-01-09"],
      ["2000-01-10T23:30:00.000Z", "Europe/Berlin", "2000-01-11"],
      ["2000-01-10T15:00:00.000Z", "Asia/Tokyo", "2000-01-11"],
      ["2024-07-19T22:00:00.000Z", "Europe/Berlin", "2024-07-20"],
      ["2024-03-20T14:30:00+01:00", "UTC", "2024-03-20"],
    ])("returns the day %s falls on in %s", (value, timeZone, expected) => {
      expect(toDateOnlyString(value, timeZone)).toBe(expected);
    });

    it("accepts a Date object", () => {
      expect(toDateOnlyString(new Date("2000-01-10T00:00:00.000Z"), "America/New_York")).toBe(
        "2000-01-09",
      );
    });

    it("returns null for an invalid date", () => {
      expect(toDateOnlyString("not a date", "UTC")).toBeNull();
    });
  });

  describe("dateOnlyStringToUtcIso", () => {
    it.each([
      ["2000-01-15", "UTC", "2000-01-15T00:00:00.000Z"],
      ["2000-01-15", "Europe/Berlin", "2000-01-14T23:00:00.000Z"],
      ["2024-07-20", "Europe/Berlin", "2024-07-19T22:00:00.000Z"],
      ["2000-01-15", "America/New_York", "2000-01-15T05:00:00.000Z"],
      ["2024-07-20", "America/New_York", "2024-07-20T04:00:00.000Z"],
      ["2000-01-15", "Asia/Tokyo", "2000-01-14T15:00:00.000Z"],
      ["2000-01-15", "Asia/Kolkata", "2000-01-14T18:30:00.000Z"],
      ["2000-01-15", "Pacific/Auckland", "2000-01-14T11:00:00.000Z"],
    ])("returns midnight of %s in %s", (dateOnly, timeZone, expected) => {
      expect(dateOnlyStringToUtcIso(dateOnly, timeZone)).toBe(expected);
    });

    it.each([
      // Clocks change later that day, so midnight still has the old offset
      ["2024-03-31", "Europe/Berlin", "2024-03-30T23:00:00.000Z"],
      ["2024-10-27", "Europe/Berlin", "2024-10-26T22:00:00.000Z"],
      ["2024-03-10", "America/New_York", "2024-03-10T05:00:00.000Z"],
      ["2024-11-03", "America/New_York", "2024-11-03T04:00:00.000Z"],
      // The day after the change uses the new offset
      ["2024-04-01", "Europe/Berlin", "2024-03-31T22:00:00.000Z"],
      ["2024-10-28", "Europe/Berlin", "2024-10-27T23:00:00.000Z"],
    ])("returns midnight of %s in %s around a clock change", (dateOnly, timeZone, expected) => {
      expect(dateOnlyStringToUtcIso(dateOnly, timeZone)).toBe(expected);
    });

    it.each([
      // Clocks jump from 00:00 to 01:00, so the day starts at 01:00
      ["2018-11-04", "America/Sao_Paulo", "2018-11-04T03:00:00.000Z"],
      ["2023-03-26", "Asia/Beirut", "2023-03-25T22:00:00.000Z"],
    ])(
      "returns the first moment of %s in %s when midnight is skipped",
      (dateOnly, timeZone, expected) => {
        expect(dateOnlyStringToUtcIso(dateOnly, timeZone)).toBe(expected);
      },
    );

    it.each([
      ["2000-01-15", "UTC"],
      ["2024-07-20", "Europe/Berlin"],
      ["2024-03-31", "Europe/Berlin"],
      ["2000-01-15", "America/New_York"],
      ["2000-01-15", "Asia/Tokyo"],
      ["2018-11-04", "America/Sao_Paulo"],
    ])("round-trips %s in %s", (dateOnly, timeZone) => {
      const iso = dateOnlyStringToUtcIso(dateOnly, timeZone) as string;

      expect(toDateOnlyString(iso, timeZone)).toBe(dateOnly);
    });

    it("returns null for a value that is not a calendar day", () => {
      // isDateOnlyString below covers what counts as a calendar day
      expect(dateOnlyStringToUtcIso("2000-02-30", "UTC")).toBeNull();
    });
  });

  describe("isDateOnlyString", () => {
    it.each(["2000-01-15", "2024-02-29"])("accepts %s", (value) => {
      expect(isDateOnlyString(value)).toBe(true);
    });

    it.each(["", "2000-1-5", "2000/01/15", "2000-01-15T00:00:00.000Z", "2023-02-29", "2000-13-01"])(
      "rejects %j",
      (value) => {
        expect(isDateOnlyString(value)).toBe(false);
      },
    );
  });

  describe("resolveTimeZone", () => {
    it.each(["UTC", "Europe/Berlin", "America/New_York"])("keeps the time zone %s", (timeZone) => {
      expect(resolveTimeZone(timeZone)).toBe(timeZone);
    });

    it.each(["Not/A_Zone", "", null, undefined])("falls back to UTC for %j", (timeZone) => {
      expect(resolveTimeZone(timeZone)).toBe("UTC");
    });
  });
});
