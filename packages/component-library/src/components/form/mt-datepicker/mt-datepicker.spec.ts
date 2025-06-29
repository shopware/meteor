import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/vue";
import MtDatepicker from "./mt-datepicker.vue";
import userEvent from "@testing-library/user-event";

describe("mt-datepicker", () => {
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
});
