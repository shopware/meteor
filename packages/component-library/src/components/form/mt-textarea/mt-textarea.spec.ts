import { userEvent } from "@testing-library/user-event";
import { render, screen } from "@testing-library/vue";
import { expect, describe, it, vi } from "vitest";
import MtTextarea from "./mt-textarea.vue";

describe("mt-textarea", () => {
  it("focuses the text area when clicking on the label", async () => {
    // ARRANGE
    render(MtTextarea, {
      props: {
        label: "Label",
      },
    });

    // ACT
    await userEvent.click(screen.getByText("Label"));

    // ASSERT
    expect(screen.getByRole("textbox")).toHaveFocus();
  });

  it("emits the changed value when the user types", async () => {
    // ARRANGE
    const handler = vi.fn();
    render(MtTextarea, {
      props: {
        "onUpdate:modelValue": handler,
      },
    });

    // ACT
    await userEvent.type(screen.getByRole("textbox"), "a");

    // ASSERT
    expect(handler).toHaveBeenNthCalledWith(1, "a");
    expect(screen.getByRole("textbox")).toHaveValue("a");
  });

  it("emits the changed value when the user moves focus to another element", async () => {
    // ARRANGE
    const handler = vi.fn();
    render(MtTextarea, {
      props: {
        onChange: handler,
      },
    });

    // ACT
    await userEvent.type(screen.getByRole("textbox"), "Shopware");
    await userEvent.tab();

    // ASSERT
    expect(handler).toHaveBeenNthCalledWith(1, "Shopware");
  });

  it("does not change the value when the textarea is disabled", async () => {
    // ARRANGE
    const handler = vi.fn();
    render(MtTextarea, {
      props: {
        disabled: true,
        "onUpdate:modelValue": handler,
      },
    });

    // ACT
    await userEvent.type(screen.getByRole("textbox"), "Shopware");

    // ASSERT
    expect(handler).not.toHaveBeenCalled();
    expect(screen.getByRole("textbox")).toHaveValue("");
    expect(screen.getByRole("textbox")).toBeDisabled();
  });

  it("shows the specified placholder", async () => {
    // ARRANGE
    render(MtTextarea, {
      props: {
        placeholder: "Placeholder",
      },
    });

    // ASSERT
    expect(screen.getByRole("textbox")).toHaveAttribute("placeholder", "Placeholder");
  });

  it("shows an error to the user", async () => {
    // ARRANGE
    render(MtTextarea, {
      props: {
        error: {
          detail: "Error",
        },
      },
    });

    // ASSERT
    expect(screen.getByText("Error")).toBeVisible();
  });

  it.each([
    ["", "0/10"],
    ["Hello", "5/10"],
  ])(
    "displays an indicator on how many characters the input field has",
    async (modelValue, result) => {
      // ARRANGE
      render(MtTextarea, {
        props: {
          maxLength: 10,
          modelValue,
        },
      });

      // ASSERT
      expect(screen.getByText(result)).toBeVisible();
    },
  );

  it("does not allow typing more characters than the specified max length", async () => {
    // ARRANGE
    const handler = vi.fn();

    render(MtTextarea, {
      props: {
        maxLength: 4,
        "onUpdate:modelValue": handler,
      },
    });

    // ACT
    await userEvent.type(screen.getByRole("textbox"), "Shopware");

    // ASSERT
    expect(screen.getByRole("textbox")).toHaveValue("Shop");
    expect(handler).toHaveBeenNthCalledWith(4, "Shop");
  });

  it("can be a required field", async () => {
    // ARRANGE
    render(MtTextarea, {
      props: {
        required: true,
      },
    });

    // ASSERT
    expect(screen.getByRole("textbox")).toBeRequired();
  });

  it("displays a hint", async () => {
    // ARRANGE
    render(MtTextarea, {
      slots: {
        hint: "Hint",
      },
    });

    // ASSERT
    expect(screen.getByText("Hint")).toBeVisible();
  });

  it("displays a helptext", async () => {
    // ARRANGE
    render(MtTextarea, {
      props: {
        helpText: "Helptext",
      },
    });

    // ACT
    await userEvent.tab();

    // ASSERT
    expect(screen.getByRole("tooltip")).toBeVisible();
    expect(screen.getByRole("tooltip")).toHaveTextContent("Helptext");
  });

  it("displays no helptext when none is specified", async () => {
    // ARRANGE
    render(MtTextarea);

    // ASSERT
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });

  it("has the specified name value", async () => {
    // ARRANGE
    render(MtTextarea, {
      props: {
        name: "some-random-name",
      },
    });

    // ASSERT
    expect(screen.getByRole("textbox")).toHaveAttribute("name", "some-random-name");
  });

  it("emits an event when inheritance got removed", async () => {
    // ARRANGE
    const handler = vi.fn();

    render(MtTextarea, {
      props: {
        label: "Some label",
        isInherited: true,
        isInheritanceField: true,
        "onInheritance-remove": handler,
      },
    });

    // ACT
    await userEvent.click(screen.getByRole("button", { name: "Unlink inheritance" }));

    // ASSERT
    expect(handler).toHaveBeenCalledOnce();
  });

  it("emits an event when inheritance got restored", async () => {
    // ARRANGE
    const handler = vi.fn();

    render(MtTextarea, {
      props: {
        label: "Some label",
        isInherited: false,
        isInheritanceField: true,
        "onInheritance-restore": handler,
      },
    });

    // ACT
    await userEvent.click(screen.getByRole("button", { name: "Link inheritance" }));

    // ASSERT
    expect(handler).toHaveBeenCalledOnce();
  });

  it("is not possible to edit value of textarea with linked inheritance", async () => {
    // ARRANGE
    render(MtTextarea, {
      props: {
        label: "Some label",
        isInherited: true,
        isInheritanceField: true,
      },
    });

    // ACT
    await userEvent.type(screen.getByRole("textbox"), "Shopware");

    // ASSERT
    expect(screen.getByRole("textbox")).toHaveValue("");
    expect(screen.getByRole("textbox")).toBeDisabled();
  });

  it("is possible to edit value of textarea with unlinked inheritance", async () => {
    // ARRANGE
    render(MtTextarea, {
      props: {
        label: "Some label",
        isInherited: false,
        isInheritanceField: true,
      },
    });

    // ACT
    await userEvent.type(screen.getByRole("textbox"), "Shopware");

    // ASSERT
    expect(screen.getByRole("textbox")).toHaveValue("Shopware");
    expect(screen.getByRole("textbox")).toBeEnabled();
  });

  it("emits a focus event when the textarea is focused", async () => {
    // ARRANGE
    const handler = vi.fn();

    render(MtTextarea, {
      props: {
        onFocus: handler,
      },
    });

    // ACT
    await userEvent.click(screen.getByRole("textbox"));

    // ASSERT
    expect(handler).toHaveBeenCalledOnce();
  });

  it("emits a blur event when the textarea is blurred", async () => {
    // ARRANGE
    const handler = vi.fn();

    render(MtTextarea, {
      props: {
        onBlur: handler,
      },
    });

    // ACT
    await userEvent.click(screen.getByRole("textbox"));
    await userEvent.tab();

    // ASSERT
    expect(handler).toHaveBeenCalledOnce();
  });

  it("disables the textarea when the inheritance is linked", async () => {
    // ARRANGE
    render(MtTextarea, {
      props: {
        isInheritanceField: true,
        isInherited: true,
      },
    });

    // ASSERT
    expect(screen.getByRole("textbox")).toBeDisabled();
  });
});
