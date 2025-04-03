import { describe, expect, it, vi } from "vitest";
import { userEvent } from "@testing-library/user-event";
import { render, screen } from "@testing-library/vue";
import MtEmailField from "./mt-email-field.vue";
import { flushPromises } from "@vue/test-utils";

describe("mt-email-field", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();

    vi.restoreAllMocks();
  });

  it("has displays the provided value", async () => {
    // ARRANGE
    render(MtEmailField, {
      props: {
        modelValue: "the-value",
      },
    });

    // ASSERT
    expect(screen.getByRole("textbox")).toHaveValue("the-value");
  });

  it("updates the value when typing in the input", async () => {
    // ARRANGE
    const handler = vi.fn();

    render(MtEmailField, {
      props: {
        "onUpdate:modelValue": handler,
      },
    });

    const user = userEvent.setup({
      advanceTimers: vi.advanceTimersByTime,
    });

    // ACT
    await user.type(screen.getByRole("textbox"), "a");

    // ASSERT
    expect(handler).toHaveBeenNthCalledWith(1, "a");
  });

  it("emits a change event when the focus moves to another element", async () => {
    // ARRANGE
    const handler = vi.fn();

    render(MtEmailField, {
      props: {
        onChange: handler,
      },
    });

    const user = userEvent.setup({
      advanceTimers: vi.advanceTimersByTime,
    });

    // ACT
    await user.type(screen.getByRole("textbox"), "a");
    await user.tab();

    // ASSERT
    expect(handler).toHaveBeenNthCalledWith(1, "a");
  });

  it("displays an error when the input is blurred and the provided value is invalid", async () => {
    // ARRANGE
    render(MtEmailField, {
      props: {
        modelValue: "asdf@",
      },
    });

    await flushPromises();

    // ASSERT
    expect(screen.queryByText(/Constraints/)).not.toBeInTheDocument();

    const user = userEvent.setup({
      advanceTimers: vi.advanceTimersByTime,
    });

    // ACT
    await user.tab();
    await user.tab();

    expect(screen.getByText(/Constraints/)).toHaveTextContent("Constraints not satisfied");
  });

  it("does not display the error when the input appears and the provided value is invalid", async () => {
    // ARRANGE
    render(MtEmailField, {
      props: {
        modelValue: "asdf@",
      },
    });

    await flushPromises();

    // ASSERT
    expect(screen.queryByText(/Constraints/)).not.toBeInTheDocument();
  });

  it("displays an error when typing an invalid value and then moving the focus to another element", async () => {
    // ARRANGE
    render(MtEmailField, {
      props: {
        modelValue: "valid@email.address",
      },
    });

    const user = userEvent.setup({
      advanceTimers: vi.advanceTimersByTime,
    });

    // ACT
    await user.type(screen.getByRole("textbox"), "a@");

    await user.tab();

    // ASSERT
    expect(screen.getByText(/Constraints/)).toHaveTextContent("Constraints not satisfied");
  });

  it("only shows the invalid email format error even when the input has another error", async () => {
    // ARRANGE
    render(MtEmailField, {
      props: {
        modelValue: "asdf@",
        error: {
          detail: "Some other error",
        },
      },
    });

    await flushPromises();

    const user = userEvent.setup({
      advanceTimers: vi.advanceTimersByTime,
    });

    // ACT
    await user.tab();
    await user.tab();

    // ASSERT
    expect(screen.getByText(/Constraints/)).toHaveTextContent("Constraints not satisfied");
    expect(screen.queryByText("Some other error")).not.toBeInTheDocument();
  });

  it("focuses the input when clicking the label", async () => {
    // ARRANGE
    render(MtEmailField, {
      props: {
        label: "Some label",
      },
    });

    const user = userEvent.setup({
      advanceTimers: vi.advanceTimersByTime,
    });

    // ACT
    await user.click(screen.getByText("Some label"));

    // ASSERT
    expect(screen.getByRole("textbox")).toHaveFocus();
  });

  it("does not show a label when none is specified", async () => {
    // ARRANGE
    render(MtEmailField);

    // ASSERT
    expect(screen.queryByText("Some label")).not.toBeInTheDocument();
  });

  it("displays no help text by default", async () => {
    // ARRANGE
    render(MtEmailField);

    // ASSERT
    expect(screen.queryByRole("tooltip", { name: "help-text" })).not.toBeInTheDocument();
  });

  it("displays a help text when one is specified", async () => {
    // ARRANGE
    render(MtEmailField, {
      props: {
        helpText: "Some helptext",
      },
    });

    const user = userEvent.setup({
      advanceTimers: vi.advanceTimersByTime,
    });

    // ACT
    await user.hover(screen.getByRole("button"));

    vi.advanceTimersByTime(500);
    await flushPromises();

    // ASSERT
    expect(screen.getByRole("tooltip")).toBeVisible();
    expect(screen.getByRole("tooltip")).toHaveTextContent("Some helptext");
  });

  it("displays an error message when there is an error", async () => {
    // ARRANGE
    render(MtEmailField, {
      props: {
        error: {
          detail: "There is an error",
        },
      },
    });

    // ASSERT
    expect(screen.getByText("There is an error")).toBeVisible();
  });

  it("displays an prefix before the input when one is defined", async () => {
    // ARRANGE
    render(MtEmailField, {
      slots: {
        prefix: "Some prefix",
      },
    });

    // ASSERT
    expect(screen.getByText("Some prefix")).toBeVisible();
  });

  it("does not display a prefix when none is defined", async () => {
    // ARRANGE
    render(MtEmailField);

    // ASSERT
    expect(screen.queryByText("Some prefix")).not.toBeInTheDocument();
  });

  it("displays an suffix after the input when one is defined", async () => {
    // ARRANGE
    render(MtEmailField, {
      slots: {
        suffix: "Some suffix",
      },
    });

    // ASSERT
    expect(screen.getByText("Some suffix")).toBeVisible();
  });

  it("does not display a suffix when none is defined", async () => {
    // ARRANGE
    render(MtEmailField);

    // ASSERT
    expect(screen.queryByText("Some suffix")).not.toBeInTheDocument();
  });

  it("replaces the suffix with an copy button when the value of the field can be copied", async () => {
    // ARRANGE
    render(MtEmailField, {
      props: {
        copyable: true,
      },
      slots: {
        suffix: "Some suffix",
      },
    });

    // ASSERT
    expect(screen.getByRole("button")).toBeVisible();
    expect(screen.queryByText("Some suffix")).not.toBeInTheDocument();
  });

  it("can be an required input field", async () => {
    // ARRANGE
    render(MtEmailField, {
      props: {
        required: true,
      },
    });

    // ASSERT
    expect(screen.getByRole("textbox")).toBeRequired();
  });

  it("can be disabled", async () => {
    // ARRANGE
    render(MtEmailField, {
      props: {
        disabled: true,
      },
    });

    // ASSERT
    expect(screen.getByRole("textbox")).toBeDisabled();
  });

  it("is enabled by default", async () => {
    // ARRANGE
    render(MtEmailField);

    // ASSERT
    expect(screen.getByRole("textbox")).toBeEnabled();
  });

  it("has the specified name value", async () => {
    // ARRANGE
    render(MtEmailField, {
      props: {
        name: "some-name",
      },
    });

    // ACT
    expect(screen.getByRole("textbox")).toHaveAttribute("name", "some-name");
  });

  it("has the specified placeholder value", async () => {
    // ARRANGE
    render(MtEmailField, {
      props: {
        placeholder: "some-placeholder",
      },
    });

    // ACT
    expect(screen.getByRole("textbox")).toHaveAttribute("placeholder", "some-placeholder");
  });

  it("emits an blur event when the input loses focus", async () => {
    // ARRANGE
    const handler = vi.fn();

    render(MtEmailField, {
      props: {
        onBlur: handler,
      },
    });

    const user = userEvent.setup({
      advanceTimers: vi.advanceTimersByTime,
    });

    // ACT
    await user.tab();
    await user.tab();

    // ASSERT
    expect(handler).toHaveBeenCalledOnce();
  });

  it("emits an focus event when the input gains focus", async () => {
    // ARRANGE
    const handler = vi.fn();

    render(MtEmailField, {
      props: {
        onFocus: handler,
      },
    });

    const user = userEvent.setup({
      advanceTimers: vi.advanceTimersByTime,
    });

    // ACT
    await user.tab();

    // ASSERT
    expect(handler).toHaveBeenCalledOnce();
  });

  it("shows a hint when one is specified", async () => {
    // ARRANGE
    render(MtEmailField, {
      slots: {
        hint: "Some hint",
      },
    });

    // ASSERT
    expect(screen.getByText("Some hint")).toBeVisible();
  });

  it("emits an event when inheritance got removed", async () => {
    // ARRANGE
    const handler = vi.fn();

    render(MtEmailField, {
      props: {
        label: "Some label",
        isInherited: true,
        isInheritanceField: true,
        "onInheritance-remove": handler,
      },
    });

    const user = userEvent.setup({
      advanceTimers: vi.advanceTimersByTime,
    });

    // ACT
    await user.click(screen.getByRole("button", { name: "Unlink inheritance" }));

    // ASSERT
    expect(handler).toHaveBeenCalledOnce();
  });

  it("emits an event when inheritance got restored", async () => {
    // ARRANGE
    const handler = vi.fn();

    render(MtEmailField, {
      props: {
        label: "Some label",
        isInherited: false,
        isInheritanceField: true,
        "onInheritance-restore": handler,
      },
    });

    const user = userEvent.setup({
      advanceTimers: vi.advanceTimersByTime,
    });

    // ACT
    await user.click(screen.getByRole("button", { name: "Link inheritance" }));

    // ASSERT
    expect(handler).toHaveBeenCalledOnce();
  });

  it("is disabled when the inheritance is linked", async () => {
    // ARRANGE
    const handler = vi.fn();

    render(MtEmailField, {
      props: {
        isInheritanceField: true,
        isInherited: true,
        "onUpdate:modelValue": handler,
      },
    });

    const user = userEvent.setup({
      advanceTimers: vi.advanceTimersByTime,
    });

    // ACT
    await user.type(screen.getByRole("textbox"), "a");

    // ASSERT
    expect(screen.getByRole("textbox")).toBeDisabled();

    expect(handler).not.toHaveBeenCalled();
    expect(screen.getByRole("textbox")).toHaveValue("");
  });

  it("is possible to edit the value when the inheritance is unlinked", async () => {
    // ARRANGE
    const handler = vi.fn();

    render(MtEmailField, {
      props: {
        isInheritanceField: true,
        isInherited: false,
        "onUpdate:modelValue": handler,
      },
    });

    const user = userEvent.setup({
      advanceTimers: vi.advanceTimersByTime,
    });

    // ACT
    await user.type(screen.getByRole("textbox"), "a");

    // ASSERT
    expect(handler).toHaveBeenCalledOnce();
    expect(screen.getByRole("textbox")).toHaveValue("a");
  });

  it("shows a tooltip when focusing the button to copy the input value", async () => {
    // ARRANGE
    render(MtEmailField, {
      props: {
        copyable: true,
      },
    });

    const user = userEvent.setup({
      advanceTimers: vi.advanceTimersByTime,
    });

    // ACT
    await user.tab();
    await user.tab();

    // ASSERT
    expect(screen.getByRole("tooltip")).toBeVisible();
  });

  it("announces itself as invalid to screen readers when the value is invalid", async () => {
    // ARRANGE
    await render(MtEmailField, {
      props: {
        modelValue: "asdf@",
      },
    });

    const user = userEvent.setup({
      advanceTimers: vi.advanceTimersByTime,
    });

    // ACT
    await user.tab();
    await user.tab();

    // ASSERT
    expect(screen.getByRole("textbox")).toHaveAttribute("aria-invalid", "true");
  });

  it("announces itself as invalid to screen readers when the field has an error", async () => {
    // ARRANGE
    await render(MtEmailField, {
      props: {
        error: {
          detail: "Some error",
        },
      },
    });

    // ASSERT
    expect(screen.getByRole("textbox")).toHaveAttribute("aria-invalid", "true");
  });

  it("announces the error message to screen readers when the field has an error", async () => {
    // ARRANGE
    await render(MtEmailField, {
      props: {
        error: {
          detail: "Some error",
        },
      },
    });

    // ASSERT
    expect(screen.getByRole("textbox")).toHaveAttribute(
      "aria-describedby",
      screen.getByText("Some error").id,
    );

    expect(screen.getByText("Some error")).toHaveAttribute(
      "id",
      screen.getByRole("textbox").getAttribute("aria-describedby"),
    );
  });
});
