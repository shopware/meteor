import { mount } from "@vue/test-utils";
import userEvent from "@testing-library/user-event";
import MtColorpicker from "./mt-colorpicker.vue";

async function createWrapper(customOptions = {}) {
  return mount(MtColorpicker, {
    ...customOptions,
  });
}

describe("src/app/component/form/mt-datepicker", () => {
  let wrapper: undefined | Awaited<ReturnType<typeof createWrapper>>;

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount();
    }
  });

  it("opens with keyboard", async () => {
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

    expect(inputElement).toHaveFocus();

    // Simulate pressing Enter to open modal
    await user.keyboard("{Enter}");
    const dropdown = document.querySelector(".mt-floating-ui__content");
    expect(dropdown).toBeDefined();
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
