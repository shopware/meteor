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
});
