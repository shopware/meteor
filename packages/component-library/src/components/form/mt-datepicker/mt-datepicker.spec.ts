import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/vue";
import MtDatepicker from "./mt-datepicker.vue";
import userEvent from "@testing-library/user-event";
import { waitUntil } from "@/_internal/test-helper";
import { getByRole } from "@storybook/test";

describe("mt-datepicker", () => {
  beforeEach(() => {
    // Set system time to ensure consistent test results
    vi.setSystemTime(new Date("2024-07-15T09:00:00Z"));
  });
  it("is enabled by default", () => {
    // ARRANGE
    render(MtDatepicker);

    // ASSERT
    expect(screen.getByRole("textbox")).toBeEnabled();
  });

  it("can be disabled", () => {
    // ARRANGE
    render(MtDatepicker, {
      props: {
        disabled: true,
      },
    });

    // ASSERT
    expect(screen.getByRole("textbox")).toBeDisabled();
  });

  it("shows the date format as the placeholder when no placeholder is provided", () => {
    // ARRANGE
    render(MtDatepicker);

    // ASSERT
    expect(screen.getByRole("textbox")).toHaveAttribute("placeholder", "Y-m-d ...");
  });

  it("shows the placeholder when provided", () => {
    // ARRANGE
    render(MtDatepicker, {
      props: {
        placeholder: "Stop! Hammertime!",
      },
    });

    // ASSERT
    expect(screen.getByRole("textbox")).toHaveAttribute("placeholder", "Stop! Hammertime!");
  });

  it("does not show the timezone when it is configured for date only", () => {
    // ARRANGE
    render(MtDatepicker, {
      props: {
        dateType: "date",
        timeZone: "Europe/Berlin",
      },
    });

    // ASSERT
    expect(screen.queryByTestId("time-zone-hint")).not.toBeInTheDocument();
  });

  it("does not show the timezone when displaying only the time", async () => {
    // ARRANGE
    await render(MtDatepicker, {
      props: {
        dateType: "time",
        modelValue: "14:30",
      },
    });

    // ASSERT
    expect(screen.queryByTestId("time-zone-hint")).not.toBeInTheDocument();
  });

  it("shows the timezone when displaying a datetime", async () => {
    // ARRANGE
    await render(MtDatepicker, {
      props: {
        dateType: "datetime",
        modelValue: "2024-03-20T14:30:00Z",
      },
    });

    // ASSERT
    expect(screen.getByTestId("time-zone-hint")).toBeVisible();
  });

  it("shows the time only when providing a time and in time mode", async () => {
    // ARRANGE
    await render(MtDatepicker, {
      props: {
        dateType: "time",
        modelValue: "14:30",
      },
    });

    // ASSERT
    expect(screen.getByRole("textbox")).toHaveValue("14:30");
  });

  it("shows the time only when ISO string is provided and in time mode", async () => {
    // ARRANGE
    await render(MtDatepicker, {
      props: {
        dateType: "time",
        modelValue: "2024-03-20T14:30:00Z",
      },
    });

    // ASSERT
    expect(screen.getByRole("textbox")).toHaveValue("14:30");
  });

  it("clears the input when clicking the clear button", async () => {
    // ARRANGE
    const handler = vi.fn();

    await render(MtDatepicker, {
      props: {
        modelValue: "2024-03-20T14:30:00Z",
        "onUpdate:modelValue": handler,
      },
    });

    // ACT
    await userEvent.click(screen.getByRole("button", { name: "Clear value" }));

    // ASSERT
    expect(screen.getByRole("textbox")).toHaveValue("");
    expect(handler).toHaveBeenCalledExactlyOnceWith(null);
  });

  it("should add has-error class to wrapper when error prop is provided", () => {
    // ARRANGE
    const { container } = render(MtDatepicker, {
      props: {
        error: {
          code: 500,
          detail: "Error message",
        },
      },
    });

    // ASSERT
    expect(container.firstElementChild).toHaveClass("has-error");
    expect(screen.getByText("Error message")).toBeInTheDocument();
  });

  it("should accept minDate as ISO string", () => {
    // ARRANGE
    const minDate = "2024-03-20T00:00:00.000Z";
    render(MtDatepicker, {
      props: {
        dateType: "date",
        locale: "en-US",
        minDate: minDate,
      },
    });

    // ASSERT - Check that the component renders without errors when minDate is provided
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  it("emits date when value when typed into input", async () => {
    // ARRANGE
    const handler = vi.fn();
    render(MtDatepicker, {
      props: {
        dateType: "date",
        textInput: true,
        timeZone: "UTC",
        "onUpdate:modelValue": handler,
      },
    });

    const input = screen.getByRole("textbox");

    // ACT
    await userEvent.clear(input);
    await userEvent.type(input, "2025/01/01");
    await userEvent.keyboard("{enter}");

    // ASSERT
    expect(handler).toHaveBeenLastCalledWith("2025-01-01T00:00:00.000Z");
  });

  it("should accept an ISO string as modelValue", async () => {
    // ARRANGE
    const handler = vi.fn();
    await render(MtDatepicker, {
      props: {
        dateType: "datetime",
        modelValue: "2024-03-20T14:30:00+01:00",
        timeZone: "UTC",
        "onUpdate:modelValue": handler,
      },
    });

    // ASSERT
    expect(screen.getByRole("textbox")).toHaveValue("2024/03/20, 13:30");
  });

  it("should accept a date object as modelValue", async () => {
    const date = new Date("2024-03-20T14:30:00+01:00");

    // ARRANGE
    await render(MtDatepicker, {
      props: {
        dateType: "datetime",
        modelValue: date,
      },
    });

    // ASSERT
    expect(screen.getByRole("textbox")).toHaveValue("2024/03/20, 13:30");
  });

  it("should accept ISO string array as modelValue", async () => {
    // ARRANGE
    const handler = vi.fn();
    await render(MtDatepicker, {
      props: {
        dateType: "datetime",
        range: true,
        modelValue: ["2024-03-20T14:30:00+01:00", "2024-03-21T14:30:00+01:00"],
        timeZone: "UTC",
        "onUpdate:modelValue": handler,
      },
    });

    // ASSERT
    expect(screen.getByRole("textbox")).toHaveValue("2024/03/20, 13:30 - 2024/03/21, 13:30");
  });

  it("converts time correctly when timezone changes", async () => {
    // ARRANGE - Set a specific UTC time
    const { rerender } = await render(MtDatepicker, {
      props: {
        dateType: "datetime",
        timeZone: "UTC",
        modelValue: "2024-12-31T13:00:00Z",
      },
    });

    // ACT - Change timezone to America/New_York (UTC-5 in November)
    await rerender({
      dateType: "datetime",
      timeZone: "Australia/Sydney",
    });

    // ASSERT - 10:30 UTC should become 05:30 EST
    const input = document.querySelector(".dp__input") as HTMLInputElement;
    expect(input.value).toBe("2025/01/01, 00:00");
  });

  it("should emit an iso string with the correct converted time", async () => {
    const handler = vi.fn();
    // ARRANGE
    render(MtDatepicker, {
      props: {
        dateType: "datetime",
        timeZone: "America/New_York",
        modelValue: "2023-07-18T09:15:00.000Z",
        "onUpdate:modelValue": handler,
      },
    });

    // ACT - select a datetime
    await userEvent.click(screen.getByRole("textbox"));
    await waitUntil(() => document.getElementsByClassName("dp__menu").length > 0);
    await waitUntil(() => document.getElementsByClassName("dp__time_input") !== null);

    // Set the hours
    await userEvent.click(
      document.querySelector('[data-test-id="hours-toggle-overlay-btn-0"]') as HTMLElement,
    );
    await waitUntil(() => document.querySelector(".dp__overlay") !== null);
    await userEvent.click(document.querySelector('[data-test-id="00"]') as HTMLElement);
    await waitUntil(() => !document.querySelector(".dp__overlay"));
    await waitUntil(() =>
      expect(
        document.querySelector('[data-test-id="hours-toggle-overlay-btn-0"]'),
      ).toHaveTextContent("00"),
    );

    // Set the minutes
    await userEvent.click(
      document.querySelector('[data-test-id="minutes-toggle-overlay-btn-0"]') as HTMLElement,
    );
    await waitUntil(() => document.querySelector(".dp__overlay") !== null);
    await userEvent.click(document.querySelector('[data-test-id="00"]') as HTMLElement);
    await waitUntil(() => !document.querySelector(".dp__overlay"));
    expect(
      document.querySelector('[data-test-id="minutes-toggle-overlay-btn-0"]'),
    ).toHaveTextContent("00");

    // Set the month
    await userEvent.click(
      document.querySelector('[data-test-id="month-toggle-overlay-0"]') as HTMLElement,
    );
    await waitUntil(() => document.querySelector(".dp__overlay") !== null);
    await userEvent.click(document.querySelector('[data-test-id="Mär"]') as HTMLElement);
    await waitUntil(() => !document.querySelector(".dp__overlay"));
    expect(document.querySelector('[data-test-id="month-toggle-overlay-0"]')).toHaveTextContent(
      "Mär",
    );

    // Set the year
    await userEvent.click(
      document.querySelector('[data-test-id="year-toggle-overlay-0"]') as HTMLElement,
    );
    await waitUntil(() => document.querySelector(".dp__overlay") !== null);
    await userEvent.click(document.querySelector('[data-test-id="2025"]') as HTMLElement);
    await waitUntil(() => !document.querySelector(".dp__overlay"));

    // Set the day
    await waitUntil(() => document.getElementById("2025-03-15") !== null);
    const dayElement = document.getElementById("2025-03-15") as HTMLElement;
    await userEvent.click(dayElement);

    // Wait and check if menu closed
    await new Promise((resolve) => setTimeout(resolve, 100));
    await waitUntil(() => !document.querySelector(".dp__menu"));

    // ASSERT - The handler was called with the correct date "2025-03-15T04:00:00Z"
    // The input is "2025-03-15, 00:00" and timeZone is "America/New_York" so the utcOffset is "+04:00"
    expect(handler).toHaveBeenLastCalledWith("2025-03-15T04:00:00.000Z");
  });

  it("should emit iso string with the correct time", async () => {
    const handler = vi.fn();
    // ARRANGE
    render(MtDatepicker, {
      props: {
        dateType: "datetime",
        "onUpdate:modelValue": handler,
      },
    });

    // ACT - select a datetime
    await userEvent.click(screen.getByRole("textbox"));
    await waitUntil(() => document.getElementsByClassName("dp__menu").length > 0);
    await waitUntil(() => document.getElementsByClassName("dp__time_input") !== null);

    // Set the hours
    await userEvent.click(
      document.querySelector('[data-test-id="hours-toggle-overlay-btn-0"]') as HTMLElement,
    );
    await waitUntil(() => document.querySelector(".dp__overlay") !== null);
    await userEvent.click(document.querySelector('[data-test-id="08"]') as HTMLElement);
    await waitUntil(() => !document.querySelector(".dp__overlay"));
    await waitUntil(() =>
      expect(
        document.querySelector('[data-test-id="hours-toggle-overlay-btn-0"]'),
      ).toHaveTextContent("08"),
    );

    // Set the minutes
    await userEvent.click(
      document.querySelector('[data-test-id="minutes-toggle-overlay-btn-0"]') as HTMLElement,
    );
    await waitUntil(() => document.querySelector(".dp__overlay") !== null);
    await userEvent.click(document.querySelector('[data-test-id="05"]') as HTMLElement);
    await waitUntil(() => !document.querySelector(".dp__overlay"));
    expect(
      document.querySelector('[data-test-id="minutes-toggle-overlay-btn-0"]'),
    ).toHaveTextContent("05");

    // Set the month
    await userEvent.click(
      document.querySelector('[data-test-id="month-toggle-overlay-0"]') as HTMLElement,
    );
    await waitUntil(() => document.querySelector(".dp__overlay") !== null);
    await userEvent.click(document.querySelector('[data-test-id="Jan"]') as HTMLElement);
    await waitUntil(() => !document.querySelector(".dp__overlay"));
    expect(document.querySelector('[data-test-id="month-toggle-overlay-0"]')).toHaveTextContent(
      "Jan",
    );

    // Set the year
    await userEvent.click(
      document.querySelector('[data-test-id="year-toggle-overlay-0"]') as HTMLElement,
    );
    await waitUntil(() => document.querySelector(".dp__overlay") !== null);
    await userEvent.click(document.querySelector('[data-test-id="2025"]') as HTMLElement);
    await waitUntil(() => !document.querySelector(".dp__overlay"));

    // Set the day
    await waitUntil(() => document.getElementById("2025-01-01") !== null);
    const dayElement = document.getElementById("2025-01-01") as HTMLElement;
    await userEvent.click(dayElement);

    // Wait and check if menu closed
    await new Promise((resolve) => setTimeout(resolve, 100));
    await waitUntil(() => !document.querySelector(".dp__menu"));

    // ASSERT - The handler was called with the correct date
    // The input is "2025-01-01, 08:05" so the output should be  "2025-01-01T08:05:00.000Z"
    expect(handler).toHaveBeenLastCalledWith("2025-01-01T08:05:00.000Z");
  });

  it("should increment the hours overlay by the prop value", async () => {
    const incrementValue = 2;
    // ARRANGE
    render(MtDatepicker, {
      props: {
        dateType: "datetime",
        modelValue: "2023-07-18T09:15:00.000Z",
        hourIncrement: incrementValue,
      },
    });

    // ACT - select a datetime
    await userEvent.click(screen.getByRole("textbox"));
    await waitUntil(() => document.getElementsByClassName("dp__menu").length > 0);
    await waitUntil(() => document.getElementsByClassName("dp__time_input") !== null);

    // Set the hours
    await userEvent.click(
      document.querySelector('[data-test-id="hours-toggle-overlay-btn-0"]') as HTMLElement,
    );
    await waitUntil(() => document.querySelector(".dp__overlay") !== null);

    // Get an array of the overlay cell values
    const overlayCells = Array.from(document.getElementsByClassName("dp__overlay_cell")).map((el) =>
      parseInt(el.textContent || "0"),
    );

    // Check each value difference
    const allDifferencesMatch = overlayCells
      .slice(1)
      .every((value, index) => value - overlayCells[index] === incrementValue);

    // ASSERT - The differences between each consecutive pair should match the increment value
    expect(allDifferencesMatch).toBe(true);
  });

  it("should increment the minutes overlay by the prop value", async () => {
    const incrementValue = 4;
    // ARRANGE
    render(MtDatepicker, {
      props: {
        dateType: "datetime",
        modelValue: "2023-07-18T09:15:00.000Z",
        minuteIncrement: incrementValue,
      },
    });

    // ACT - select a datetime
    await userEvent.click(screen.getByRole("textbox"));
    await waitUntil(() => document.getElementsByClassName("dp__menu").length > 0);
    await waitUntil(() => document.getElementsByClassName("dp__time_input") !== null);

    // Set the minutes
    await userEvent.click(
      document.querySelector('[data-test-id="minutes-toggle-overlay-btn-0"]') as HTMLElement,
    );
    await waitUntil(() => document.querySelector(".dp__overlay") !== null);

    // Get an array of the overlay cell values
    const overlayCells = Array.from(document.getElementsByClassName("dp__overlay_cell")).map((el) =>
      parseInt(el.textContent || "0"),
    );

    // Check each value difference
    const allDifferencesMatch = overlayCells
      .slice(1)
      .every((value, index) => value - overlayCells[index] === incrementValue);

    // ASSERT - The differences between each consecutive pair should match the increment value
    expect(allDifferencesMatch).toBe(true);
  });
});
