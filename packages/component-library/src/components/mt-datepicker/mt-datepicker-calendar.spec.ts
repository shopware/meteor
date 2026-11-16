import { defineComponent, h, ref } from "vue";
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen, within } from "@testing-library/vue";
import userEvent from "@testing-library/user-event";
import type { Locale } from "date-fns";
import { de } from "date-fns/locale/de";
import { enUS } from "date-fns/locale/en-US";
import { fr } from "date-fns/locale/fr";
import MtDatepickerCalendar from "./mt-datepicker-calendar.vue";

type ModelValue = string | null | [string | null, string | null];

type Options = {
  range?: boolean;
  modelValue?: ModelValue;
  viewDay?: string;
  today?: string;
  minDay?: string | null;
  maxDay?: string | null;
  locale?: Locale;
  localeTag?: string;
  /** When false, the parent does not pass a picked value back (like a parent that only reads it). */
  bindModelValue?: boolean;
};

/** Renders the calendar inside a parent that binds `v-model:viewDay` and, by default, the value. */
function renderCalendar(options: Options = {}) {
  const onViewDay = vi.fn();
  const onSelect = vi.fn();
  const onSelectRange = vi.fn();

  const Parent = defineComponent({
    setup() {
      const viewDay = ref(options.viewDay ?? "2024-03-15");
      const modelValue = ref<ModelValue>(
        options.modelValue ?? (options.range ? [null, null] : null),
      );

      return () =>
        h(MtDatepickerCalendar, {
          range: options.range ?? false,
          modelValue: modelValue.value,
          viewDay: viewDay.value,
          today: options.today ?? "2024-03-20",
          minDay: options.minDay ?? null,
          maxDay: options.maxDay ?? null,
          locale: options.locale ?? enUS,
          localeTag: options.localeTag ?? "en-US",
          "onUpdate:viewDay": (day: string) => {
            viewDay.value = day;
            onViewDay(day);
          },
          onSelect: (day: string) => {
            if (options.bindModelValue !== false) modelValue.value = day;
            onSelect(day);
          },
          onSelectRange: (value: [string, string | null]) => {
            if (options.bindModelValue !== false) modelValue.value = value;
            onSelectRange(value);
          },
        });
    },
  });

  render(Parent);

  return { onViewDay, onSelect, onSelectRange };
}

function getDay(day: string): HTMLElement {
  const element = document.querySelector<HTMLElement>(
    `.mt-datepicker-calendar__day[data-value="${day}"]`,
  );
  if (!element) throw new Error(`The day ${day} is not shown`);
  return element;
}

function getWeekdays(): string[] {
  return Array.from(document.querySelectorAll(".mt-datepicker-calendar__weekday")).map(
    (element) => element.textContent?.trim() ?? "",
  );
}

function getMonthToggle() {
  return screen.getByTestId("mt-datepicker-calendar__month-toggle");
}

function getYearToggle() {
  return screen.getByTestId("mt-datepicker-calendar__year-toggle");
}

function getOverlay(): HTMLElement | null {
  return document.querySelector<HTMLElement>(".mt-datepicker-calendar__overlay");
}

afterEach(() => {
  cleanup();
});

