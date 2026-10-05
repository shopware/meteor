import { render, screen } from "@testing-library/vue";
import { describe, it, expect } from "vitest";
import MtPasswordField from "./mt-password-field.vue";
import { userEvent } from "@testing-library/user-event";
import { defineComponent } from "vue";

describe("mt-password-field", () => {
  it("has the correct name", async () => {
    // ARRANGE
    await render(MtPasswordField, {
      props: {
        label: "Password",
        name: "password",
      },
    });

    // ASSERT
    expect(screen.getByLabelText("Password")).toHaveAttribute("name", "password");
  });

  it("focuses the input when clicking the label", async () => {
    // ARRANGE
    await render(MtPasswordField, {
      props: {
        label: "Password",
        name: "password",
      },
    });

    // ACT
    await userEvent.click(screen.getByText("Password"));

    // ASSERT
    expect(screen.getByLabelText("Password")).toHaveFocus();
  });

  it("is not possible to edit the password when disabled", async () => {
    // ARRANGE
    await render(MtPasswordField, {
      props: {
        label: "Password",
        disabled: true,
      },
    });

    // ACT
    await userEvent.type(screen.getByLabelText("Password"), "password");

    // ASSERT
    expect(screen.getByLabelText("Password")).not.toHaveValue();
    expect(screen.getByLabelText("Password")).toBeDisabled();
  });

  it("hides the password by default", async () => {
    // ARRANGE
    await render(MtPasswordField, {
      props: {
        label: "Password",
        modelValue: "some-random-password",
      },
    });

    // ASSERT
    expect(screen.getByLabelText("Password")).toHaveAttribute("type", "password");
  });

  it("shows the password when clicking the show button", async () => {
    // ARRANGE
    await render(MtPasswordField, {
      props: {
        label: "Password",
        modelValue: "some-random-password",
      },
    });

    // ACT
    await userEvent.click(screen.getByRole("button", { name: "Show password" }));

    // ASSERT
    expect(screen.getByLabelText("Password")).toHaveAttribute("type", "text");
  });

  it("hides the password when clicking the hide password button", async () => {
    // ARRANGE
    await render(MtPasswordField, {
      props: {
        label: "Password",
        modelValue: "some-random-password",
      },
    });

    await userEvent.click(screen.getByRole("button", { name: "Show password" }));

    // ACT
    await userEvent.click(screen.getByRole("button", { name: "Hide password" }));

    // ASSERT
    expect(screen.getByLabelText("Password")).toHaveAttribute("type", "password");
  });

  it("emits a change event when removing focus from the input field", async () => {
    // ARRANGE
    const handler = vi.fn();
    await render(MtPasswordField, {
      props: {
        label: "Password",
        onChange: handler,
      },
    });

    // ACT
    await userEvent.type(screen.getByLabelText("Password"), "new-password");
    await userEvent.tab();

    // ASSERT
    expect(handler).toHaveBeenCalledOnce();
    expect(handler).toHaveBeenCalledWith("new-password");
  });

  it("v-model updates when typing into the password field", async () => {
    // ARRANGE
    const handler = vi.fn();
    await render(MtPasswordField, {
      props: {
        label: "Password",
        "onUpdate:modelValue": handler,
      },
    });

    // ACT
    await userEvent.type(screen.getByLabelText("Password"), "new-password");

    // ASSERT
    expect(handler).toHaveBeenCalledTimes(12);

    expect(handler).toHaveBeenNthCalledWith(3, "new");
    expect(handler).toHaveBeenNthCalledWith(12, "new-password");
  });

  it("has the correct placeholder", async () => {
    // ARRANGE
    await render(MtPasswordField, {
      props: {
        label: "Password",
        placeholder: "Enter your password",
      },
    });

    // ASSERT
    expect(screen.getByLabelText("Password")).toHaveAttribute("placeholder", "Enter your password");
  });

  it("does not show a toggle password button when password field should not be toggable", async () => {
    // ARRANGE
    await render(MtPasswordField, {
      props: {
        label: "Password",
        toggable: false,
      },
    });

    // ASSERT
    expect(screen.queryByRole("button", { name: "Show password" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Hide password" })).not.toBeInTheDocument();
  });

  it("emits a change submit event when pressing enter", async () => {
    // ARRANGE
    const handler = vi.fn();
    render(MtPasswordField, {
      props: {
        label: "Password",
        onSubmit: handler,
      },
    });

    // ACT
    await userEvent.type(screen.getByLabelText("Password"), "new-password");
    await userEvent.keyboard("{Enter}");

    // ASSERT
    expect(handler).toHaveBeenCalledOnce();
  });

  it("does not emit a submit event when pressing enter on the password toggle button", async () => {
    // ARRANGE
    const handler = vi.fn();
    render(MtPasswordField, {
      props: {
        label: "Password",
        onSubmit: handler,
      },
    });

    // ACT
    await userEvent.click(screen.getByRole("button", { name: "Show password" }));
    await userEvent.keyboard("{Enter}");

    // ASSERT
    expect(handler).not.toHaveBeenCalled();
  });

  it("does not submit a form when pressing enter on the password toggle button", async () => {
    // ARRANGE
    const handler = vi.fn();
    const wrapper = defineComponent({
      components: {
        MtPasswordField,
      },
      template: "<form @submit='handler'><mt-password-field label='Password' /></form>",
      setup: () => ({ handler }),
    });

    render(wrapper);

    // ACT
    await userEvent.tab();
    await userEvent.tab();

    expect(screen.getByRole("button", { name: "Show password" })).toHaveFocus();

    await userEvent.keyboard("{Enter}");

    // ASSERT
    expect(handler).not.toHaveBeenCalled();
  });

  it("displays a hint passed via the hint prop", async () => {
    // ARRANGE
    await render(MtPasswordField, {
      props: {
        hint: "Hint from prop",
      },
    });

    // ASSERT
    expect(screen.getByText("Hint from prop")).toBeVisible();
  });

  it("renders markup passed via the hint slot", async () => {
    // ARRANGE
    await render(MtPasswordField, {
      slots: {
        hint: '<span data-testid="custom-hint">Hint from slot</span>',
      },
    });

    // ASSERT
    expect(screen.getByTestId("custom-hint")).toBeVisible();
    expect(screen.getByTestId("custom-hint")).toHaveTextContent("Hint from slot");
  });

  it("does not render a hint when neither prop nor slot is provided", async () => {
    // ARRANGE
    const { container } = await render(MtPasswordField);

    // ASSERT
    expect(container.querySelector(".mt-field-hint")).not.toBeInTheDocument();
  });

  it("displays a help text when the helpText prop is set", () => {
    // ARRANGE
    const { container } = render(MtPasswordField, {
      props: { label: "Label", helpText: "Some help text" },
    });

    // ASSERT
    expect(container.querySelector(".mt-field__help-text")).toBeInTheDocument();
  });

  it("marks the label as required when the required prop is set", () => {
    // ARRANGE
    render(MtPasswordField, { props: { label: "Label", required: true } });

    // ASSERT
    expect(screen.getByText("Label")).toHaveClass("mt-field-label--is-required");
  });

  it("displays an error message when the error prop is set", () => {
    // ARRANGE
    render(MtPasswordField, {
      props: { label: "Label", error: { code: 500, detail: "There is an error" } },
    });

    // ASSERT
    expect(screen.getByText("There is an error")).toBeVisible();
  });

  it("disables the input when the disabled prop is set", () => {
    // ARRANGE
    render(MtPasswordField, { props: { label: "Label", disabled: true } });

    // ASSERT
    expect(screen.getByLabelText("Label")).toBeDisabled();
  });

  it("displays an inheritance switch when the isInheritanceField prop is set", () => {
    // ARRANGE
    render(MtPasswordField, { props: { label: "Label", isInheritanceField: true } });

    // ASSERT
    expect(screen.getByRole("button", { name: "Link inheritance" })).toBeInTheDocument();
  });

  it("marks the field as inherited when the isInherited prop is set", () => {
    // ARRANGE
    const { container } = render(MtPasswordField, {
      props: { label: "Label", isInheritanceField: true, isInherited: true },
    });

    // ASSERT
    expect(container.querySelector(".mt-field")).toHaveClass("is--inherited");
    expect(screen.getByRole("button", { name: "Unlink inheritance" })).toBeInTheDocument();
  });

  it("disables the inheritance switch when the disableInheritanceToggle prop is set", () => {
    // ARRANGE
    render(MtPasswordField, {
      props: {
        label: "Label",
        isInheritanceField: true,
        isInherited: true,
        disableInheritanceToggle: true,
      },
    });

    // ASSERT
    expect(screen.getByRole("button", { name: "Unlink inheritance" })).toBeDisabled();
  });

  it("renders in the small size when the size prop is set to small", () => {
    // ARRANGE
    const { container } = render(MtPasswordField, { props: { label: "Label", size: "small" } });

    // ASSERT
    expect(container.querySelector(".mt-field")).toHaveClass("mt-field--small");
  });

  it("accepts the validation prop without rendering it as an attribute", () => {
    // ARRANGE
    const { container } = render(MtPasswordField, {
      props: { label: "Label", validation: "required" },
    });

    // ASSERT
    expect(container.querySelector(".mt-field")).not.toHaveAttribute("validation");
  });
});
