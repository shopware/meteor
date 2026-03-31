import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/vue";
import MtDatepicker from "./mt-datepicker.vue";
import userEvent from "@testing-library/user-event";
import { waitUntil } from "@/_internal/test-helper";

describe("mt-datepicker", () => {
  beforeEach(() => {
    vi.setSystemTime(new Date("2024-07-15T09:00:00Z"));
  });
  it("is enabled by default", () => {
    render(MtDatepicker);

    expect(screen.getByRole("textbox")).toBeEnabled();
  });

  it("can be disabled", () => {
    render(MtDatepicker, {
      props: {
        disabled: true,
      },
    });

    expect(screen.getByRole("textbox")).toBeDisabled();
  });

  it("shows the date format as the placeholder when no placeholder is provided", () => {
    render(MtDatepicker);

    expect(screen.getByRole("textbox")).toHaveAttribute("placeholder", "Y-m-d ...");
  });

  it("shows the placeholder when provided", () => {
    render(MtDatepicker, {
      props: {
        placeholder: "Stop! Hammertime!",
      },
    });

    expect(screen.getByRole("textbox")).toHaveAttribute("placeholder", "Stop! Hammertime!");
  });

  it("does not show the timezone when it is configured for date only", () => {
    render(MtDatepicker, {
      props: {
        dateType: "date",
        timeZone: "Europe/Berlin",
      },
    });

    expect(screen.queryByTestId("time-zone-hint")).not.toBeInTheDocument();
  });

  it("does not show the timezone when displaying only the time", async () => {
    await render(MtDatepicker, {
      props: {
        dateType: "time",
        modelValue: "14:30",
      },
    });

    expect(screen.queryByTestId("time-zone-hint")).not.toBeInTheDocument();
  });

  it("shows the timezone when displaying a datetime", async () => {
    await render(MtDatepicker, {
      props: {
        dateType: "datetime",
        modelValue: "2024-03-20T14:30:00Z",
      },
    });

    expect(screen.getByTestId("time-zone-hint")).toBeVisible();
  });

  it("shows the time only when providing a time and in time mode", async () => {
    await render(MtDatepicker, {
      props: {
        dateType: "time",
        modelValue: "14:30",
      },
    });

    expect(screen.getByRole("textbox")).toHaveValue("14:30");
  });

  it("shows the time only when ISO string is provided and in time mode", async () => {
    await render(MtDatepicker, {
      props: {
        dateType: "time",
        modelValue: "2024-03-20T14:30:00Z",
      },
    });

    expect(screen.getByRole("textbox")).toHaveValue("14:30");
  });

  it("clears the input when clicking the clear button", async () => {
    const handler = vi.fn();

    await render(MtDatepicker, {
      props: {
        modelValue: "2024-03-20T14:30:00Z",
        "onUpdate:modelValue": handler,
      },
    });

    await userEvent.click(screen.getByRole("button", { name: "Clear value" }));

    expect(screen.getByRole("textbox")).toHaveValue("");
    expect(handler).toHaveBeenCalledExactlyOnceWith(null);
  });

  it("should add has-error class to wrapper when error prop is provided", () => {
    const { container } = render(MtDatepicker, {
      props: {
        error: {
          code: 500,
          detail: "Error message",
        },
      },
    });

    expect(container.firstElementChild).toHaveClass("has-error");
    expect(screen.getByText("Error message")).toBeInTheDocument();
  });

  it("should accept minDate as ISO string", () => {
    const minDate = "2024-03-20T00:00:00.000Z";
    render(MtDatepicker, {
      props: {
        dateType: "date",
        locale: "en-US",
        minDate: minDate,
      },
    });

    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  it("emits date when value when typed into input", async () => {
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

    await userEvent.clear(input);
    await userEvent.type(input, "2025/01/01");
    await userEvent.keyboard("{enter}");

    expect(handler).toHaveBeenLastCalledWith("2025-01-01T00:00:00.000Z");
  });

  it("should accept an ISO string as modelValue", async () => {
    const handler = vi.fn();
    await render(MtDatepicker, {
      props: {
        dateType: "datetime",
        modelValue: "2024-03-20T14:30:00+01:00",
        timeZone: "UTC",
        "onUpdate:modelValue": handler,
      },
    });

    expect(screen.getByRole("textbox")).toHaveValue("2024/03/20, 13:30");
  });

  it("should accept a date object as modelValue", async () => {
    const date = new Date("2024-03-20T14:30:00+01:00");

    await render(MtDatepicker, {
      props: {
        dateType: "datetime",
        modelValue: date,
      },
    });

    expect(screen.getByRole("textbox")).toHaveValue("2024/03/20, 13:30");
  });

  it("should accept ISO string array as modelValue", async () => {
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

    expect(screen.getByRole("textbox")).toHaveValue("2024/03/20, 13:30 - 2024/03/21, 13:30");
  });

  it("converts time correctly when timezone changes", async () => {
    const { rerender } = await render(MtDatepicker, {
      props: {
        dateType: "datetime",
        timeZone: "UTC",
        modelValue: "2024-12-31T13:00:00Z",
      },
    });

    await rerender({
      dateType: "datetime",
      timeZone: "Australia/Sydney",
    });

    const input = document.querySelector(".dp__input") as HTMLInputElement;
    expect(input.value).toBe("2025/01/01, 00:00");
  });

  it("should emit an iso string with the correct converted time", async () => {
    const handler = vi.fn();
    render(MtDatepicker, {
      props: {
        dateType: "datetime",
        timeZone: "America/New_York",
        modelValue: "2023-07-18T09:15:00.000Z",
        "onUpdate:modelValue": handler,
      },
    });

    await userEvent.click(screen.getByRole("textbox"));
    await waitUntil(() => document.getElementsByClassName("dp__menu").length > 0);
    await waitUntil(() => document.getElementsByClassName("dp__time_input") !== null);

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

    await userEvent.click(
      document.querySelector('[data-test-id="minutes-toggle-overlay-btn-0"]') as HTMLElement,
    );
    await waitUntil(() => document.querySelector(".dp__overlay") !== null);
    await userEvent.click(document.querySelector('[data-test-id="00"]') as HTMLElement);
    await waitUntil(() => !document.querySelector(".dp__overlay"));
    expect(
      document.querySelector('[data-test-id="minutes-toggle-overlay-btn-0"]'),
    ).toHaveTextContent("00");

    await userEvent.click(
      document.querySelector('[data-test-id="month-toggle-overlay-0"]') as HTMLElement,
    );
    await waitUntil(() => document.querySelector(".dp__overlay") !== null);
    await userEvent.click(document.querySelector('[data-test-id="Mär"]') as HTMLElement);
    await waitUntil(() => !document.querySelector(".dp__overlay"));
    expect(document.querySelector('[data-test-id="month-toggle-overlay-0"]')).toHaveTextContent(
      "Mär",
    );

    await userEvent.click(
      document.querySelector('[data-test-id="year-toggle-overlay-0"]') as HTMLElement,
    );
    await waitUntil(() => document.querySelector(".dp__overlay") !== null);
    await userEvent.click(document.querySelector('[data-test-id="2025"]') as HTMLElement);
    await waitUntil(() => !document.querySelector(".dp__overlay"));

    await waitUntil(() => document.getElementById("2025-03-15") !== null);
    const dayElement = document.getElementById("2025-03-15") as HTMLElement;
    await userEvent.click(dayElement);

    await new Promise((resolve) => setTimeout(resolve, 100));
    await waitUntil(() => !document.querySelector(".dp__menu"));

    expect(handler).toHaveBeenLastCalledWith("2025-03-15T04:00:00.000Z");
  });

  it("does not shift time after DST change (Europe/Berlin)", async () => {
    const handler = vi.fn();

    render(MtDatepicker, {
      props: {
        dateType: "datetime",
        timeZone: "Europe/Berlin",
        "onUpdate:modelValue": handler,
      },
    });

    await userEvent.click(screen.getByRole("textbox"));
    await waitUntil(() => document.getElementsByClassName("dp__menu").length > 0);
    await waitUntil(() => document.getElementsByClassName("dp__time_input") !== null);

    await userEvent.click(
      document.querySelector('[data-test-id="hours-toggle-overlay-btn-0"]') as HTMLElement,
    );
    await waitUntil(() => document.querySelector(".dp__overlay") !== null);
    await userEvent.click(document.querySelector('[data-test-id="14"]') as HTMLElement);
    await waitUntil(() => !document.querySelector(".dp__overlay"));

    await userEvent.click(
      document.querySelector('[data-test-id="minutes-toggle-overlay-btn-0"]') as HTMLElement,
    );
    await waitUntil(() => document.querySelector(".dp__overlay") !== null);
    await userEvent.click(document.querySelector('[data-test-id="00"]') as HTMLElement);
    await waitUntil(() => !document.querySelector(".dp__overlay"));

    await userEvent.click(
      document.querySelector('[data-test-id="month-toggle-overlay-0"]') as HTMLElement,
    );
    await waitUntil(() => document.querySelector(".dp__overlay") !== null);
    await userEvent.click(document.querySelector('[data-test-id="Apr"]') as HTMLElement);
    await waitUntil(() => !document.querySelector(".dp__overlay"));

    await userEvent.click(
      document.querySelector('[data-test-id="year-toggle-overlay-0"]') as HTMLElement,
    );
    await waitUntil(() => document.querySelector(".dp__overlay") !== null);
    await userEvent.click(document.querySelector('[data-test-id="2026"]') as HTMLElement);
    await waitUntil(() => !document.querySelector(".dp__overlay"));

    await waitUntil(() => document.getElementById("2026-04-03") !== null);
    await userEvent.click(document.getElementById("2026-04-03") as HTMLElement);

    await new Promise((resolve) => setTimeout(resolve, 100));
    await waitUntil(() => !document.querySelector(".dp__menu"));

    expect(handler).toHaveBeenLastCalledWith("2026-04-03T12:00:00.000Z");
  });

  it("keeps the selected time after roundtripping through the model across DST", async () => {
    const handler = vi.fn();

    const { rerender } = render(MtDatepicker, {
      props: {
        dateType: "datetime",
        timeZone: "Europe/Berlin",
        "onUpdate:modelValue": handler,
      },
    });

    await userEvent.click(screen.getByRole("textbox"));
    await waitUntil(() => document.getElementsByClassName("dp__menu").length > 0);
    await waitUntil(() => document.getElementsByClassName("dp__time_input") !== null);

    await userEvent.click(
      document.querySelector('[data-test-id="hours-toggle-overlay-btn-0"]') as HTMLElement,
    );
    await waitUntil(() => document.querySelector(".dp__overlay") !== null);
    await userEvent.click(document.querySelector('[data-test-id="14"]') as HTMLElement);
    await waitUntil(() => !document.querySelector(".dp__overlay"));

    await userEvent.click(
      document.querySelector('[data-test-id="minutes-toggle-overlay-btn-0"]') as HTMLElement,
    );
    await waitUntil(() => document.querySelector(".dp__overlay") !== null);
    await userEvent.click(document.querySelector('[data-test-id="00"]') as HTMLElement);
    await waitUntil(() => !document.querySelector(".dp__overlay"));

    await userEvent.click(
      document.querySelector('[data-test-id="month-toggle-overlay-0"]') as HTMLElement,
    );
    await waitUntil(() => document.querySelector(".dp__overlay") !== null);
    await userEvent.click(document.querySelector('[data-test-id="Apr"]') as HTMLElement);
    await waitUntil(() => !document.querySelector(".dp__overlay"));

    await userEvent.click(
      document.querySelector('[data-test-id="year-toggle-overlay-0"]') as HTMLElement,
    );
    await waitUntil(() => document.querySelector(".dp__overlay") !== null);
    await userEvent.click(document.querySelector('[data-test-id="2026"]') as HTMLElement);
    await waitUntil(() => !document.querySelector(".dp__overlay"));

    await waitUntil(() => document.getElementById("2026-04-03") !== null);
    await userEvent.click(document.getElementById("2026-04-03") as HTMLElement);

    await new Promise((resolve) => setTimeout(resolve, 100));
    await waitUntil(() => !document.querySelector(".dp__menu"));

    expect(handler).toHaveBeenLastCalledWith("2026-04-03T12:00:00.000Z");

    await rerender({
      dateType: "datetime",
      timeZone: "Europe/Berlin",
      modelValue: "2026-04-03T12:00:00.000Z",
      "onUpdate:modelValue": handler,
    });

    expect(screen.getByRole("textbox")).toHaveValue("2026/04/03, 14:00");
  });

  it("should emit iso string with the correct time", async () => {
    const handler = vi.fn();
    render(MtDatepicker, {
      props: {
        dateType: "datetime",
        "onUpdate:modelValue": handler,
      },
    });

    await userEvent.click(screen.getByRole("textbox"));
    await waitUntil(() => document.getElementsByClassName("dp__menu").length > 0);
    await waitUntil(() => document.getElementsByClassName("dp__time_input") !== null);

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

    await userEvent.click(
      document.querySelector('[data-test-id="minutes-toggle-overlay-btn-0"]') as HTMLElement,
    );
    await waitUntil(() => document.querySelector(".dp__overlay") !== null);
    await userEvent.click(document.querySelector('[data-test-id="05"]') as HTMLElement);
    await waitUntil(() => !document.querySelector(".dp__overlay"));
    expect(
      document.querySelector('[data-test-id="minutes-toggle-overlay-btn-0"]'),
    ).toHaveTextContent("05");

    await userEvent.click(
      document.querySelector('[data-test-id="month-toggle-overlay-0"]') as HTMLElement,
    );
    await waitUntil(() => document.querySelector(".dp__overlay") !== null);
    await userEvent.click(document.querySelector('[data-test-id="Jan"]') as HTMLElement);
    await waitUntil(() => !document.querySelector(".dp__overlay"));
    expect(document.querySelector('[data-test-id="month-toggle-overlay-0"]')).toHaveTextContent(
      "Jan",
    );

    await userEvent.click(
      document.querySelector('[data-test-id="year-toggle-overlay-0"]') as HTMLElement,
    );
    await waitUntil(() => document.querySelector(".dp__overlay") !== null);
    await userEvent.click(document.querySelector('[data-test-id="2025"]') as HTMLElement);
    await waitUntil(() => !document.querySelector(".dp__overlay"));

    await waitUntil(() => document.getElementById("2025-01-01") !== null);
    const dayElement = document.getElementById("2025-01-01") as HTMLElement;
    await userEvent.click(dayElement);

    await new Promise((resolve) => setTimeout(resolve, 100));
    await waitUntil(() => !document.querySelector(".dp__menu"));

    expect(handler).toHaveBeenLastCalledWith("2025-01-01T08:05:00.000Z");
  });

  it("should increment the hours overlay by the prop value", async () => {
    const incrementValue = 2;
    render(MtDatepicker, {
      props: {
        dateType: "datetime",
        modelValue: "2023-07-18T09:15:00.000Z",
        hourIncrement: incrementValue,
      },
    });

    await userEvent.click(screen.getByRole("textbox"));
    await waitUntil(() => document.getElementsByClassName("dp__menu").length > 0);
    await waitUntil(() => document.getElementsByClassName("dp__time_input") !== null);

    await userEvent.click(
      document.querySelector('[data-test-id="hours-toggle-overlay-btn-0"]') as HTMLElement,
    );
    await waitUntil(() => document.querySelector(".dp__overlay") !== null);

    const overlayCells = Array.from(document.getElementsByClassName("dp__overlay_cell")).map((el) =>
      parseInt(el.textContent || "0"),
    );

    const allDifferencesMatch = overlayCells
      .slice(1)
      .every((value, index) => value - overlayCells[index] === incrementValue);

    expect(allDifferencesMatch).toBe(true);
  });

  it("should increment the minutes overlay by the prop value", async () => {
    const incrementValue = 4;
    render(MtDatepicker, {
      props: {
        dateType: "datetime",
        modelValue: "2023-07-18T09:15:00.000Z",
        minuteIncrement: incrementValue,
      },
    });

    await userEvent.click(screen.getByRole("textbox"));
    await waitUntil(() => document.getElementsByClassName("dp__menu").length > 0);
    await waitUntil(() => document.getElementsByClassName("dp__time_input") !== null);

    await userEvent.click(
      document.querySelector('[data-test-id="minutes-toggle-overlay-btn-0"]') as HTMLElement,
    );
    await waitUntil(() => document.querySelector(".dp__overlay") !== null);

    const overlayCells = Array.from(document.getElementsByClassName("dp__overlay_cell")).map((el) =>
      parseInt(el.textContent || "0"),
    );

    const allDifferencesMatch = overlayCells
      .slice(1)
      .every((value, index) => value - overlayCells[index] === incrementValue);

    expect(allDifferencesMatch).toBe(true);
  });
});
