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
    expect(screen.getByRole("textbox")).toHaveValue("14:30");
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
});
