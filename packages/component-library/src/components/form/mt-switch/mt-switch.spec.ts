import { mount } from "@vue/test-utils";
import MtSwitch from "./mt-switch.vue";

async function createWrapper(props = {}, options = {}) {
  return mount(MtSwitch, {
    propsData: {
      label: "Test Switch",
      ...props,
    },
    ...options,
  });
}

describe("mt-switch", () => {
  let wrapper: Awaited<ReturnType<typeof createWrapper>>;

  afterEach(() => {
    wrapper?.unmount();
  });

  it("should update checked state when checked", async () => {
    wrapper = await createWrapper();
    const checkbox = wrapper?.find('input[type="checkbox"]');

    await wrapper.setProps({ checked: true });
    expect(checkbox.element).toBeChecked();

    await wrapper.setProps({ checked: false });
    expect(checkbox.element).not.toBeChecked();
  });

  it("should have correct ARIA attributes", async () => {
    wrapper = await createWrapper({
      checked: true,
      label: "Accessibility Test",
    });
    const checkbox = wrapper.find('input[type="checkbox"]');

    expect(checkbox.attributes("role")).toBe("checkbox");
    expect(checkbox.attributes("aria-checked")).toBe("true");
    expect(checkbox.attributes("aria-label")).toBe("Accessibility Test");
  });
});
