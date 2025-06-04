import { flushPromises, mount } from "@vue/test-utils";
import MtPopoverItem from "./mt-popover-item.vue";
import { nextTick } from "vue";

// Mock "useDebounceFn" from "@vueuse/core"
vi.mock("@vueuse/core", () => ({
  useDebounceFn: (method: () => void) => {
    return method;
  },
}));

function createWrapper() {
  return mount(MtPopoverItem, {
    propsData: {
      label: "Test label",
    },
    mocks: {},
  });
}

describe("mt-popover-item", () => {
  it("should render the component", async () => {
    const wrapper = createWrapper();

    expect(wrapper.vm).toBeTruthy();
  });

  it("should render the component with default styling", async () => {
    const wrapper = createWrapper();

    expect(wrapper.classes()).toContain("mt-popover-item--default");
    expect(wrapper.classes()).not.toContain("mt-popover-item--critical");
  });

  it("should render the component with critical styling", async () => {
    const wrapper = createWrapper();

    await wrapper.setProps({
      type: "critical",
    });

    expect(wrapper.classes()).not.toContain("mt-popover-item--default");
    expect(wrapper.classes()).toContain("mt-popover-item--critical");
  });

  it("should show the checkbox", async () => {
    const wrapper = createWrapper();

    await wrapper.setProps({
      showCheckbox: true,
    });

    const checkbox = wrapper.find(".mt-popover-item__checkbox");

    expect(checkbox.exists()).toBeTruthy();
  });

  it("should show the checkbox with checked value", async () => {
    const wrapper = createWrapper();

    await wrapper.setProps({
      showCheckbox: true,
      checkboxChecked: true,
    });

    const checkbox = wrapper.find(".mt-popover-item__checkbox input");

    // @ts-expect-error
    expect(checkbox.element.checked).toBeTruthy();
  });

  it("should show the checkbox with no checked value", async () => {
    const wrapper = createWrapper();

    await wrapper.setProps({
      showCheckbox: true,
      checkboxChecked: false,
    });

    const checkbox = wrapper.find(".mt-popover-item__checkbox input");

    // @ts-expect-error
    expect(checkbox.element.checked).toBeFalsy();
  });

  it("should show the checkbox with partial checked value", async () => {
    const wrapper = createWrapper();

    await wrapper.setProps({
      showCheckbox: true,
      checkboxPartial: true,
    });

    const checkbox = wrapper.find(".mt-field--checkbox");
    expect(checkbox.classes()).toContain("is--partly-checked");

    const partialChecked = wrapper.find(".icon--regular-minus-xxs");
    const fullChecked = wrapper.find(".icon--regular-checkmark-xxs");

    expect(partialChecked.exists()).toBeTruthy();
    expect(fullChecked.exists()).toBeFalsy();
  });

  it("should show the checkbox with full checked value", async () => {
    const wrapper = createWrapper();

    await wrapper.setProps({
      showCheckbox: true,
      checkboxPartial: false,
    });

    const partialChecked = wrapper.find(".icon--solid-minus-xxs");
    const fullChecked = wrapper.find(".icon--regular-checkmark-xxs");

    expect(partialChecked.exists()).toBeFalsy();
    expect(fullChecked.exists()).toBeTruthy();
  });

  it("should emit change-checkbox with true value when clicking on the checkbox", async () => {
    const wrapper = createWrapper();

    await wrapper.setProps({
      showCheckbox: true,
      checkboxChecked: false,
    });

    const checkbox = wrapper.find(".mt-popover-item__checkbox input");

    await checkbox.setValue(true);

    expect(wrapper.emitted("change-checkbox")).toStrictEqual([[true]]);
  });

  it("should emit change-checkbox with false value when clicking on the checkbox", async () => {
    const wrapper = createWrapper();

    await wrapper.setProps({
      showCheckbox: true,
      checkboxChecked: true,
    });

    const checkbox = wrapper.find(".mt-popover-item__checkbox input");

    await checkbox.setValue(false);

    expect(wrapper.emitted("change-checkbox")).toStrictEqual([[false]]);
  });

  it("should render no icon", async () => {
    const wrapper = createWrapper();

    const icon = wrapper.find(".mt-popover-item__icon");

    expect(icon.exists()).toBeFalsy();
  });

  it("should render the icon", async () => {
    const wrapper = createWrapper();

    await wrapper.setProps({
      icon: "solid-sidebar-overlay",
    });

    const icon = wrapper.find(".mt-popover-item__icon");

    expect(icon.exists()).toBeTruthy();
  });

  it("should render the label", async () => {
    const wrapper = createWrapper();

    const label = wrapper.find(".mt-popover-item__label");

    expect(label.text()).toBe("Test label");
  });

  it("should render the label with different text", async () => {
    const wrapper = createWrapper();

    await wrapper.setProps({
      label: "Another test label",
    });

    const label = wrapper.find(".mt-popover-item__label");

    expect(label.text()).toBe("Another test label");
  });

  it("should execute the method in property onLabelClick when user clicks on label", async () => {
    const wrapper = createWrapper();

    const onLabelClick = vi.fn();

    await wrapper.setProps({
      onLabelClick,
    });

    const label = wrapper.find(".mt-popover-item__label");

    await label.trigger("click");

    expect(onLabelClick).toHaveBeenCalledWith();
  });

  it("should render the metaCopy", async () => {
    const wrapper = createWrapper();

    await wrapper.setProps({
      metaCopy: "Test metaCopy",
    });

    const metaCopy = wrapper.find(".mt-popover-item__meta-copy");

    expect(metaCopy.text()).toBe("Test metaCopy");
  });

  it("should render the metaCopy with different text", async () => {
    const wrapper = createWrapper();

    await wrapper.setProps({
      metaCopy: "Another test metaCopy",
    });

    const metaCopy = wrapper.find(".mt-popover-item__meta-copy");

    expect(metaCopy.text()).toBe("Another test metaCopy");
  });

  it("should render the contextual detail", async () => {
    const wrapper = createWrapper();

    await wrapper.setProps({
      contextualDetail: "Test contextualDetail",
    });

    const contextualDetail = wrapper.find(".mt-popover-item__contextual-detail");

    expect(contextualDetail.text()).toBe("Test contextualDetail");
  });

  it("should render the contextual detail with different text", async () => {
    const wrapper = createWrapper();

    await wrapper.setProps({
      contextualDetail: "Another test contextualDetail",
    });

    const contextualDetail = wrapper.find(".mt-popover-item__contextual-detail");

    expect(contextualDetail.text()).toBe("Another test contextualDetail");
  });

  it("should render the shortcut text", async () => {
    const wrapper = createWrapper();

    await wrapper.setProps({
      shortcut: "Test shortcut",
    });

    const shortcut = wrapper.find(".mt-popover-item__shortcut");

    expect(shortcut.text()).toBe("Test shortcut");
  });

  it("should show the switch", async () => {
    const wrapper = createWrapper();

    await wrapper.setProps({
      showSwitch: true,
    });

    const switchElement = wrapper.find(".mt-popover-item__switch");

    expect(switchElement.exists()).toBeTruthy();
  });

  it("should show the switch with checked value", async () => {
    const wrapper = createWrapper();

    await wrapper.setProps({
      showSwitch: true,
      switchValue: true,
    });

    const switchElement = wrapper.find(".mt-popover-item__switch input");

    // @ts-expect-error
    expect(switchElement.element.checked).toBeTruthy();
  });

  it("should show the switch with no checked value", async () => {
    const wrapper = createWrapper();

    await wrapper.setProps({
      showSwitch: true,
      switchValue: false,
    });

    const switchElement = wrapper.find(".mt-popover-item__switch input");

    // @ts-expect-error
    expect(switchElement.element.checked).toBeFalsy();
  });

  it("should not show a switch field", async () => {
    const wrapper = createWrapper();

    const switchElement = wrapper.find(".mt-popover-item__switch");

    expect(switchElement.exists()).toBeFalsy();
  });

  it("should emit change-switch with true value when clicking on the switch input", async () => {
    const wrapper = createWrapper();

    await wrapper.setProps({
      showSwitch: true,
      switchValue: false,
    });

    const switchElement = wrapper.find(".mt-popover-item__switch input");

    await switchElement.setValue(true);

    expect(wrapper.emitted("change-switch")).toStrictEqual([[true]]);
  });

  it("should emit change-switch with false value when clicking on the switch input", async () => {
    const wrapper = createWrapper();

    await wrapper.setProps({
      showSwitch: true,
      switchValue: true,
    });

    const switchElement = wrapper.find(".mt-popover-item__switch input");

    await switchElement.setValue(false);

    expect(wrapper.emitted("change-switch")).toStrictEqual([[false]]);
  });

  it("should show visibility", async () => {
    const wrapper = createWrapper();

    await wrapper.setProps({
      showVisibility: true,
    });

    const visibility = wrapper.find(".mt-popover-item__visibility");

    expect(visibility.exists()).toBeTruthy();
  });

  it("should not show visibility", async () => {
    const wrapper = createWrapper();

    await wrapper.setProps({
      showVisibility: false,
    });

    const visibility = wrapper.find(".mt-popover-item__visibility");

    expect(visibility.exists()).toBeFalsy();
  });

  it("should show visibility with visible status", async () => {
    const wrapper = createWrapper();

    await wrapper.setProps({
      ...wrapper.props(),
      showVisibility: true,
      visible: true,
    });

    const visibleEyeIcon = wrapper.find(".mt-popover-item__visibility.icon--solid-eye");
    const hiddenEyeIcon = wrapper.find(".mt-popover-item__visibility.icon--solid-eye-slash");

    expect(visibleEyeIcon.exists()).toBeTruthy();
    expect(hiddenEyeIcon.exists()).toBeFalsy();
  });

  it("should show visibility with invisible status", async () => {
    const wrapper = createWrapper();

    await wrapper.setProps({
      showVisibility: true,
      visible: false,
    });

    const visibleEyeIcon = wrapper.find(".mt-popover-item__visibility.icon--solid-eye");
    const hiddenEyeIcon = wrapper.find(".mt-popover-item__visibility.icon--solid-eye-slash");

    expect(visibleEyeIcon.exists()).toBeFalsy();
    expect(hiddenEyeIcon.exists()).toBeTruthy();
  });

  it("should emit change-visibility with true value when clicking on the visibility", async () => {
    const wrapper = createWrapper();

    await wrapper.setProps({
      showVisibility: true,
      visible: false,
    });

    const visibility = wrapper.find(".mt-popover-item__visibility");

    await visibility.trigger("click");

    expect(wrapper.emitted("change-visibility")).toStrictEqual([[true]]);
  });

  it("should emit change-visibility with false value when clicking on the visibility", async () => {
    const wrapper = createWrapper();

    await wrapper.setProps({
      showVisibility: true,
      visible: true,
    });

    const visibility = wrapper.find(".mt-popover-item__visibility");

    await visibility.trigger("click");

    expect(wrapper.emitted("change-visibility")).toStrictEqual([[false]]);
  });

  it("should show options", async () => {
    const wrapper = createWrapper();

    await wrapper.setProps({
      showOptions: true,
    });

    const options = wrapper.find(".mt-popover-item__options");

    expect(options.exists()).toBeTruthy();
  });

  it("should not show options", async () => {
    const wrapper = createWrapper();

    await wrapper.setProps({
      showOptions: false,
    });

    const options = wrapper.find(".mt-popover-item__options");

    expect(options.exists()).toBeFalsy();
  });

  it("should show no options count", async () => {
    const wrapper = createWrapper();

    await wrapper.setProps({
      showOptions: true,
    });

    const optionsCount = wrapper.find(".mt-popover-item__options-count");

    expect(optionsCount.exists()).toBeFalsy();
  });

  it("should show the correct options count", async () => {
    const wrapper = createWrapper();

    await wrapper.setProps({
      showOptions: true,
      optionsCount: 5,
    });

    const optionsCount = wrapper.find(".mt-popover-item__options-count");

    expect(optionsCount.exists()).toBeTruthy();
    expect(optionsCount.text()).toBe("5");
  });

  it("should show the correct options count with different value", async () => {
    const wrapper = createWrapper();

    await wrapper.setProps({
      showOptions: true,
      optionsCount: 42,
    });

    const optionsCount = wrapper.find(".mt-popover-item__options-count");

    expect(optionsCount.exists()).toBeTruthy();
    expect(optionsCount.text()).toBe("42");
  });

  it("should emit click-options when clicking on the options", async () => {
    const wrapper = createWrapper();

    await wrapper.setProps({
      showOptions: true,
    });

    const options = wrapper.find(".mt-popover-item__options");

    await options.trigger("click");

    expect(wrapper.emitted("click-options")).toBeTruthy();
  });

  it("should show the borderTop", async () => {
    const wrapper = createWrapper();

    await wrapper.setProps({
      borderTop: true,
    });

    expect(wrapper.classes()).toContain("mt-popover-item--border-top");
    expect(wrapper.classes()).not.toContain("mt-popover-item--border-bottom");
  });

  it("should show the borderBottom", async () => {
    const wrapper = createWrapper();

    await wrapper.setProps({
      borderBottom: true,
    });

    expect(wrapper.classes()).not.toContain("mt-popover-item--border-top");
    expect(wrapper.classes()).toContain("mt-popover-item--border-bottom");
  });

  it("should show both borders", async () => {
    const wrapper = createWrapper();

    await wrapper.setProps({
      borderTop: true,
      borderBottom: true,
    });

    expect(wrapper.classes()).toContain("mt-popover-item--border-top");
    expect(wrapper.classes()).toContain("mt-popover-item--border-bottom");
  });

  it("should show no borders", async () => {
    const wrapper = createWrapper();

    expect(wrapper.classes()).not.toContain("mt-popover-item--border-top");
    expect(wrapper.classes()).not.toContain("mt-popover-item--border-bottom");
  });
});
