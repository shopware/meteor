import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/vue";
import MtDatepicker from "./mt-datepicker.vue";
import userEvent from "@testing-library/user-event";
import { waitUntil } from "@/_internal/test-helper";

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

  it("shows the timezone when displaying only the time", async () => {
    // ARRANGE
    await render(MtDatepicker, {
      props: {
        dateType: "time",
        modelValue: "14:30",
      },
    });

    // ASSERT
    expect(screen.getByTestId("time-zone-hint")).toBeVisible();
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

  it("converts time correctly when timezone changes", async () => {
    // ARRANGE - Set a specific UTC time
    const { rerender } = await render(MtDatepicker, {
      props: {
        dateType: "datetime",
        timeZone: "UTC",
        modelValue: new Date("2024-11-13T10:30:00Z"),
      },
    });

    // ACT - Change timezone to America/New_York (UTC-5 in November)
    await rerender({
      dateType: "datetime",
      timeZone: "America/New_York",
    });

    // ASSERT - 10:30 UTC should become 05:30 EST
    const input = document.querySelector(".dp__input") as HTMLInputElement;
    expect(input.value).toBe("2024/11/13, 05:30");
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
    await userEvent.click(document.querySelector('[data-test-id="15"]') as HTMLElement);
    await waitUntil(() => !document.querySelector(".dp__overlay"));
    await waitUntil(() =>
      expect(
        document.querySelector('[data-test-id="hours-toggle-overlay-btn-0"]'),
      ).toHaveTextContent("15"),
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
    await userEvent.click(document.querySelector('[data-test-id="Okt"]') as HTMLElement);
    await waitUntil(() => !document.querySelector(".dp__overlay"));
    expect(document.querySelector('[data-test-id="month-toggle-overlay-0"]')).toHaveTextContent(
      "Okt",
    );

    // Set the year
    await userEvent.click(
      document.querySelector('[data-test-id="year-toggle-overlay-0"]') as HTMLElement,
    );
    await waitUntil(() => document.querySelector(".dp__overlay") !== null);
    await userEvent.click(document.querySelector('[data-test-id="2025"]') as HTMLElement);
    await waitUntil(() => !document.querySelector(".dp__overlay"));

    // Set the day
    await waitUntil(() => document.getElementById("2025-10-10") !== null);
    const dayElement = document.getElementById("2025-10-10") as HTMLElement;
    await userEvent.click(dayElement);

    // Wait and check if menu closed
    await new Promise((resolve) => setTimeout(resolve, 100));
    await waitUntil(() => !document.querySelector(".dp__menu"));

    // ASSERT - The handler was called with the correct date "2025-10-10T19:00:00.000Z"
    // The input is "2025-10-10 15:00" and timeZone is "America/New_York" so the utcOffset is "-04:00"
    expect(handler).toHaveBeenLastCalledWith("2025-10-10T19:00:00.000Z");
  });
});
