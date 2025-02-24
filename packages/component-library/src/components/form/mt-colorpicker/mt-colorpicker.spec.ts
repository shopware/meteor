import { mount } from "@vue/test-utils";
import userEvent from "@testing-library/user-event";
import MtColorpicker from "./mt-colorpicker.vue";
import { render, screen } from "@testing-library/vue";

async function createWrapper(customOptions = {}) {
  return mount(MtColorpicker, {
    ...customOptions,
  });
}

describe("mt-datepicker", () => {
  let wrapper: undefined | Awaited<ReturnType<typeof createWrapper>>;

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount();
    }
  });

  it("opens with keyboard", async () => {
    // ARRANGE
    render(MtColorpicker, {
      props: {
        modelValue: "#0fcff5",
      },
    });

    const user = userEvent.setup();

    // ACT
    await user.tab();
    await user.keyboard("{Enter}");

    // ACT
    expect(screen.getByTestId("mt-colorpicker-dialog")).toBeVisible();
  });

  it("allows value changes with keyboard", async () => {
    const user = userEvent.setup();
    wrapper = await createWrapper({
      props: {
        modelValue: "#0fcff5",
      },
      attachTo: document.body,
    });

    // Simulate tabbing to focus the input element
    await user.tab();
    const colorPickerInput = wrapper.find(".mt-colorpicker__input");
    const inputElement = colorPickerInput.element as HTMLInputElement;

    // Simulate pressing Enter to open modal
    await user.keyboard("{Enter}");

    // Focus color slider
    await userEvent.keyboard("{Tab}");

    // Change value with arrow key
    await userEvent.keyboard("{arrowleft}");

    expect(inputElement.value).toBe("#10cef4");
  });
});
