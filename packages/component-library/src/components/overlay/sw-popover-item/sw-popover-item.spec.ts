import { mount } from "@vue/test-utils";
import SwPopoverItem from "./sw-popover-item.vue";

function createWrapper() {
  return mount(SwPopoverItem, {
    propsData: {
      label: 'Test label',
    },
    mocks: {}
  });
}

describe("sw-popover-item", () => {
  it("should render the component", async () => {
    const wrapper = createWrapper();

    expect(wrapper.vm).toBeTruthy();
  });

  it("should render the component with default styling", async () => {
    const wrapper = createWrapper();

    expect(wrapper.classes()).toContain('sw-popover-item--default');
    expect(wrapper.classes()).not.toContain('sw-popover-item--critical');
  });

  it("should render the component with critical styling", async () => {
    const wrapper = createWrapper();

    await wrapper.setProps({
      type: 'critical'
    });

    expect(wrapper.classes()).not.toContain('sw-popover-item--default');
    expect(wrapper.classes()).toContain('sw-popover-item--critical');
  });

  it("should show the checkbox", async () => {
    const wrapper = createWrapper();

    await wrapper.setProps({
      showCheckbox: true
    })

    const checkbox = wrapper.find(".sw-popover-item__checkbox");

    expect(checkbox.exists()).toBe(true);
  });

  it("should show the checkbox with checked value", async () => {
    const wrapper = createWrapper();

    await wrapper.setProps({
      showCheckbox: true,
      checkboxChecked: true
    })

    const checkbox = wrapper.find(".sw-popover-item__checkbox input");

    // @ts-expect-error
    expect(checkbox.element.checked).toBe(true);
  });

  it("should show the checkbox with no checked value", async () => {
    const wrapper = createWrapper();

    await wrapper.setProps({
      showCheckbox: true,
      checkboxChecked: false
    })

    const checkbox = wrapper.find(".sw-popover-item__checkbox input");

    // @ts-expect-error
    expect(checkbox.element.checked).toBe(false);
  });

  it("should show the checkbox with partial checked value", async () => {
    const wrapper = createWrapper();

    await wrapper.setProps({
      showCheckbox: true,
      checkboxPartial: true
    })

    const checkbox = wrapper.find(".sw-field--checkbox");
    expect(checkbox.classes()).toContain('is--partly-checked');

    const partialChecked = wrapper.find(".icon--regular-minus-xxs");
    const fullChecked = wrapper.find(".icon--regular-checkmark-xxs");

    expect(partialChecked.exists()).toBe(true);
    expect(fullChecked.exists()).toBe(false);
  });

  it("should show the checkbox with full checked value", async () => {
    const wrapper = createWrapper();

    await wrapper.setProps({
      showCheckbox: true,
      checkboxPartial: false
    })

    const partialChecked = wrapper.find(".icon--solid-minus-xxs");
    const fullChecked = wrapper.find(".icon--regular-checkmark-xxs");

    expect(partialChecked.exists()).toBe(false);
    expect(fullChecked.exists()).toBe(true);
  });

  it("should emit change-checkbox with true value when clicking on the checkbox", async () => {
    const wrapper = createWrapper();

    await wrapper.setProps({
      showCheckbox: true,
      checkboxChecked: false
    })

    const checkbox = wrapper.find(".sw-popover-item__checkbox input");

    await checkbox.setChecked(true);

    expect(wrapper.emitted('change-checkbox')).toEqual([[true]]);
  })

  it("should emit change-checkbox with false value when clicking on the checkbox", async () => {
    const wrapper = createWrapper();

    await wrapper.setProps({
      showCheckbox: true,
      checkboxChecked: true
    })

    const checkbox = wrapper.find(".sw-popover-item__checkbox input");

    await checkbox.setChecked(false);

    expect(wrapper.emitted('change-checkbox')).toEqual([[false]]);
  })

  it("should render no icon", async () => {
    const wrapper = createWrapper();

    const icon = wrapper.find(".sw-popover-item__icon");

    expect(icon.exists()).toBe(false);
  });

  it("should render the icon", async () => {
    const wrapper = createWrapper();

    await wrapper.setProps({
      icon: 'solid-sidebar-overlay'
    })

    const icon = wrapper.find(".sw-popover-item__icon");

    expect(icon.exists()).toBe(true);
  });

  it("should render the label", async () => {
    const wrapper = createWrapper();

    const label = wrapper.find(".sw-popover-item__label");

    expect(label.text()).toBe('Test label');
  });

  it("should render the label with different text", async () => {
    const wrapper = createWrapper();

    await wrapper.setProps({
      label: 'Another test label'
    })

    const label = wrapper.find(".sw-popover-item__label");

    expect(label.text()).toBe('Another test label');
  });

  it("should execute the method in property onLabelClick when user clicks on label", async () => {
    const wrapper = createWrapper();

    const onLabelClick = jest.fn();

    await wrapper.setProps({
      onLabelClick
    })

    const label = wrapper.find(".sw-popover-item__label");

    await label.trigger('click');

    expect(onLabelClick).toHaveBeenCalled();
  });

  it("should render the metaCopy", async () => {
    const wrapper = createWrapper();

    await wrapper.setProps({
      metaCopy: 'Test metaCopy'
    })

    const metaCopy = wrapper.find(".sw-popover-item__meta-copy");

    expect(metaCopy.text()).toBe('Test metaCopy');
  });

  it("should render the metaCopy with different text", async () => {
    const wrapper = createWrapper();

    await wrapper.setProps({
      metaCopy: 'Another test metaCopy'
    })

    const metaCopy = wrapper.find(".sw-popover-item__meta-copy");

    expect(metaCopy.text()).toBe('Another test metaCopy');
  });

  it("should render the contextual detail", async () => {
    const wrapper = createWrapper();

    await wrapper.setProps({
      contextualDetail: 'Test contextualDetail'
    })

    const contextualDetail = wrapper.find(".sw-popover-item__contextual-detail");

    expect(contextualDetail.text()).toBe('Test contextualDetail');
  });

  it("should render the contextual detail with different text", async () => {
    const wrapper = createWrapper();

    await wrapper.setProps({
      contextualDetail: 'Another test contextualDetail'
    })

    const contextualDetail = wrapper.find(".sw-popover-item__contextual-detail");

    expect(contextualDetail.text()).toBe('Another test contextualDetail');
  });

  it("should render the shortcut text", async () => {
    const wrapper = createWrapper();

    await wrapper.setProps({
      shortcut: 'Test shortcut'
    })

    const shortcut = wrapper.find(".sw-popover-item__shortcut");

    expect(shortcut.text()).toBe('Test shortcut');
  })

  it("should show the switch", async () => {
    const wrapper = createWrapper();

    await wrapper.setProps({
      showSwitch: true
    })

    const switchElement = wrapper.find(".sw-popover-item__switch");

    expect(switchElement.exists()).toBe(true);
  })

  it("should show the switch with checked value", async () => {
    const wrapper = createWrapper();

    await wrapper.setProps({
      showSwitch: true,
      switchValue: true
    })

    const switchElement = wrapper.find(".sw-popover-item__switch input");

    // @ts-expect-error
    expect(switchElement.element.checked).toBe(true);
  });

  it("should show the switch with no checked value", async () => {
    const wrapper = createWrapper();

    await wrapper.setProps({
      showSwitch: true,
      switchValue: false
    })

    const switchElement = wrapper.find(".sw-popover-item__switch input");

    // @ts-expect-error
    expect(switchElement.element.checked).toBe(false);
  });

  it("should not show a switch field", async () => {
    const wrapper = createWrapper();

    const switchElement = wrapper.find(".sw-popover-item__switch");

    expect(switchElement.exists()).toBe(false);
  });

  it("should emit change-switch with true value when clicking on the switch input", async () => {
    const wrapper = createWrapper();

    await wrapper.setProps({
      showSwitch: true,
      switchValue: false
    })

    const switchElement = wrapper.find(".sw-popover-item__switch input");

    await switchElement.setChecked(true);

    expect(wrapper.emitted('change-switch')).toEqual([[true]]);
  });

  it("should emit change-switch with false value when clicking on the switch input", async () => {
    const wrapper = createWrapper();

    await wrapper.setProps({
      showSwitch: true,
      switchValue: true
    })

    const switchElement = wrapper.find(".sw-popover-item__switch input");

    await switchElement.setChecked(false);

    expect(wrapper.emitted('change-switch')).toEqual([[false]]);
  });

  it("should show visibility", async() => {
    const wrapper = createWrapper();

    await wrapper.setProps({
      showVisibility: true
    })

    const visibility = wrapper.find(".sw-popover-item__visibility");

    expect(visibility.exists()).toBe(true);
  });

  it("should not show visibility", async() => {
    const wrapper = createWrapper();

    await wrapper.setProps({
      showVisibility: false
    })

    const visibility = wrapper.find(".sw-popover-item__visibility");

    expect(visibility.exists()).toBe(false);
  });

  it("should show visibility with visible status", async() => {
    const wrapper = createWrapper();

    await wrapper.setProps({
      showVisibility: true,
      visible: true
    })

    const visibility = wrapper.find(".sw-popover-item__visibility");

    const visibleEyeIcon = visibility.find(".icon--solid-eye");
    const hiddenEyeIcon = visibility.find(".icon--solid-eye-slash");

    expect(visibleEyeIcon.exists()).toBe(true);
    expect(hiddenEyeIcon.exists()).toBe(false);
  });

  it("should show visibility with invisible status", async() => {
    const wrapper = createWrapper();

    await wrapper.setProps({
      showVisibility: true,
      visible: false
    })

    const visibility = wrapper.find(".sw-popover-item__visibility");

    const visibleEyeIcon = visibility.find(".icon--solid-eye");
    const hiddenEyeIcon = visibility.find(".icon--solid-eye-slash");

    expect(visibleEyeIcon.exists()).toBe(false);
    expect(hiddenEyeIcon.exists()).toBe(true);
  });

  it("should emit change-visibility with true value when clicking on the visibility", async () => {
    const wrapper = createWrapper();

    await wrapper.setProps({
      showVisibility: true,
      visible: false
    })

    const visibility = wrapper.find(".sw-popover-item__visibility");

    await visibility.trigger('click');

    expect(wrapper.emitted('change-visibility')).toEqual([[true]]);
  });

  it("should emit change-visibility with false value when clicking on the visibility", async () => {
    const wrapper = createWrapper();

    await wrapper.setProps({
      showVisibility: true,
      visible: true
    })

    const visibility = wrapper.find(".sw-popover-item__visibility");

    await visibility.trigger('click');

    expect(wrapper.emitted('change-visibility')).toEqual([[false]]);
  });

  it("should show options", async () => {
    const wrapper = createWrapper();

    await wrapper.setProps({
      showOptions: true
    })

    const options = wrapper.find(".sw-popover-item__options");

    expect(options.exists()).toBe(true);
  })

  it("should not show options", async () => {
    const wrapper = createWrapper();

    await wrapper.setProps({
      showOptions: false
    })

    const options = wrapper.find(".sw-popover-item__options");

    expect(options.exists()).toBe(false);
  });

  it("should show no options count", async () => {
    const wrapper = createWrapper();

    await wrapper.setProps({
      showOptions: true
    })

    const optionsCount = wrapper.find(".sw-popover-item__options-count");

    expect(optionsCount.exists()).toBe(false);
  });

  it("should show the correct options count", async () => {
    const wrapper = createWrapper();

    await wrapper.setProps({
      showOptions: true,
      optionsCount: 5
    })

    const optionsCount = wrapper.find(".sw-popover-item__options-count");

    expect(optionsCount.exists()).toBe(true);
    expect(optionsCount.text()).toBe('5');
  });

  it("should show the correct options count with different value", async () => {
    const wrapper = createWrapper();

    await wrapper.setProps({
      showOptions: true,
      optionsCount: 42
    })

    const optionsCount = wrapper.find(".sw-popover-item__options-count");

    expect(optionsCount.exists()).toBe(true);
    expect(optionsCount.text()).toBe('42');
  });

  it("should emit click-options when clicking on the options", async () => {
    const wrapper = createWrapper();

    await wrapper.setProps({
      showOptions: true
    })

    const options = wrapper.find(".sw-popover-item__options");

    await options.trigger('click');

    expect(wrapper.emitted('click-options')).toBeTruthy();
  });

  it("should show the borderTop", async () => {
    const wrapper = createWrapper();

    await wrapper.setProps({
      borderTop: true
    })

    expect(wrapper.classes()).toContain('sw-popover-item--border-top');
    expect(wrapper.classes()).not.toContain('sw-popover-item--border-bottom');
  });

  it("should show the borderBottom", async () => {
    const wrapper = createWrapper();

    await wrapper.setProps({
      borderBottom: true
    })

    expect(wrapper.classes()).not.toContain('sw-popover-item--border-top');
    expect(wrapper.classes()).toContain('sw-popover-item--border-bottom');
  });

  it("should show both borders", async () => {
    const wrapper = createWrapper();

    await wrapper.setProps({
      borderTop: true,
      borderBottom: true
    })

    expect(wrapper.classes()).toContain('sw-popover-item--border-top');
    expect(wrapper.classes()).toContain('sw-popover-item--border-bottom');
  });

  it("should show no borders", async () => {
    const wrapper = createWrapper();

    expect(wrapper.classes()).not.toContain('sw-popover-item--border-top');
    expect(wrapper.classes()).not.toContain('sw-popover-item--border-bottom');
  });
});
