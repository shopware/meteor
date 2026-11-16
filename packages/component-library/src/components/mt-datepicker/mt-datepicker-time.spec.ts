import { defineComponent, h, ref } from "vue";
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/vue";
import userEvent from "@testing-library/user-event";
import MtDatepickerTime from "./mt-datepicker-time.vue";

type Time = { hours: number; minutes: number };

type Options = {
  is24?: boolean;
  hourIncrement?: number;
  minuteIncrement?: number;
};

/**
 * Shows the time part with a parent that keeps the value, like a real v-model.
 * Returns every value the time part sent, so tests can check what it emitted.
 */
function renderTime(time: string, options: Options = {}) {
  const [hours, minutes] = time.split(":").map(Number);
  const emitted: Time[] = [];

  const Host = defineComponent({
    setup() {
      const value = ref<Time>({ hours, minutes });

      return () =>
        h(MtDatepickerTime, {
          ...options,
          modelValue: value.value,
          "onUpdate:modelValue": (next: Time) => {
            emitted.push(next);
            value.value = next;
          },
        });
    },
  });

  render(Host);

  return { emitted, user: userEvent.setup() };
}

function getToggle(unit: "hours" | "minutes") {
  return screen.getByTestId(`mt-datepicker-time__${unit}-toggle`);
}

function getShownTime() {
  return `${getToggle("hours").textContent?.trim()}:${getToggle("minutes").textContent?.trim()}`;
}

function getOverlay() {
  return document.querySelector(".mt-datepicker-time__overlay");
}

function getShownOptions() {
  return Array.from(document.querySelectorAll(".mt-datepicker-time__option")).map((option) =>
    option.textContent?.trim(),
  );
}

function getOption(label: string) {
  const option = Array.from(
    document.querySelectorAll<HTMLElement>(".mt-datepicker-time__option"),
  ).find((element) => element.textContent?.trim() === label);
  if (!option) throw new Error(`The list has no option "${label}"`);

  return option;
}

function getAmPmSwitch() {
  return document.querySelector<HTMLElement>(".mt-datepicker-time__am-pm");
}

const pad = (value: number) => String(value).padStart(2, "0");

