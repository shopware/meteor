import { defineComponent } from "vue";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/vue";
import MtDatepicker from "./mt-datepicker.vue";
import {
  clearValue,
  clickDay,
  closeCalendar,
  deleteText,
  getAmPmSwitch,
  getClearButton,
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
  selectTime,
  setCurrentTime,
  typeValue,
  user,
} from "./mt-datepicker.test-helper";

// This file covers the picker as a form field. What it emits in which time zone is covered in
// mt-datepicker.date-only.spec.ts and mt-datepicker.date-time.spec.ts.

beforeEach(() => {
  // A known "now" makes the month the calendar opens on predictable
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

    it("connects the label to the input", () => {
      renderDatepicker({ label: "Publish date" });

      expect(screen.getByLabelText("Publish date")).toBe(getInput());
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

      expect(screen.getByLabelText("Start")).toBe(start);
      expect(screen.getByLabelText("End")).toBe(end);
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

    it("shows the error for an empty picker only after the user closed it without a choice", async () => {
      renderDatepicker(required);

      await openCalendar();
      expect(screen.queryByText(REQUIRED_ERROR)).not.toBeInTheDocument();

      await closeCalendar();
      expect(await screen.findByText(REQUIRED_ERROR)).toBeVisible();
    });

    it("shows the error for an empty picker only after the user moved past it with the keyboard", async () => {
      renderDatepicker(required);

      await user().tab();
      expect(getInput()).toHaveFocus();
      expect(screen.queryByText(REQUIRED_ERROR)).not.toBeInTheDocument();

      await user().tab();
      expect(await screen.findByText(REQUIRED_ERROR)).toBeVisible();
    });

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

    it("marks the input as invalid when the value is cleared", async () => {
      renderDatepicker(requiredWithValue);
      await expect.poll(getShownValue).toBe("2024/07/10");

      await clearValue();

      await expect.poll(() => getInput().getAttribute("aria-invalid")).toBe("true");
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

    it("reads a time typed on a 12-hour clock when is24 is false", async () => {
      const { onUpdate } = renderDatepicker({ dateType: "datetime", is24: false, textInput: true });

      await typeValue("2025/01/01, 08:05 PM");

      await expect.poll(getShownValue).toBe("2025/01/01, 08:05 PM");
      expect(onUpdate).toHaveBeenLastCalledWith("2025-01-01T20:05:00.000Z");
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