describe("mt-datepicker-calendar", () => {
  describe("names", () => {
    it.each([
      ["en-US", enUS, ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"]],
      ["de", de, ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"]],
      ["fr", fr, ["lu", "ma", "me", "je", "ve", "sa", "di"]],
    ])("shows the weekdays from Monday in %s", (localeTag, locale, expected) => {
      renderCalendar({ locale, localeTag });

      expect(getWeekdays()).toEqual(expected);
    });

    it.each([
      ["en-US", enUS, "Mar"],
      ["de", de, "Mär"],
      ["fr", fr, "mars"],
    ])("shows the short month name and the year in %s", (localeTag, locale, expected) => {
      renderCalendar({ locale, localeTag, viewDay: "2024-03-15" });

      expect(getMonthToggle()).toHaveTextContent(new RegExp(`^${expected}$`));
      expect(getYearToggle()).toHaveTextContent(/^2024$/);
    });

    it("starts the weeks on Monday", () => {
      renderCalendar({ viewDay: "2024-03-15" });

      // March 1st, 2024 is a Friday, so the first week starts on Monday, February 26th.
      const firstDay = document.querySelector(".mt-datepicker-calendar__day");
      expect(firstDay).toHaveAttribute("data-value", "2024-02-26");
    });
  });

  describe("shown month", () => {
    it("shows the month of the view day", () => {
      renderCalendar({ viewDay: "2023-11-02" });

      expect(getMonthToggle()).toHaveTextContent("Nov");
      expect(getYearToggle()).toHaveTextContent("2023");
      expect(getDay("2023-11-30")).not.toHaveAttribute("data-outside-view");
    });

    it("goes to the previous and the next month", async () => {
      const { onViewDay } = renderCalendar({ viewDay: "2024-01-15" });

      await userEvent.click(screen.getByRole("button", { name: "Previous month" }));
      expect(onViewDay).toHaveBeenLastCalledWith("2023-12-15");
      expect(getMonthToggle()).toHaveTextContent("Dec");
      expect(getYearToggle()).toHaveTextContent("2023");

      await userEvent.click(screen.getByRole("button", { name: "Next month" }));
      await userEvent.click(screen.getByRole("button", { name: "Next month" }));
      expect(onViewDay).toHaveBeenLastCalledWith("2024-02-15");
      expect(getMonthToggle()).toHaveTextContent("Feb");
    });

    it("cannot go to a month before the first or after the last day that can be picked", () => {
      renderCalendar({ viewDay: "2024-03-15", minDay: "2024-03-01", maxDay: "2024-03-31" });

      expect(screen.getByRole("button", { name: "Previous month" })).toBeDisabled();
      expect(screen.getByRole("button", { name: "Next month" })).toBeDisabled();
    });

    it("shows a picked month", async () => {
      const { onViewDay } = renderCalendar({ viewDay: "2024-03-15" });

      await userEvent.click(getMonthToggle());
      const overlay = getOverlay();
      expect(overlay).not.toBeNull();
      const months = within(overlay!).getAllByRole("button");
      expect(months.map((month) => month.textContent?.trim())).toEqual([
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ]);

      await userEvent.click(within(overlay!).getByRole("button", { name: "Jun" }));

      expect(onViewDay).toHaveBeenLastCalledWith("2024-06-15");
      expect(getMonthToggle()).toHaveTextContent("Jun");
      expect(getOverlay()).toBeNull();
    });

    it("shows the month names in the language of the locale", async () => {
      renderCalendar({ locale: de, localeTag: "de" });

      await userEvent.click(getMonthToggle());

      expect(within(getOverlay()!).getByRole("button", { name: "Mär" })).toBeVisible();
    });

    it("shows a picked year", async () => {
      const { onViewDay } = renderCalendar({ viewDay: "2024-03-15" });

      await userEvent.click(getYearToggle());
      const overlay = getOverlay()!;
      expect(within(overlay).getByRole("button", { name: "1924" })).toBeVisible();
      expect(within(overlay).getByRole("button", { name: "2124" })).toBeVisible();

      await userEvent.click(within(overlay).getByRole("button", { name: "2030" }));

      expect(onViewDay).toHaveBeenLastCalledWith("2030-03-15");
      expect(getYearToggle()).toHaveTextContent("2030");
      expect(getMonthToggle()).toHaveTextContent("Mar");
      expect(getOverlay()).toBeNull();
    });

    it("keeps the day in the month when a shorter month is picked", async () => {
      const { onViewDay } = renderCalendar({ viewDay: "2024-01-31" });

      await userEvent.click(getMonthToggle());
      await userEvent.click(within(getOverlay()!).getByRole("button", { name: "Feb" }));

      expect(onViewDay).toHaveBeenLastCalledWith("2024-02-29");
    });

    it("opens only one list at a time", async () => {
      renderCalendar();

      await userEvent.click(getMonthToggle());
      await userEvent.click(getYearToggle());

      expect(document.querySelectorAll(".mt-datepicker-calendar__overlay")).toHaveLength(1);
      expect(within(getOverlay()!).getByRole("button", { name: "2024" })).toBeVisible();
    });

    it("closes a list when its toggle is clicked again", async () => {
      renderCalendar();

      await userEvent.click(getYearToggle());
      await userEvent.click(getYearToggle());

      expect(getOverlay()).toBeNull();
    });

    it("closes a list with Escape", async () => {
      renderCalendar();

      await userEvent.click(getMonthToggle());
      await userEvent.keyboard("{Escape}");

      expect(getOverlay()).toBeNull();
      expect(getMonthToggle()).toHaveFocus();
    });
  });

  describe("single day", () => {
    it("emits the picked day", async () => {
      const { onSelect } = renderCalendar({ viewDay: "2024-03-15" });

      await userEvent.click(getDay("2024-03-07"));

      expect(onSelect).toHaveBeenCalledTimes(1);
      expect(onSelect).toHaveBeenCalledWith("2024-03-07");
    });

    it("emits again when the selected day is picked again", async () => {
      const { onSelect } = renderCalendar({ modelValue: "2024-03-07", viewDay: "2024-03-07" });

      expect(getDay("2024-03-07")).toHaveAttribute("data-selected");

      await userEvent.click(getDay("2024-03-07"));
      await userEvent.click(getDay("2024-03-07"));

      expect(onSelect).toHaveBeenCalledTimes(2);
      expect(onSelect).toHaveBeenLastCalledWith("2024-03-07");
      expect(getDay("2024-03-07")).toHaveAttribute("data-selected");
    });

    it("can pick every day of the shown month", async () => {
      const { onSelect } = renderCalendar({ viewDay: "2024-02-10" });

      for (let day = 1; day <= 29; day++) {
        const value = `2024-02-${String(day).padStart(2, "0")}`;
        await userEvent.click(getDay(value));
        expect(onSelect).toHaveBeenLastCalledWith(value);
      }

      expect(onSelect).toHaveBeenCalledTimes(29);
    });

    it("picks a day with the keyboard", async () => {
      const { onSelect } = renderCalendar({ viewDay: "2024-03-15" });

      getDay("2024-03-15").focus();
      await userEvent.keyboard("{Enter}");

      expect(onSelect).toHaveBeenCalledTimes(1);
      expect(onSelect).toHaveBeenCalledWith("2024-03-15");
    });

    it("moves to the next month with the arrow keys", async () => {
      const { onViewDay } = renderCalendar({ viewDay: "2024-03-31" });

      getDay("2024-03-31").focus();
      await userEvent.keyboard("{ArrowRight}");

      expect(onViewDay).toHaveBeenLastCalledWith("2024-04-01");
      expect(getMonthToggle()).toHaveTextContent("Apr");
      expect(getDay("2024-04-01")).toHaveFocus();
    });

    it.each([true, false])(
      "emits another day when a day is already selected (value passed back: %s)",
      async (bindModelValue) => {
        const { onSelect } = renderCalendar({
          modelValue: "2024-07-10",
          viewDay: "2024-07-10",
          bindModelValue,
        });

        await userEvent.click(getDay("2024-07-15"));
        await userEvent.click(getDay("2024-07-03"));

        expect(onSelect.mock.calls).toEqual([["2024-07-15"], ["2024-07-03"]]);
      },
    );

    it.each([true, false])(
      "emits a day in a month and year picked from the lists while a day is selected (value passed back: %s)",
      async (bindModelValue) => {
        const { onSelect } = renderCalendar({
          modelValue: "2000-01-10",
          viewDay: "2000-01-10",
          bindModelValue,
        });

        await userEvent.click(getYearToggle());
        await userEvent.click(within(getOverlay()!).getByRole("button", { name: "2024" }));
        await userEvent.click(getMonthToggle());
        await userEvent.click(within(getOverlay()!).getByRole("button", { name: "Jul" }));
        await userEvent.click(getDay("2024-07-15"));

        expect(onSelect.mock.calls).toEqual([["2024-07-15"]]);

        await userEvent.click(screen.getByRole("button", { name: "Next month" }));
        await userEvent.click(getDay("2024-08-02"));

        expect(onSelect.mock.calls).toEqual([["2024-07-15"], ["2024-08-02"]]);
      },
    );

    it("does not let disabled days be picked", async () => {
      const { onSelect } = renderCalendar({
        viewDay: "2024-03-15",
        minDay: "2024-03-10",
        maxDay: "2024-03-20",
      });

      expect(getDay("2024-03-09")).toHaveAttribute("aria-disabled", "true");
      expect(getDay("2024-03-21")).toHaveAttribute("aria-disabled", "true");
      expect(getDay("2024-03-10")).not.toHaveAttribute("aria-disabled");
      expect(getDay("2024-03-20")).not.toHaveAttribute("aria-disabled");

      await userEvent.click(getDay("2024-03-09"));
      await userEvent.click(getDay("2024-03-21"));
      expect(onSelect).not.toHaveBeenCalled();

      await userEvent.click(getDay("2024-03-10"));
      await userEvent.click(getDay("2024-03-20"));
      expect(onSelect.mock.calls).toEqual([["2024-03-10"], ["2024-03-20"]]);
    });

    it("marks the today day that it is given", () => {
      renderCalendar({ viewDay: "2024-03-15", today: "2024-03-05" });

      const marked = document.querySelectorAll("[data-mt-today]");
      expect(marked).toHaveLength(1);
      expect(marked[0]).toHaveAttribute("data-value", "2024-03-05");
    });

    it("does not take the focus when it is shown", () => {
      renderCalendar();

      expect(document.body).toHaveFocus();
    });
  });

  describe("range", () => {
    it("emits the start, then the start and the end", async () => {
      const { onSelectRange } = renderCalendar({ range: true, viewDay: "2024-03-15" });

      await userEvent.click(getDay("2024-03-05"));
      expect(onSelectRange).toHaveBeenLastCalledWith(["2024-03-05", null]);

      await userEvent.click(getDay("2024-03-12"));
      expect(onSelectRange).toHaveBeenLastCalledWith(["2024-03-05", "2024-03-12"]);
      expect(onSelectRange).toHaveBeenCalledTimes(2);

      expect(getDay("2024-03-05")).toHaveAttribute("data-selection-start");
      expect(getDay("2024-03-08")).toHaveAttribute("data-selected");
      expect(getDay("2024-03-12")).toHaveAttribute("data-selection-end");
    });

    it("orders the start and the end", async () => {
      const { onSelectRange } = renderCalendar({ range: true, viewDay: "2024-03-15" });

      await userEvent.click(getDay("2024-03-20"));
      await userEvent.click(getDay("2024-03-02"));

      expect(onSelectRange.mock.calls).toEqual([
        [["2024-03-20", null]],
        [["2024-03-02", "2024-03-20"]],
      ]);
    });

    it("emits a one-day range when the start is picked again", async () => {
      const { onSelectRange } = renderCalendar({ range: true, viewDay: "2024-03-15" });

      await userEvent.click(getDay("2024-03-08"));
      await userEvent.click(getDay("2024-03-08"));

      expect(onSelectRange).toHaveBeenLastCalledWith(["2024-03-08", "2024-03-08"]);
    });

    it("starts a new range after a complete one", async () => {
      const { onSelectRange } = renderCalendar({
        range: true,
        modelValue: ["2024-03-05", "2024-03-12"],
        viewDay: "2024-03-15",
      });

      await userEvent.click(getDay("2024-03-12"));

      expect(onSelectRange).toHaveBeenLastCalledWith(["2024-03-12", null]);
    });

    it("finishes a range when the parent does not pass the start back", async () => {
      const { onSelectRange } = renderCalendar({
        range: true,
        viewDay: "2024-03-15",
        bindModelValue: false,
      });

      await userEvent.click(getDay("2024-03-05"));
      await userEvent.click(getDay("2024-03-12"));

      expect(onSelectRange.mock.calls).toEqual([
        [["2024-03-05", null]],
        [["2024-03-05", "2024-03-12"]],
      ]);
    });

    it("does not let disabled days be picked", async () => {
      const { onSelectRange } = renderCalendar({
        range: true,
        viewDay: "2024-03-15",
        minDay: "2024-03-10",
      });

      await userEvent.click(getDay("2024-03-09"));

      expect(getDay("2024-03-09")).toHaveAttribute("aria-disabled", "true");
      expect(onSelectRange).not.toHaveBeenCalled();
    });

    it("marks the today day that it is given", () => {
      renderCalendar({ range: true, today: "2024-03-05" });

      expect(getDay("2024-03-05")).toHaveAttribute("data-mt-today", "");
      expect(document.querySelectorAll("[data-mt-today]")).toHaveLength(1);
    });
  });
});