describe("mt-datepicker-time", () => {
  describe("on a 24-hour clock", () => {
    it("shows the hours and minutes with two digits", () => {
      renderTime("13:05");

      expect(getShownTime()).toBe("13:05");
    });

    it("shows midnight as 00", () => {
      renderTime("00:00");

      expect(getShownTime()).toBe("00:00");
    });

    it("has no AM/PM switch", () => {
      renderTime("13:05");

      expect(getAmPmSwitch()).toBeNull();
    });

    it("labels the arrows for screen readers", () => {
      renderTime("13:05");

      expect(screen.getByRole("button", { name: "Increase hours" })).toBe(
        screen.getByTestId("mt-datepicker-time__hours-increase"),
      );
      expect(screen.getByRole("button", { name: "Decrease hours" })).toBe(
        screen.getByTestId("mt-datepicker-time__hours-decrease"),
      );
      expect(screen.getByRole("button", { name: "Increase minutes" })).toBe(
        screen.getByTestId("mt-datepicker-time__minutes-increase"),
      );
      expect(screen.getByRole("button", { name: "Decrease minutes" })).toBe(
        screen.getByTestId("mt-datepicker-time__minutes-decrease"),
      );
    });

    it("does not submit a surrounding form with any of its buttons", async () => {
      const { user } = renderTime("13:05");
      await user.click(getToggle("hours"));

      for (const button of document.querySelectorAll(".mt-datepicker-time button")) {
        expect(button).toHaveAttribute("type", "button");
      }
    });
  });

  describe("arrows", () => {
    it("moves the hours and then the minutes up by one", async () => {
      const { user, emitted } = renderTime("07:05");

      await user.click(screen.getByTestId("mt-datepicker-time__hours-increase"));
      expect(getShownTime()).toBe("08:05");

      await user.click(screen.getByTestId("mt-datepicker-time__minutes-increase"));
      expect(getShownTime()).toBe("08:06");

      expect(emitted).toEqual([
        { hours: 8, minutes: 5 },
        { hours: 8, minutes: 6 },
      ]);
    });

    it("moves the hours and minutes down by one", async () => {
      const { user, emitted } = renderTime("07:05");

      await user.click(screen.getByTestId("mt-datepicker-time__hours-decrease"));
      await user.click(screen.getByTestId("mt-datepicker-time__minutes-decrease"));

      expect(getShownTime()).toBe("06:04");
      expect(emitted.at(-1)).toEqual({ hours: 6, minutes: 4 });
    });

    it("goes from 23 to 00 hours and back", async () => {
      const { user, emitted } = renderTime("23:30");

      await user.click(screen.getByTestId("mt-datepicker-time__hours-increase"));
      expect(getShownTime()).toBe("00:30");

      await user.click(screen.getByTestId("mt-datepicker-time__hours-decrease"));
      expect(getShownTime()).toBe("23:30");

      expect(emitted).toEqual([
        { hours: 0, minutes: 30 },
        { hours: 23, minutes: 30 },
      ]);
    });

    it("goes from 59 to 00 minutes and back without changing the hour", async () => {
      const { user, emitted } = renderTime("10:59");

      await user.click(screen.getByTestId("mt-datepicker-time__minutes-increase"));
      expect(getShownTime()).toBe("10:00");

      await user.click(screen.getByTestId("mt-datepicker-time__minutes-decrease"));
      expect(getShownTime()).toBe("10:59");

      expect(emitted).toEqual([
        { hours: 10, minutes: 0 },
        { hours: 10, minutes: 59 },
      ]);
    });

    it("moves by the set hour and minute steps", async () => {
      const { user } = renderTime("22:50", { hourIncrement: 3, minuteIncrement: 15 });

      await user.click(screen.getByTestId("mt-datepicker-time__hours-increase"));
      expect(getShownTime()).toBe("01:50");

      await user.click(screen.getByTestId("mt-datepicker-time__minutes-increase"));
      expect(getShownTime()).toBe("01:05");

      await user.click(screen.getByTestId("mt-datepicker-time__hours-decrease"));
      expect(getShownTime()).toBe("22:05");

      await user.click(screen.getByTestId("mt-datepicker-time__minutes-decrease"));
      expect(getShownTime()).toBe("22:50");
    });
  });

  describe("lists", () => {
    it("offers every hour of the day", async () => {
      const { user } = renderTime("13:05");

      await user.click(getToggle("hours"));

      expect(getShownOptions()).toEqual(Array.from({ length: 24 }, (_, hour) => pad(hour)));
    });

    it("offers every minute of the hour", async () => {
      const { user } = renderTime("13:05");

      await user.click(getToggle("minutes"));

      expect(getShownOptions()).toEqual(Array.from({ length: 60 }, (_, minute) => pad(minute)));
    });

    it("offers hours and minutes in the set steps", async () => {
      const { user } = renderTime("13:05", { hourIncrement: 2, minuteIncrement: 15 });

      await user.click(getToggle("hours"));
      expect(getShownOptions()).toEqual(Array.from({ length: 12 }, (_, index) => pad(index * 2)));

      await user.click(getOption("00"));
      await user.click(getToggle("minutes"));
      expect(getShownOptions()).toEqual(["00", "15", "30", "45"]);
    });

    it("sets the hour picked from the list and closes it", async () => {
      const { user, emitted } = renderTime("13:05");

      await user.click(getToggle("hours"));
      await user.click(getOption("08"));

      expect(getShownTime()).toBe("08:05");
      expect(emitted).toEqual([{ hours: 8, minutes: 5 }]);
      expect(getOverlay()).toBeNull();
    });

    it("sets the minute picked from the list and closes it", async () => {
      const { user, emitted } = renderTime("13:05");

      await user.click(getToggle("minutes"));
      await user.click(getOption("42"));

      expect(getShownTime()).toBe("13:42");
      expect(emitted).toEqual([{ hours: 13, minutes: 42 }]);
      expect(getOverlay()).toBeNull();
    });

    it("shows no list until a toggle is clicked", () => {
      renderTime("13:05");

      expect(getOverlay()).toBeNull();
    });

    it("shows only one list at a time", async () => {
      const { user } = renderTime("13:05");

      await user.click(getToggle("hours"));
      expect(getShownOptions()).toHaveLength(24);

      await user.click(getToggle("minutes"));

      expect(document.querySelectorAll(".mt-datepicker-time__overlay")).toHaveLength(1);
      expect(getShownOptions()).toHaveLength(60);
    });

    it("closes the list with Escape without changing the time", async () => {
      const { user, emitted } = renderTime("13:05");

      await user.click(getToggle("hours"));
      await user.keyboard("{Escape}");

      expect(getOverlay()).toBeNull();
      expect(emitted).toEqual([]);
    });

    it("closes the list with its close button without changing the time", async () => {
      const { user, emitted } = renderTime("13:05");

      await user.click(getToggle("minutes"));
      await user.click(screen.getByRole("button", { name: "Close" }));

      expect(getOverlay()).toBeNull();
      expect(emitted).toEqual([]);
    });
  });

  describe("on a 12-hour clock", () => {
    it.each([
      ["13:05", "01:05", "PM"],
      ["00:00", "12:00", "AM"],
      ["12:00", "12:00", "PM"],
      ["11:59", "11:59", "AM"],
      ["23:30", "11:30", "PM"],
    ])("shows %s as %s %s", (time, shown, halfOfDay) => {
      renderTime(time, { is24: false });

      expect(getShownTime()).toBe(shown);
      expect(getAmPmSwitch()).toHaveTextContent(halfOfDay);
    });

    it("moves the time by 12 hours with the AM/PM switch", async () => {
      const { user, emitted } = renderTime("13:30", { is24: false });

      await user.click(getAmPmSwitch()!);
      expect(getShownTime()).toBe("01:30");
      expect(getAmPmSwitch()).toHaveTextContent("AM");

      await user.click(getAmPmSwitch()!);
      expect(getAmPmSwitch()).toHaveTextContent("PM");

      expect(emitted).toEqual([
        { hours: 1, minutes: 30 },
        { hours: 13, minutes: 30 },
      ]);
    });

    it("offers the 12 hours of the day's half, starting at 12", async () => {
      const { user } = renderTime("13:30", { is24: false });

      await user.click(getToggle("hours"));

      expect(getShownOptions()).toEqual([
        "12",
        "01",
        "02",
        "03",
        "04",
        "05",
        "06",
        "07",
        "08",
        "09",
        "10",
        "11",
      ]);
    });

    it("offers the hours in the set steps", async () => {
      const { user } = renderTime("08:00", { is24: false, hourIncrement: 3 });

      await user.click(getToggle("hours"));

      expect(getShownOptions()).toEqual(["12", "03", "06", "09"]);
    });

    it("keeps PM when an hour is picked in the afternoon", async () => {
      const { user, emitted } = renderTime("13:30", { is24: false });

      await user.click(getToggle("hours"));
      await user.click(getOption("05"));

      expect(getShownTime()).toBe("05:30");
      expect(getAmPmSwitch()).toHaveTextContent("PM");
      expect(emitted).toEqual([{ hours: 17, minutes: 30 }]);
    });

    it("keeps AM when 12 is picked in the morning", async () => {
      const { user, emitted } = renderTime("01:30", { is24: false });

      await user.click(getToggle("hours"));
      await user.click(getOption("12"));

      expect(getShownTime()).toBe("12:30");
      expect(getAmPmSwitch()).toHaveTextContent("AM");
      expect(emitted).toEqual([{ hours: 0, minutes: 30 }]);
    });

    it("still emits the time on a 24-hour clock from the arrows", async () => {
      const { user, emitted } = renderTime("11:00", { is24: false });

      await user.click(screen.getByTestId("mt-datepicker-time__hours-increase"));

      expect(getShownTime()).toBe("12:00");
      expect(getAmPmSwitch()).toHaveTextContent("PM");
      expect(emitted).toEqual([{ hours: 12, minutes: 0 }]);
    });
  });
});
