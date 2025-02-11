import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/vue";
import { userEvent } from "@testing-library/user-event";
import MtCheckbox from "./mt-checkbox.vue";

describe("mt-checkbox", () => {
  it("shows a checkmark when checked", async () => {
    // ARRANGE
    render(MtCheckbox, {
      props: {
        checked: true,
      },
    });

    // ASSERT
    expect(screen.getByRole("checkbox")).toBeChecked();
  });

  it("does not show a checkmark when unchecked", async () => {
    // ARRANGE
    render(MtCheckbox, {
      props: {
        checked: false,
      },
    });

    // ASSERT
    expect(screen.getByRole("checkbox")).not.toBeChecked();
  });

  it("emits an event when clicking the input", async () => {
    // ARRANGE
    const handler = vi.fn();
    render(MtCheckbox, {
      props: {
        // @ts-expect-error -- Event is not typed, yet
        onChange: handler,
      },
    });

    // ACT
    await userEvent.click(screen.getByRole("checkbox"));

    // ASSERT
    expect(screen.getByRole("checkbox")).toBeChecked();

    expect(handler).toHaveBeenCalledOnce();
    expect(handler).toHaveBeenCalledWith(true);
  });

  it("emits an event when toggling it with the space key", async () => {
    // ARRANGE
    const handler = vi.fn();
    render(MtCheckbox, {
      props: {
        // @ts-expect-error -- Event is not typed, yet
        onChange: handler,
      },
    });

    // ACT
    await userEvent.type(screen.getByRole("checkbox"), "{Space}");

    // ASSERT
    expect(screen.getByRole("checkbox")).toBeChecked();

    expect(handler).toHaveBeenCalledOnce();
    expect(handler).toHaveBeenCalledWith(true);
  });

  it("checks the checkbox when clicking the label", async () => {
    // ARRANGE
    const handler = vi.fn();

    render(MtCheckbox, {
      props: {
        checked: false,
        // @ts-expect-error -- Event is not typed, yet
        onChange: handler,
        label: "Checkbox",
      },
    });

    // ACT
    await userEvent.click(screen.getByText("Checkbox"));

    // ASSERT
    expect(screen.getByRole("checkbox")).toBeChecked();

    expect(handler).toHaveBeenCalledOnce();
    expect(handler).toHaveBeenCalledWith(true);
  });

  it("focuses the checkbox when clicking the label", async () => {
    // ARRANGE
    render(MtCheckbox, {
      props: {
        label: "Checkbox",
      },
    });

    // ACT
    await userEvent.click(screen.getByText("Checkbox"));

    // ASSERT
    expect(screen.getByRole("checkbox")).toHaveFocus();
  });

  it("has the correct name when submitting a form", async () => {
    await render(MtCheckbox, {
      props: {
        name: "over-18",
      },
    });

    // ASSERT
    expect(screen.getByRole("checkbox")).toHaveAttribute("name", "over-18");
  });

  it("can be disabled", async () => {
    // ARRANGE
    render(MtCheckbox, {
      props: {
        disabled: true,
      },
    });

    // ASSERT
    expect(screen.getByRole("checkbox")).toBeDisabled();
  });

  it("does not emit an event when clicking on a disabled checkbox", async () => {
    // ARRANGE
    const handler = vi.fn();
    render(MtCheckbox, {
      props: {
        disabled: true,
        // @ts-expect-error -- Event is not typed, yet
        onChange: handler,
      },
    });

    // ACT
    await userEvent.click(screen.getByRole("checkbox"));

    // ASSERT
    expect(screen.getByRole("checkbox")).not.toBeChecked();
    expect(handler).not.toHaveBeenCalled();
  });

  it("can be required", async () => {
    // ARRANGE
    render(MtCheckbox, {
      props: {
        required: true,
      },
    });

    // ASSERT
    expect(screen.getByRole("checkbox")).toBeRequired();
  });
});
