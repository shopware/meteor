import { render, screen } from "@testing-library/vue";
import MtTextField from "./mt-text-field.vue";
import userEvent from "@testing-library/user-event";

describe("mt-text-field", () => {
  it("emits a blur event when the user blurs the input", async () => {
    // ARRANGE
    const handler = vi.fn();

    render(MtTextField, {
      attrs: {
        onBlur: handler,
      },
    });

    await userEvent.tab();

    // ACT
    await userEvent.tab();

    // ASSERT
    expect(handler).toHaveBeenCalledExactlyOnceWith(expect.any(FocusEvent));
    expect(document.body).toHaveFocus();
  });

  it("emits a focus event when the user focuses the input", async () => {
    // ARRANGE
    const handler = vi.fn();

    render(MtTextField, {
      attrs: { onFocus: handler },
    });

    // ACT
    await userEvent.click(screen.getByRole("textbox"));

    // ASSERT
    expect(handler).toHaveBeenCalledExactlyOnceWith(expect.any(FocusEvent));
    expect(screen.getByRole("textbox")).toHaveFocus();
  });
});
