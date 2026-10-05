import { flushPromises, mount } from "@vue/test-utils";
import MtSelect from "./mt-select.vue";

async function createWrapper({ props = {}, slots = {} } = {}) {
  const wrapper = mount(MtSelect, {
    props: {
      modelValue: "becky",
      options: [
        {
          id: 1,
          label: "Option Alfred",
          value: "alfred",
        },
        {
          id: 2,
          label: "Option Becky",
          value: "becky",
        },
        {
          id: 3,
          label: "Option C",
          value: "c",
        },
      ],
      ...props,
    },
    slots,
  });

  await wrapper.vm.$nextTick();

  return wrapper;
}

// mock debounce from '@/utils/debounce'
vi.mock("@/utils/debounce", () => ({
  debounce: (fn: (...args: any[]) => void) => fn,
}));

describe("mt-select", () => {
  it("should render the select component", async () => {
    const wrapper = await createWrapper();

    expect(wrapper.vm).toBeDefined();
  });

  it("should render only one single select result with type string", async () => {
    const wrapper = await createWrapper();

    const itemHolder = wrapper.findAll(".mt-select-selection-list__input");

    expect(itemHolder).toHaveLength(1);
    expect((itemHolder.at(0)?.element as HTMLInputElement).value).toBe("Option Becky");
  });

  it("should render only one single select result with type number", async () => {
    const wrapper = await createWrapper();
    await wrapper.setProps({
      modelValue: 25,
      options: [
        { id: 5, label: "5", value: 5 },
        { id: 10, label: "10", value: 10 },
        { id: 25, label: "25", value: 25 },
        { id: 50, label: "50", value: 50 },
      ],
    });

    const itemHolder = wrapper.findAll(".mt-select-selection-list__input");

    expect(itemHolder).toHaveLength(1);
    expect((itemHolder.at(0)?.element as HTMLInputElement).value).toBe("25");
  });

  it("should render a label for option with id 0", async () => {
    const wrapper = await createWrapper();
    await wrapper.setProps({
      modelValue: 0,
      options: [
        { id: 0, label: "Id 0", value: 0 },
        { id: 10, label: "Id 10", value: 10 },
      ],
    });

    const itemHolder = wrapper.findAll(".mt-select-selection-list__input");

    expect(itemHolder).toHaveLength(1);
    expect((itemHolder.at(0)?.element as HTMLInputElement).value).toBe("Id 0");
  });

  it("should select an object value by id", async () => {
    const wrapper = await createWrapper();
    await wrapper.setProps({
      modelValue: { id: 2, label: "Option Becky", value: "becky" },
      options: [
        { id: 1, label: "Option Alfred", value: "alfred" },
        { id: 2, label: "Option Becky", value: "becky" },
        { id: 3, label: "Option C", value: "c" },
      ],
    });

    const itemHolder = wrapper.findAll(".mt-select-selection-list__input");

    expect(itemHolder).toHaveLength(1);
    expect((itemHolder.at(0)?.element as HTMLInputElement).value).toBe("Option Becky");
  });

  it("should select an object value by value property prop", async () => {
    const wrapper = await createWrapper();
    await wrapper.setProps({
      modelValue: { id: 2, label: "Option Becky", value: "becky" },
      valueProperty: "label",
      options: [
        { id: 1, label: "Option Alfred", value: "alfred" },
        { id: 2, label: "Option Becky", value: "becky" },
        { id: 3, label: "Option C", value: "c" },
      ],
    });

    const itemHolder = wrapper.findAll(".mt-select-selection-list__input");

    expect(itemHolder).toHaveLength(1);
    expect((itemHolder.at(0)?.element as HTMLInputElement).value).toBe("Option Becky");
  });

  it("should use fallback property from an array of label properties", async () => {
    const wrapper = await createWrapper();
    await wrapper.setProps({
      modelValue: "user1",
      labelProperty: ["name", "username", "email"],
      options: [
        { id: 1, username: "User 1", email: "user1@example.com", value: "user1" },
        { id: 2, name: "User Two", username: "user2", value: "user2" },
        { id: 3, name: "", username: "", email: "user3@example.com", value: "user3" },
      ],
    });
    const itemHolder = wrapper.findAll(".mt-select-selection-list__input");

    expect(itemHolder).toHaveLength(1);
    expect((itemHolder.at(0)?.element as HTMLInputElement).value).toBe("User 1");
  });

  it("should search in all properties of the labelProperty array", async () => {
    vi.useFakeTimers();
    const wrapper = await createWrapper();
    await wrapper.setProps({
      labelProperty: ["name", "username", "email"],
      options: [
        { id: 1, username: "user1", email: "user1@example.com", value: "user1" },
        { id: 2, name: "User Two", username: "user2", value: "user2" },
        { id: 3, name: "", username: "", email: "test@example.com", value: "user3" },
      ],
    });

    // Simulate a search
    wrapper.vm.onSearchTermChange("test");
    await flushPromises();

    // Check that the search found the item with 'test' in the email field
    expect(wrapper.vm.visibleResults.length).toBe(1);
    expect(wrapper.vm.visibleResults[0].value).toBe("user3");
  });

  it("displays a hint passed via the hint prop", async () => {
    const wrapper = await createWrapper({ props: { hint: "Hint from prop" } });

    expect(wrapper.find(".mt-field-hint").text()).toContain("Hint from prop");
  });

  it("renders markup passed via the hint slot", async () => {
    const wrapper = await createWrapper({
      slots: { hint: '<span data-testid="custom-hint">Hint from slot</span>' },
    });

    expect(wrapper.find('[data-testid="custom-hint"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="custom-hint"]').text()).toBe("Hint from slot");
  });

  it("does not render a hint when neither prop nor slot is provided", async () => {
    const wrapper = await createWrapper();

    expect(wrapper.find(".mt-field-hint").exists()).toBe(false);
  });

  it("should select the active item with the enter key", async () => {
    const wrapper = mount(MtSelect, {
      props: {
        modelValue: null,
        options: [
          { id: 1, label: "Option Alfred", value: "alfred" },
          { id: 2, label: "Option Becky", value: "becky" },
        ],
      },
      attachTo: document.body,
    });
    await flushPromises();

    await wrapper.find(".mt-select__selection").trigger("click");
    await flushPromises();

    const input = wrapper.find(".mt-select-selection-list__input");
    await input.trigger("keydown", { key: "ArrowDown" });
    await input.trigger("keydown", { key: "Enter" });
    await flushPromises();

    expect(wrapper.emitted("update:modelValue")?.[0]).toEqual(["becky"]);
    expect(document.querySelector(".mt-select-result-list__content")).toBeNull();

    wrapper.unmount();
  });

  it("should show the selected value as input value on focus and only filter after the user edits it", async () => {
    const wrapper = await createWrapper();
    const input = wrapper.find(".mt-select-selection-list__input");

    await input.trigger("focus");

    expect((input.element as HTMLInputElement).value).toBe("Option Becky");
    expect((input.element as HTMLInputElement).placeholder).not.toBe("Option Becky");
    expect(wrapper.vm.visibleResults).toHaveLength(3);

    await input.setValue("Option Beck");
    await flushPromises();

    expect((input.element as HTMLInputElement).value).toBe("Option Beck");
    expect(wrapper.vm.visibleResults).toHaveLength(1);
    expect(wrapper.vm.visibleResults[0].value).toBe("becky");

    wrapper.vm.onSelectCollapsed();
    await flushPromises();
    await input.trigger("focus");

    expect((input.element as HTMLInputElement).value).toBe("Option Becky");
    expect(wrapper.vm.visibleResults).toHaveLength(3);
  });

  it("renders a help text when the helpText prop is set", async () => {
    const wrapper = await createWrapper({ props: { label: "Select", helpText: "Some help" } });

    expect(wrapper.find(".mt-field__help-text").exists()).toBe(true);
  });

  it("marks the label as required when the required prop is set", async () => {
    const wrapper = await createWrapper({ props: { label: "Select", required: true } });

    expect(wrapper.find("label").classes()).toContain("mt-field-label--is-required");
  });

  it("renders a copy button with the selected label when the copyable prop is set", async () => {
    const wrapper = await createWrapper({ props: { label: "Select", copyable: true } });

    const copyable = wrapper.findComponent({ name: "MtFieldCopyable" });

    expect(copyable.exists()).toBe(true);
    expect(copyable.props("copyableText")).toBe("Option Becky");
  });

  it("renders an error message when the error prop is set", async () => {
    const wrapper = await createWrapper({
      props: { label: "Select", error: { code: 500, detail: "There is an error" } },
    });

    expect(wrapper.find(".mt-field__error").text()).toContain("There is an error");
  });

  it("disables the selection input when the disabled prop is set", async () => {
    const wrapper = await createWrapper({ props: { label: "Select", disabled: true } });

    expect(wrapper.find(".mt-select-selection-list__input").attributes("disabled")).toBeDefined();
  });

  it("renders an inheritance switch when the isInheritanceField prop is set", async () => {
    const wrapper = await createWrapper({ props: { label: "Select", isInheritanceField: true } });

    expect(wrapper.find('button[aria-label="Link inheritance"]').exists()).toBe(true);
  });

  it("marks the field as inherited when the isInherited prop is set", async () => {
    const wrapper = await createWrapper({
      props: { label: "Select", isInheritanceField: true, isInherited: true },
    });

    expect(wrapper.classes()).toContain("is--inherited");
    expect(wrapper.find('button[aria-label="Unlink inheritance"]').exists()).toBe(true);
  });

  it("disables the inheritance switch when the disableInheritanceToggle prop is set", async () => {
    const wrapper = await createWrapper({
      props: {
        label: "Select",
        isInheritanceField: true,
        isInherited: true,
        disableInheritanceToggle: true,
      },
    });

    expect(
      wrapper.find('button[aria-label="Unlink inheritance"]').attributes("disabled"),
    ).toBeDefined();
  });

  it("renders the small variant when the small prop is set", async () => {
    const wrapper = await createWrapper({ props: { label: "Select", small: true } });

    expect(wrapper.classes()).toContain("mt-select--small");
    expect(wrapper.findComponent({ name: "MtSelectSelectionList" }).props("size")).toBe("small");
  });

  it("accepts the validation prop without rendering it as an attribute", async () => {
    const wrapper = await createWrapper({ props: { label: "Select", validation: "required" } });

    expect(wrapper.attributes("validation")).toBeUndefined();
  });
});
