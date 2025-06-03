import { mount } from "@vue/test-utils";
import MtSelect from "../mt-select/mt-select.vue";

async function createWrapper() {
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
    },
  });

  await wrapper.vm.$nextTick();

  return wrapper;
}

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
    vi.useFakeTimers()
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
    await vi.runAllTimers();
    await wrapper.vm.$nextTick();

    // Check that the search found the item with 'test' in the email field
    expect(wrapper.vm.visibleResults.length).toBe(1);
    expect(wrapper.vm.visibleResults[0].value).toBe("user3");
  });
});
