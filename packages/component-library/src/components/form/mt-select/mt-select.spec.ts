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

  it("should return null when single selection is cleared", async () => {
    const wrapper = await createWrapper();

    await wrapper.setProps({
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
          label: "Option Jane",
          value: "jane",
        },
      ],
    });

    // Verify starting values
    const itemHolder = wrapper.findAll(".mt-select-selection-list__input");
    expect(itemHolder).toHaveLength(1);

    // Click the clear button
    const clearButton = wrapper.find('[data-testid="select-clear-button"]');
    await clearButton.trigger("click");

    expect(wrapper.emitted("update:modelValue")?.[0]).toEqual([null]);
  });

  it("should render multiple selections correctly", async () => {
    const wrapper = await createWrapper();

    await wrapper.setProps({
      modelValue: ["alfred", "becky", "jane"],
      enableMultiSelection: true,
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
          label: "Option Jane",
          value: "jane",
        },
      ],
    });

    const itemHolders = wrapper.findAll(".mt-select-selection-list__item-holder");
    expect(itemHolders).toHaveLength(3);

    // Click the clear button
    const clearButton = wrapper.find('[data-testid="select-clear-button"]');
    await clearButton.trigger("click");

    // Verify that an empty array is emitted
    expect(wrapper.emitted("update:modelValue")?.[0]).toEqual([[]]);
  });
});
